/*!
  Set of base jake tasks. Those tasks do not require objective-j runtime.
*/
global.CONFIGURATIONS = ['Debug', 'Release'];
global.FILE = require('fs');
global.PATH = require('path');

global.tasks = {};

global.tasks.subjake = function(folder, dependencies)
{
    dependencies = dependencies || [];

    task(folder, dependencies, function()
    {
        jake.exec(['cd ' + folder + ' && jake --trace'], function()
        {
            complete();
        }, {stdout:true, stderr:true});
    }, {async: true});
};

global.tasks.minify = function(/* String */ targetPath, /* String */ sourcePath, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    var targetDir = PATH.dirname(targetPath);
    jake.mkdirP(targetDir);
    dependencies = dependencies.concat([sourcePath]);

    file(targetPath, dependencies, function()
    {
        var uglify = require("uglify-js"),
            originalCode,
            compressedCode;

        originalCode = FILE.readFileSync(sourcePath).toString();

        console.log('[MINIFY] %s', PATH.basename(sourcePath));

        try
        {
            compressedCode = uglify.minify(sourcePath).code;
        }
        catch(error)
        {
            var errorLines = originalCode.split('\n').slice(error.line - 2, error.line),
                gutterWidth = error.line.toString().length + 3;

            console.log('\nError while processing ' + sourcePath + '\n');

            for (var i = 0; i < errorLines.length; i++)
            {
                var lineNumber = (error.line + i - 1).toString();

                if (lineNumber.length < gutterWidth - 3)
                    lineNumber = ' ' + lineNumber;

                console.log((lineNumber) + ' # ' + errorLines[i]);
                if (i == 1)
                    console.log(Array(error.col + gutterWidth).join(' ') + '^ ' + error.message);
            }
            console.log('\n');
            throw error;
        }

        FILE.writeFileSync(targetPath, compressedCode);
    });
};

global.tasks.copy = function(/* String */ targetPath, /* String */ sourcePath, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    var targetDir = PATH.dirname(targetPath);
    jake.mkdirP(targetDir);
    dependencies = dependencies.concat([targetDir, sourcePath]);

    file(targetPath, dependencies, function()
    {
        console.log('[COPY] %s', PATH.basename(targetPath));

        if (options.copyToDirectory)
            targetPath = PATH.dirname(targetPath);

        jake.cpR(sourcePath, targetPath);
    });
};


global.tasks.preprocess = function(/* String */ targetPath, /* String */ sourcePath, /* Array */ dependencies, /* Object */ options)
{
    options = options || {};
    dependencies = dependencies || [];

    var targetDir = PATH.dirname(targetPath);
    jake.mkdirP(targetDir);
    dependencies = dependencies.concat([sourcePath]);

    file(targetPath, dependencies, function()
    {
        var flags = ['-I.'],
            cmd;

        if (options.flags)
            flags = flags.concat(options.flags);

        cmd = ['gcc', '-w', '-E', '-x c', '-P'].concat(flags).concat([sourcePath, '-o', targetPath]).join(' ');

        jake.exec([cmd], function()
        {
            console.log('[CPP] %s', PATH.basename(sourcePath));
            complete();
        }, {stdout:true, stderr:true});
    }, {async: true});
};

global.tasks.nodePackage = function(taskName, dependencies, options)
{
    options = options || {};
    dependencies = dependencies || [];

    var buildDir = options.buildDirectory || 'Build',
        productName = options.productName,
        packagesDir = PATH.join(buildDir, 'Packages'),
        packageJSON,
        packageName,
        packageDir,
        packageJSONPath;

    try
    {
        packageJSON = JSON.parse(FILE.readFileSync('package.json').toString());
        packageName = packageJSON.name;
        packageDir = PATH.join(packagesDir, packageName);
        packageJSONPath = PATH.join(packageDir, 'package.json');
    }
    catch(err)
    {
        fail('Invalid package.json');
    }


    desc('Build ' + taskName);
    task(taskName + '-build', dependencies, function()
    {
        if (!productName)
            fail('No product name for ' + taskName);

        if (!packageName)
            fail('Package.json has no name');

        jake.mkdirP(packageDir);
        jake.cpR('package.json', packageJSONPath);

        CONFIGURATIONS.forEach(function(configName)
        {
            jake.mkdirP(PATH.join(packageDir, configName));
            jake.cpR(PATH.join(buildDir, configName, productName), PATH.join(packageDir, configName));
        });
        jake.cpR('package.json', packageDir);
    });

    desc('Install ' + taskName);
    task(taskName + '-install', [taskName + '-build'], function()
    {
        var cmd = 'npm install -g ' + packageDir;
        jake.exec([cmd], function()
        {
            console.log('[NPM INSTALL] %s', packageName);
            complete();
        }, {stdout:true, stderr:true});
    }, {async:true});

    if (options.install)
    {

        desc(taskName);
        task(taskName, [taskName + '-install']);
    }
    else
    {
        desc(taskName);
        task(taskName, [taskName + '-build']);
    }


};