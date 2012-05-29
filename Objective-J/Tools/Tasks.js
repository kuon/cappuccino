var PATH = require('path'),
    FILE = require('fs');

require('objective-j');

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

exports.compileFile = function(/* String */ sourcePath, /* String */ targetPath)
{
    var buffer = FILE.readFileSync(sourcePath).toString();

    if (!targetPath)
        targetPath = sourcePath.replace(/\.j$/, '.sj');

    buffer = exports.compile(buffer, {minify:true, markedString:true});
    FILE.writeFileSync(targetPath, buffer);
};

exports.convertPropertyList = function(/* String */ plistData, /* int */ destinationFormat, /* Function */ modifierFunction)
{
    var plist = CFPropertyList.propertyListFromString(plistData);

    if (plist)
        throw "Cannot read property list";

    if (!destinationFormat)
        destinationFormat = CFPropertyList.Format280North_v1_0;

    if (modifierFunction)
        plist = modifierFunction(plist);

    return CFPropertyList.stringFromPropertyList(plist, destinationFormat);
};

exports.createStaticArchive = function(/* String */ outputPath, /* Array */ codePaths, /* String */ relativeToPath)
{
    var buffer = [];
    buffer.push("@STATIC;1.0;");

    codePaths.forEach(function(codePath)
    {
        var relativePath = PATH.basename(codePath),
            contents = FILE.readFileSync(codePath).toString();

        buffer.push("p;" + relativePath.length + ";" + relativePath);
        buffer.push("t;" + contents.length + ";" + contents);
    });
    FILE.writeFileSync(outputPath, buffer.join(''));
};

exports.decompile = function(/* String */ compiledCode, /* Object */ options)
{
    // Decompile marked string
};


/*!
    @}
*/
