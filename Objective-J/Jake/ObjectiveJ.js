/*!
  Set of bundle and objective-j related tasks. This file requires objective-j runtime.
*/

require(require('path').join(__dirname, 'Base'));

global.OBJJ = require('Objective-J/Tools/Utils');
global.NPM = require('npm');

global.tasks.makeInfoPlist = function(/* String */ targetPath, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    var targetDir = PATH.dirname(targetPath);
    jake.mkdirP(targetDir);

    if (options.originalPath)
        dependencies.push(options.originalPath);

    file(targetPath, dependencies, function()
    {
        var plist;

        if (options.originalPath)
            plist = OBJJ.readPropertyList(options.originalPath);
        else
            plist = new CFMutableDictionary();

        // FIXME support more options instead of plist file
        if (!plist.valueForKey('CPBundleIdentifier'))
            fail('CPBundleIdentifier is required');

        plist.setValueForKey("CPBundleEnvironments", ['ObjJ']);
        plist.setValueForKey("CPBundleExecutable", options.executableName);

        console.log('[PLIST] %s', PATH.basename(targetPath));
        OBJJ.writePropertyList(targetPath, plist);
    });
};

global.tasks.compile = function(/* String */ targetPath, /* String */ sourcePath, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];
    var targetDir = PATH.dirname(targetPath);
    jake.mkdirP(targetDir);
    dependencies = dependencies.concat([sourcePath]);

    file(targetPath, dependencies, function()
    {
        console.log('[OBJJC] %s', PATH.basename(sourcePath));
        OBJJ.compileFile(targetPath, sourcePath);
    });
};

global.tasks.makeStaticArchive = function(/* String */ targetPath, /* Array */ sourcePaths, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    var targetDir = PATH.dirname(targetPath);
    jake.mkdirP(targetDir);
    dependencies = dependencies.concat(sourcePaths);

    file(targetPath, dependencies, function()
    {
        console.log('[STATIC] %s', PATH.basename(targetPath));
        OBJJ.makeStaticArchive(targetPath, sourcePaths, options.relativeToPath);
    });

};

global.tasks.makeBundle = function(/* String */ name, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    if (!options.sourcePaths)
        fail('No source specified');

    if (!options.buildDirectory)
        fail('Build directory not specified');

    var targets = [],
        originalPlistPath = options.infoPlistPath || 'Info.plist',
        sourcePaths = options.sourcePaths.toArray ? options.sourcePaths.toArray() : options.sourcePaths,
        buildDir = options.buildDirectory,
        packageDir;


    CONFIGURATIONS.forEach(function(configName)
    {
        var intermediateBuildDir = PATH.join(buildDir, name + '.build/', configName),
            finalBuildDir = PATH.join(buildDir, configName, name),
            plistPath = PATH.join(finalBuildDir, 'Info.plist'),
            staticArchiveDir = PATH.join(finalBuildDir, 'ObjJ.environment'),
            staticArchivePath = PATH.join(staticArchiveDir, name + '.sj'),
            compiledPaths = [];

        sourcePaths.forEach(function(sourcePath)
        {
            var filename = options.flattensSource ? PATH.basename(sourcePath) : sourcePath,
                preprocessPath = PATH.join(intermediateBuildDir, filename),
                compiledPath = preprocessPath.replace(/\.j$/, '.sj');


            // Preprocess (CPP)
            if (options.preprocess)
                tasks.preprocess(preprocessPath, sourcePath);
            else
                tasks.copy(preprocessPath, sourcePath);


            // Compile (OBJJC)
            tasks.compile(compiledPath, preprocessPath);

            compiledPaths.push(compiledPath);
        });

        tasks.makeStaticArchive(staticArchivePath, compiledPaths, [], {relativeToPath: intermediateBuildDir});
        targets.push(staticArchivePath);

        var infoPlistOptions =
        {
            originalPath : originalPlistPath,
            executableName : PATH.basename(staticArchivePath)
        };
        tasks.makeInfoPlist(plistPath, [staticArchivePath], infoPlistOptions);
        targets.push(plistPath);

        if (options.copyFrameworks && options.frameworks)
        {
            options.frameworks.forEach(function(fName)
            {
                var srcDir = PATH.join('Frameworks', fName),
                    dstDir = PATH.join(finalBuildDir, 'Frameworks', fName);
                dependencies.push(dstDir);
                tasks.copy(dstDir, srcDir, [], {copyToDirectory: true});
            });
        }

        if (options.copyFiles)
        {
            options.copyFiles.forEach(function(filePath)
            {
                var dstPath = PATH.join(finalBuildDir, filePath);
                dependencies.push(dstPath);
                tasks.copy(dstPath, filePath, [], {copyToDirectory: true});
            });
        }
    });

    desc('Build bundle for ' + name);
    task(name + '-bundle', targets.concat(dependencies));

    dependencies = [name + '-bundle'];

    if (PATH.existsSync('package.json'))
    {
        tasks.nodePackage(name + '-package', dependencies, {buildDirectory: buildDir, productName: name, install: options.installNodePackage});
        dependencies = [name + '-package'];
    }

    desc('Build ' + name);
    task(name, dependencies);
};

global.tasks.makeFramework = function(/* String */ name, /* Array */ dependencies, /* Object */ options)
{
    tasks.makeBundle(name, dependencies, options);
};

global.tasks.makeApplication = function(/* String */ name, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    options.copyFrameworks = true;

    var plist = OBJJ.readPropertyList('Build.plist');

    if (!plist)
        fail('Cannot read Build.plist');

    var fileList = new jake.FileList();

    plist.valueForKey('CPSources').forEach(function(item)
    {
        fileList.include(item);
    });

    options.sourcePaths = fileList.toArray() || [];
    options.buildDirectory = plist.valueForKey('CPBuildDirectory') || 'Build';
    options.copyFiles = plist.valueForKey('CPCopyFiles') || [];
    options.frameworks = plist.valueForKey('CPFrameworks') || ['Objective-J', 'Foundation', 'AppKit'];
    if (options.frameworks.indexOf('Objective-J') === -1)
        options.frameworks.unshift('Objective-J');

    var res = plist.valueForKey('CPResources');

    if (res)
    {
        var resourceFileList = new jake.FileList();
        res.forEach(function(item)
        {
            resourceFileList.include(item);
        });
        options.copyFiles = options.copyFiles.concat(resourceFileList.toArray());
    }

    tasks.linkFrameworks(nil, [], {frameworks:options.frameworks});
    if (options.alwaysLinkFrameworks)
        dependencies.push('link-frameworks');

    tasks.makeBundle(name, dependencies, options);
};

global.tasks.linkFrameworks = function(/* String */ name, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    task('load-npm', function()
    {
        var npmConfig = {loglevel:'silent'};
        NPM.load(npmConfig, function()
        {
            complete();
        });
    }, {async : true});

    task('link-modules', ['load-npm'].concat(dependencies), function()
    {
        var frameworks = (options.frameworks || []).slice(0);

        for (var i = 0; i < frameworks.length; i++)
        {
            var fname = frameworks[i];
            if (fname == 'Objective-J')
                continue;

            frameworks[i] = 'Cappuccino-' + fname;
        }

        NPM.commands.link(frameworks, function()
        {
            complete();
        });
    }, {async : true});

    task('link-frameworks', ['link-modules'], function()
    {
        jake.mkdirP('Frameworks/Debug');

        var frameworks = (options.frameworks || []).slice(0);

        for (var i = 0; i < frameworks.length; i++)
        {
            var fname = frameworks[i],
                moduleName = (fname == 'Objective-J' ? fname : 'Cappuccino-' + fname);

            var sourcePath = PATH.join('..', 'node_modules', moduleName, 'Release', fname),
                targetPath = PATH.join('Frameworks', fname),
                debugSourcePath = PATH.join('..', '..', 'node_modules', moduleName, 'Debug', fname),
                debugTargetPath = PATH.join('Frameworks', 'Debug', fname);

            try
            {
                FILE.unlinkSync(targetPath);
            }
            catch(e) {}
            try
            {
                FILE.unlinkSync(debugTargetPath);
            }
            catch(e) {}

            FILE.symlinkSync(sourcePath, targetPath, 'dir');
            FILE.symlinkSync(debugSourcePath, debugTargetPath, 'dir');
        }
    });

};

