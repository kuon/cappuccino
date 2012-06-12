#!/usr/bin/env node

require('Objective-J');

var OPTIMIST = require('optimist'),
    PATH = require('path'),
    FILE = require('fs');

var argv = OPTIMIST
    .wrap(80)
    .usage('Compile an Objective-J file.\nUsage: $0 [options] file...')
    .alias('h', 'help')
    .default('o', 'stdout')
    .default('C', true)
    .boolean('C')
    .alias('C', 'compress')
    .describe('h', 'print help')
    .describe('o', 'output file')
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
        fileContents;

    if (!PATH.existsSync(filePath))
    {
        console.error('File not found: ' + filePath);
        return;
    }

    console.log('[OBJC] %s', filePath);

    fileContents = FILE.readFileSync(filePath).toString();

    compiledFiles.push(
    {
        contents: OBJJ.compile(fileContents, {minify: argv.C}),
        path: PATH.resolve(filePath)
    });
}

