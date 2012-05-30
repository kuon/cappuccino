/*!
  Set of bundle and objective-j related tasks. This file requires objective-j runtime.
*/

require(require('path').join(__dirname, 'Base'));

global.OBJJ = require('Objective-j/Tools/Utils');

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
        OBJJ.makeStaticArchive(targetPath, sourcePaths);
    });

};

global.tasks.makeBundle = function(/* String */ name, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    var targets = [],
        originalPlistPath = options.infoPlistPath || 'Info.plist',
        sourcePaths = options.sourcePaths.toArray(),
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
            var filename = PATH.basename(sourcePath),
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

        tasks.makeStaticArchive(staticArchivePath, compiledPaths);
        targets.push(staticArchivePath);

        var infoPlistOptions =
        {
            originalPath : originalPlistPath,
            executableName : PATH.basename(staticArchivePath)
        };
        tasks.makeInfoPlist(plistPath, [staticArchivePath], infoPlistOptions);
        targets.push(plistPath);
    });

    task(name + '-bundle', targets.concat(dependencies));

    dependencies = [name + '-bundle'];

    if (PATH.existsSync('package.json'))
    {
        tasks.nodePackage(name + '-package', dependencies, {buildDirectory: buildDir, productName: name, install: options.installNodePackage});
        dependencies = [name + '-package'];
    }

    task(name, dependencies);
};

global.tasks.makeFramework = function(/* String */ name, /* Array */ dependencies, /* Object */ options)
{
    tasks.makeBundle(name, dependencies, options);
};
