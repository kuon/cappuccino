
var FileExecutablesForURLStrings = { };

function FileExecutable(/*CFURL|String*/ aURL)
{
    aURL = makeAbsoluteURL(aURL);

    var URLString = aURL.absoluteString(),
        existingFileExecutable = FileExecutablesForURLStrings[URLString];

    if (existingFileExecutable)
        return existingFileExecutable;

    FileExecutablesForURLStrings[URLString] = this;

    var fileContents = StaticResource.resourceAtURL(aURL).contents(),
        executable = NULL,
        extension = aURL.pathExtension();

    if (fileContents.match(/^@STATIC;/))
        executable = decompile(fileContents, aURL);

    else if (extension === "j" || !extension)
        executable = objj_preprocess(fileContents, aURL, Preprocessor.Flags.IncludeDebugSymbols);

    else
        executable = new Executable(fileContents, [], aURL);

    Executable.apply(this, [executable.code(), executable.fileDependencies(), aURL, executable._function]);

    this._hasExecuted = NO;
}

GLOBAL(objj_fileExecutable) = FileExecutable;

FileExecutable.prototype = new Executable();

FileExecutable.allFileExecutables = function()
{
    var URLString,
        fileExecutables = [];

    for (URLString in FileExecutablesForURLStrings)
        if (hasOwnProperty.call(FileExecutablesForURLStrings, URLString))
            fileExecutables.push(FileExecutablesForURLStrings[URLString]);

    return fileExecutables;
};

FileExecutable.prototype.execute = function(/*BOOL*/ shouldForce)
{
    if (this._hasExecuted && !shouldForce)
        return;

    this._hasExecuted = YES;

    Executable.prototype.execute.call(this);
};

DISPLAY_NAME(FileExecutable.prototype.execute);

FileExecutable.prototype.hasExecuted = function()
{
    return this._hasExecuted;
};

DISPLAY_NAME(FileExecutable.prototype.hasExecuted);

function decompile(/*String*/ aString, /*CFURL*/ aURL)
{
    var stream = new MarkedStream(aString);
/*
    if (stream.version !== "1.0")
        return;
*/
    var marker = NULL,
        code = "",
        dependencies = [];

    while (marker = stream.getMarker())
    {
        var text = stream.getString();

        if (marker === MARKER_TEXT)
            code += text;

        else if (marker === MARKER_IMPORT_STD)
            dependencies.push(new FileDependency(new CFURL(text), NO));

        else if (marker === MARKER_IMPORT_LOCAL)
            dependencies.push(new FileDependency(new CFURL(text), YES));
    }

    var fn = FileExecutable._lookupCachedFunction(aURL)
    if (fn)
        return new Executable(code, dependencies, aURL, fn);

    return new Executable(code, dependencies, aURL);
}

var FunctionCache = { };

FileExecutable._cacheFunction = function(/*CFURL|String*/ aURL, /*Function*/ fn)
{
    aURL = typeof aURL === "string" ? aURL : aURL.absoluteString();
    FunctionCache[aURL] = fn;
};

FileExecutable._lookupCachedFunction = function(/*CFURL|String*/ aURL)
{
    aURL = typeof aURL === "string" ? aURL : aURL.absoluteString();
    return FunctionCache[aURL];
};
