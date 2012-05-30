#!/usr/bin/env node

require('objective-j');

var OPTIMIST = require('optimist'),
    PATH = require('path'),
    FILE = require('fs');

var argv = OPTIMIST
    .wrap(80)
    .usage('Compile an Objective-J file.\nUsage: $0 [options] file...')
    .alias('h', 'help')
    .default('o', 'stdout')
    .default('unmarked', false)
    .boolean('unmarked')
    .default('T', true)
    .boolean('T')
    .default('C', true)
    .boolean('C')
    .alias('C', 'compress')
    .describe('h', 'print help')
    .describe('T', 'include type signatures in the compiled output')
    .describe('o', 'output file')
    .describe('unmarked', "don't tag the output with @STATIC header")
    .describe('C', 'compress output with javascript minifier')
    .argv
;

if (argv.h)
{
    OPTIMIST.showHelp();
    return;
}

if (!argv._.length)
{
    OPTIMIST.showHelp();
    console.error('At least one input file is required');
    return;
}

var compiledFiles = [];


for (var i = 0; i < argv._.length; i++)
{
    var filePath = argv._[i],
        fileContents,
        executable;

    if (!PATH.existsSync(filePath))
    {
        console.error('File not found: ' + filePath);
        return;
    }

    console.log('[OBJC] %s', filePath);

    fileContents = FILE.readFileSync(filePath).toString();

    executable = objj_preprocess(fileContents, PATH.basename(filePath));
    if (argv.C)
    {
        var parser = require("uglify-js").parser,
            uglify = require("uglify-js").uglify,
            compiledCode = executable.code(),
            compressedCode;

        compressedCode = parser.parse(compiledCode);
        compressedCode = uglify.ast_mangle(compressedCode);
        compressedCode = uglify.ast_squeeze(compressedCode);
        compressedCode = uglify.gen_code(compressedCode);
        executable.setCode(compressedCode);
    }

    compiledFiles.push(
    {
        contents: argv.unmarked ? executable.code() : executable.toMarkedString(),
        path: PATH.resolve(filePath)
    });
}

var output = [];

if (!argv.unmarked)
    output.push("@STATIC;1.0;");

compiledFiles.forEach(function(compiledFile)
{
    var relativePath = PATH.basename(compiledFile.path).replace(/\.sj$/, '.j'),
        contents = compiledFile.contents;

    if (!argv.unmarked)
    {
        output.push("p;" + relativePath.length + ";" + relativePath);
        output.push("t;" + contents.length + ";" + contents);
    }
    else
        output.push(contents);
});

if (argv.o === 'stdout')
    console.log(output.join(''));
else
    FILE.writeFileSync(argv.o, output.join(''));
