require(__dirname + '/bundle.js');

global.framework = function(/* String */ name, /* Object */ options)
{
    var targets = [],
        infoPlist = 'Info.plist',
        buildDirectory = options.buildDirectory;

    sources = options.sources.toArray();

    CONFIGURATIONS.forEach(function(configName)
    {
        var intermediateBuildDir = PATH.join(buildDirectory, name + '.build/', configName),
            intermediateTargets = [],
            finalBuildDir = PATH.join(buildDirectory, configName, name),
            staticTarget = PATH.join(finalBuildDir, name + '.sj'),
            infoTarget = PATH.join(finalBuildDir, infoPlist);


        recursiveDirectory(intermediateBuildDir);
        recursiveDirectory(finalBuildDir);

        sources.forEach(function(source)
        {
            var flags = ['-I.'],
                filename = PATH.basename(source),
                intermediateTarget = PATH.join(intermediateBuildDir, filename);


            file(intermediateTarget, [intermediateBuildDir, source], function()
            {
                if (options.cpp)
                    cpp(source, intermediateTarget, flags);
                else
                {
                    jake.cpR(source, intermediateTarget);
                    complete();
                }
            }, {async: true});

            intermediateTargets.push(intermediateTarget);

        });

        file(staticTarget, [finalBuildDir].concat(intermediateTargets), function()
        {
            compile(intermediateTargets, staticTarget);
        }, {async: true});

        targets.push(staticTarget);

        // TODO: more to do with the plist
        file(infoTarget, [finalBuildDir, infoPlist], function()
        {
            jake.cpR(infoPlist, infoTarget);
        });
        targets.push(infoTarget);
    });

    desc('Build framework ' + name);
    task(name, targets);

};
