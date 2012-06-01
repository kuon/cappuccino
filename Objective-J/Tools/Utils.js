var PATH = require('path'),
    FILE = require('fs');

require('Objective-J');

/*!
    @defgroup objective-j/tasks Objective-J tasks
    @{
*/

/*!
    Compile objective-j code.
    @param source a string containing the objective-j code
    @param options the options object
    @param options:markedString return a marked js string
    @param options:minify minify the resulting javascript
    @param options:filename the filename to use for error message
    @return compiled javascript source or marked string
*/
exports.compile = function(/* String */ source, /* Object */ options)
{
    options = options || {};

    var executable = objj_preprocess(source, options.filename);

    if (options.minify)
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

    return options.markedString ? executable.toMarkedString() : executable.code();

};

exports.compileFile = function(/* String */ targetPath, /* String */ sourcePath)
{
    var buffer = FILE.readFileSync(sourcePath).toString();

    if (!targetPath)
        targetPath = sourcePath.replace(/\.j$/, '.sj');

    buffer = exports.compile(buffer, {minify:true, markedString:true});
    FILE.writeFileSync(targetPath, buffer);
};

exports.readPropertyList = function(/* String */ plistPath)
{
    var plistData = FILE.readFileSync(plistPath).toString(),
        plist = CFPropertyList.propertyListFromString(plistData);

    if (!plist)
        throw "Cannot read property list";

    return plist;
};

exports.writePropertyList = function(/* String */ plistPath, /* CFPropertyList */ plist, /* int */ destinationFormat)
{
    if (!destinationFormat)
        destinationFormat = CFPropertyList.Format280North_v1_0;

    var buffer = CFPropertyList.stringFromPropertyList(plist, destinationFormat);
    FILE.writeFileSync(plistPath, buffer);
};


exports.makeStaticArchive = function(/* String */ outputPath, /* Array */ codePaths, /* String */ relativeToPath)
{
    var buffer = [];
    buffer.push("@STATIC;1.0;");

    codePaths.forEach(function(codePath)
    {
        var relativePath = relativeToPath ? PATH.relative(relativeToPath, codePath) : PATH.basename(codePath),
            headerPath = relativePath.replace(/\.sj$/, '.j'),
            contents = FILE.readFileSync(codePath).toString();

        buffer.push("p;" + headerPath.length + ";" + headerPath);
        buffer.push("t;" + contents.length + ";" + contents);
    });
    FILE.writeFileSync(outputPath, buffer.join(''));
};

exports.decompile = function(/* String */ compiledCode, /* Object */ options)
{
    // Decompile marked string
};

exports.decomposeStaticArchive = function(/* String */ outputDirectory, /* String */ archivePath)
{
};


/*!
    @}
*/
