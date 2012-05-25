global.CONFIGURATIONS = ['Debug', 'Release'];
global.FILE = require('fs');
global.PATH = require('path');

global.cpp = function(source, target, flags)
{
    var cmd = ['gcc', '-w', '-E', '-x c', '-P'].concat(flags).concat([source, '-o', target]).join(' ');

    jake.exec([cmd], function()
    {
        console.log('[CPP] %s', source);
        complete();
    }, {stdout:true, stderr:true});
};

global.compile = function(sources, target)
{
    if (typeof(sources) === 'string')
        sources = [sources];

    var cmd = ['objjc'].concat(sources).concat(['-o', target]).join(' ');
    jake.exec([cmd], function()
    {
        complete();
    }, {stdout:true, stderr:true});
};

global.subjake = function(folder, deps)
{
    if (deps === undefined)
        deps = [];

    task(folder, deps, function()
    {
        jake.exec(['cd ' + folder + ' && jake'], function()
        {
            complete();
        }, {stdout:true, stderr:true});
    }, {async: true});
};

global.minify = function(source, target)
{
    var parser = require("uglify-js").parser,
        uglify = require("uglify-js").uglify,
        originalCode,
        compressedCode;

    originalCode = FILE.readFileSync(source).toString();

    console.log('[MINIFY] %s', source);

    try
    {
        compressedCode = parser.parse(originalCode, true);
    }
    catch(error)
    {
        var errorLines = originalCode.split('\n').slice(error.line - 2, error.line),
            gutterWidth = error.line.toString().length + 3;

        console.log('\nError while processing ' + source + '\n');

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

    compressedCode = uglify.ast_mangle(compressedCode);
    compressedCode = uglify.ast_squeeze(compressedCode);
    compressedCode = uglify.gen_code(compressedCode);
    FILE.writeFileSync(target, compressedCode);
};

global.recursiveDirectory = function(path)
{
    var cpmts = path.split('/'),
        paths = [];

    for (var i = 0; i < cpmts.length; i++)
    {
        var parentPath = cpmts.slice(0, i).join('/'),
            currentPath = cpmts.slice(0, i+1).join('/');

        if (parentPath)
            directory(currentPath, [parentPath]);
        else
            directory(currentPath);
    }
};
