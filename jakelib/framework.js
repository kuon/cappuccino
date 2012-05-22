
global.framework = function(/* String */ name, /* Object */ options)
{
    var intermediateTargets = [],
        buildDirectory = options.buildDirectory;

    sources = options.sources.toArray();

    CONFIGURATIONS.forEach(function(configName)
    {
        var intermediateBuildDir = PATH.join(buildDirectory, name + '.build/', configName);
        recursiveDirectory(intermediateBuildDir);

        sources.forEach(function(source)
        {
            var flags = ['-I.'],
                filename = PATH.basename(source),
                intermediateTarget = PATH.join(intermediateBuildDir, filename);

            intermediateTargets.push(intermediateTarget);

            file(intermediateTarget, [intermediateBuildDir, source], function ()
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
    });

    desc('Build framework ' + name);
    task(name, intermediateTargets);

};
