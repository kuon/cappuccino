var objj = require('objective-j/tasks');

require(__dirname + '/bundle.js');

global.framework = function(/* String */ name, /* Object */ options)
{
    var targets = [],
        infoPlistPath = 'Info.plist',
        buildDirectory = options.buildDirectory;

    sourcePaths = options.sourcePaths.toArray();

    CONFIGURATIONS.forEach(function(configName)
    {
        var intermediateBuildDir = PATH.join(buildDirectory, name + '.build/', configName),
            finalBuildDir = PATH.join(buildDirectory, configName, name),
            plistPath = PATH.join(finalBuildDir, 'Info.plist'),
            staticArchiveDir = PATH.join(finalBuildDir, 'ObjJ.environment'),
            staticArchivePath = PATH.join(staticArchiveDir, name + '.sj'),
            compiledPaths = [];


        recursiveDirectory(intermediateBuildDir);
        recursiveDirectory(finalBuildDir);
        recursiveDirectory(staticArchiveDir);

        sourcePaths.forEach(function(sourcePath)
        {
            var flags = ['-I.'],
                filename = PATH.basename(sourcePath),
                preprocessPath = PATH.join(intermediateBuildDir, filename),
                compiledPath = preprocessPath.replace(/\.j$/, '.sj');


            // Preprocess (CPP)
            file(preprocessPath, [intermediateBuildDir, sourcePath], function()
            {
                if (options.cpp)
                    cpp(sourcePath, preprocessPath, flags);
                else
                {
                    jake.cpR(sourcePath, preprocessPath);
                    complete();
                }
            }, {async: true});

            // Compile (OBJJC)
            file(compiledPath, [preprocessPath], function()
            {
                console.log('[OBJJC] %s', PATH.basename(preprocessPath));
                objj.compileFile(preprocessPath, compiledPath);
            });

            compiledPaths.push(compiledPath);
        });

        file(staticArchivePath, [staticArchiveDir].concat(compiledPaths), function()
        {
            console.log('[STATIC] %s', PATH.basename(staticArchivePath));
            objj.createStaticArchive(staticArchivePath, compiledPaths);
        });

        file(plistPath, [finalBuildDir], function()
        {
            console.log(FILE.readFileSync('Info.plist').toString());
        });

        task(configName, [plistPath, staticArchivePath], function()
        {
            complete();
        }, {async: true});

    });

    desc('Build framework ' + name);
    task(name, CONFIGURATIONS);

};
