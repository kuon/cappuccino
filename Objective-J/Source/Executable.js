/***
 * Executable.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/


var ExecutableUnloadedFileDependencies  = 0,
    ExecutableLoadingFileDependencies   = 1,
    ExecutableLoadedFileDependencies    = 2,
    AnonymousExecutableCount            = 0;

function Executable(/*String*/ aCode, /*Array*/ fileDependencies, /*CFURL|String*/ aURL, /*Function*/ aFunction)
{
    if (arguments.length === 0)
        return this;

    this._code = aCode;
    this._function = aFunction || NULL;
    this._URL = makeAbsoluteURL(aURL || new CFURL("(Anonymous" + (AnonymousExecutableCount++) + ")"));

    this._fileDependencies = fileDependencies;

    if (fileDependencies.length)
    {
        this._fileDependencyStatus = ExecutableUnloadedFileDependencies;
        this._fileDependencyCallbacks = [];
    }
    else
        this._fileDependencyStatus = ExecutableLoadedFileDependencies;

    if (this._function)
        return;

    this.setCode(aCode);
}

GLOBAL(objj_executable) = Executable;

Executable.prototype.path = function()
{
    return this.URL().path();
};

Executable.prototype.URL = function()
{
    return this._URL;
};

DISPLAY_NAME(Executable.prototype.URL);

Executable.prototype.functionParameters = function()
{
    var functionParameters = ["objj_executeFile", "objj_importFile"];

    return functionParameters;
};

DISPLAY_NAME(Executable.prototype.functionParameters);

Executable.prototype.functionArguments = function()
{
    var functionArguments = [this.fileExecuter(), this.fileImporter()];

    return functionArguments;
};

DISPLAY_NAME(Executable.prototype.functionArguments);

Executable.prototype.toMarkedString = function()
{
    var markedString = "@STATIC;1.0;",
        dependencies = this.fileDependencies(),
        index = 0,
        count = dependencies.length;

    for (; index < count; ++index)
        markedString += dependencies[index].toMarkedString();

    var code = this.code();

    return markedString + MARKER_TEXT + ";" + code.length + ";" + code;
};

Executable.prototype.execute = function()
{
#ifdef EXECUTION_LOGGING
    CPLog("EXECUTION: " + this.URL());
#endif
    var oldContextBundle = CONTEXT_BUNDLE;

    // FIXME: Should we have stored this?
    CONTEXT_BUNDLE = CFBundle.bundleContainingURL(this.URL());

    var result = this._function.apply(CONFIG_GLOBAL_OBJECT, this.functionArguments());

    CONTEXT_BUNDLE = oldContextBundle;

    return result;
};

DISPLAY_NAME(Executable.prototype.execute);

Executable.prototype.code = function()
{
    return this._code;
};

DISPLAY_NAME(Executable.prototype.code);

Executable.prototype.setCode = function(code)
{
    this._code = code;

    var parameters = this.functionParameters().join(",");

#if DEBUG
    // "//@ sourceURL=" at the end lets us name our eval'd files for debuggers, etc.
    // * WebKit:  http://pmuellr.blogspot.com/2009/06/debugger-friendly.html
    // * Firebug: http://blog.getfirebug.com/2009/08/11/give-your-eval-a-name-with-sourceurl/
    //if (YES) {
        var absoluteString = this.URL().absoluteString();

        code += "/**/\n//@ sourceURL=" + absoluteString;
    //} else {
    //    // Firebug only does it for "eval()", not "new Function()". Ugh. Slower.
    //    var functionText = "(function(){"+GET_CODE(aFragment)+"/**/\n})\n//@ sourceURL="+GET_FILE(aFragment).path;
    //    compiled = eval(functionText);
    //}
#endif
        this._function = new Function(parameters, code);
#if DEBUG
    this._function.displayName = absoluteString;
#endif
};

DISPLAY_NAME(Executable.prototype.setCode);

Executable.prototype.fileDependencies = function()
{
    return this._fileDependencies;
};

DISPLAY_NAME(Executable.prototype.fileDependencies);

Executable.prototype.hasLoadedFileDependencies = function()
{
    return this._fileDependencyStatus === ExecutableLoadedFileDependencies;
};

DISPLAY_NAME(Executable.prototype.hasLoadedFileDependencies);

var fileDependencyLoadCount = 0,
    fileDependencyExecutables = [],
    fileDependencyMarkers = { };

Executable.prototype.loadFileDependencies = function(aCallback)
{
    var status = this._fileDependencyStatus;

    if (aCallback)
    {
        if (status === ExecutableLoadedFileDependencies)
            return aCallback();

        this._fileDependencyCallbacks.push(aCallback);
    }

    if (status === ExecutableUnloadedFileDependencies)
    {
        if (fileDependencyLoadCount)
            throw "Can't load";

        loadFileDependenciesForExecutable(this);
    }
};

DISPLAY_NAME(Executable.prototype.loadFileDependencies);

function loadFileDependenciesForExecutable(/*Executable*/ anExecutable)
{
    fileDependencyExecutables.push(anExecutable);
    anExecutable._fileDependencyStatus = ExecutableLoadingFileDependencies;

    var fileDependencies = anExecutable.fileDependencies(),
        index = 0,
        count = fileDependencies.length,
        referenceURL = anExecutable.referenceURL(),
        referenceURLString = referenceURL.absoluteString(),
        fileExecutableSearcher = anExecutable.fileExecutableSearcher();

    fileDependencyLoadCount += count;

    for (; index < count; ++index)
    {
        var fileDependency = fileDependencies[index],
            isQuoted = fileDependency.isLocal(),
            URL = fileDependency.URL(),
            marker = (isQuoted && (referenceURLString + " ") || "") + URL;

        if (fileDependencyMarkers[marker])
        {
            if (--fileDependencyLoadCount === 0)
                fileExecutableDependencyLoadFinished();

            continue;
        }

        fileDependencyMarkers[marker] = YES;
        fileExecutableSearcher(URL, isQuoted, fileExecutableSearchFinished);
    }
}

function fileExecutableSearchFinished(/*FileExecutable*/ aFileExecutable)
{
    --fileDependencyLoadCount;

    if (aFileExecutable._fileDependencyStatus === ExecutableUnloadedFileDependencies)
        loadFileDependenciesForExecutable(aFileExecutable);

    else if (fileDependencyLoadCount === 0)
        fileExecutableDependencyLoadFinished();
}

function fileExecutableDependencyLoadFinished()
{
    var executables = fileDependencyExecutables,
        index = 0,
        count = executables.length;

    fileDependencyExecutables = [];

    for (; index < count; ++index)
        executables[index]._fileDependencyStatus = ExecutableLoadedFileDependencies;

    for (index = 0; index < count; ++index)
    {
        var executable = executables[index],
            callbacks = executable._fileDependencyCallbacks,
            callbackIndex = 0,
            callbackCount = callbacks.length;

        for (; callbackIndex < callbackCount; ++callbackIndex)
            callbacks[callbackIndex]();

        executable._fileDependencyCallbacks = [];
    }
}

Executable.prototype.referenceURL = function()
{
    if (this._referenceURL === undefined)
        this._referenceURL = new CFURL(".", this.URL());

    return this._referenceURL;
};

DISPLAY_NAME(Executable.prototype.referenceURL);

Executable.prototype.fileImporter = function()
{
    return Executable.fileImporterForURL(this.referenceURL());
};

DISPLAY_NAME(Executable.prototype.fileImporter);

Executable.prototype.fileExecuter = function()
{
    return Executable.fileExecuterForURL(this.referenceURL());
};

DISPLAY_NAME(Executable.prototype.fileExecuter);

Executable.prototype.fileExecutableSearcher = function()
{
    return Executable.fileExecutableSearcherForURL(this.referenceURL());
};

DISPLAY_NAME(Executable.prototype.fileExecutableSearcher);

var cachedFileExecuters = { };

Executable.fileExecuterForURL = function(/*CFURL|String*/ aURL)
{
    var referenceURL = makeAbsoluteURL(aURL),
        referenceURLString = referenceURL.absoluteString(),
        cachedFileExecuter = cachedFileExecuters[referenceURLString];

    if (!cachedFileExecuter)
    {
        cachedFileExecuter = function(/*CFURL*/ aURL, /*BOOL*/ isQuoted, /*BOOL*/ shouldForce)
        {

            Executable.fileExecutableSearcherForURL(referenceURL)(aURL, isQuoted,
            function(/*FileExecutable*/ aFileExecutable)
            {
                if (!aFileExecutable.hasLoadedFileDependencies())
                    throw "No executable loaded for file at URL " + aURL;

                aFileExecutable.execute(shouldForce);
            });
        }

        cachedFileExecuters[referenceURLString] = cachedFileExecuter;
    }

    return cachedFileExecuter;
};

DISPLAY_NAME(Executable.fileExecuterForURL);

var cachedFileImporters = { };

Executable.fileImporterForURL = function(/*CFURL|String*/ aURL)
{
    var referenceURL = makeAbsoluteURL(aURL),
        referenceURLString = referenceURL.absoluteString(),
        cachedFileImporter = cachedFileImporters[referenceURLString];

    if (!cachedFileImporter)
    {
        cachedFileImporter = function(/*CFURL*/ aURL, /*BOOL*/ isQuoted, /*Function*/ aCallback)
        {
            // We make heavy use of URLs throughout this process, so cache them!
            enableCFURLCaching();

            Executable.fileExecutableSearcherForURL(referenceURL)(aURL, isQuoted,
            function(/*FileExecutable*/ aFileExecutable)
            {
                aFileExecutable.loadFileDependencies(function()
                {
                    aFileExecutable.execute();

                    // No more need to cache these.
                    disableCFURLCaching();

                    if (aCallback)
                        aCallback();
                });
            });
        }

        cachedFileImporters[referenceURLString] = cachedFileImporter;
    }

    return cachedFileImporter;
};

DISPLAY_NAME(Executable.fileImporterForURL);

var cachedFileExecutableSearchers = { },
    cachedFileExecutableSearchResults = { };

Executable.fileExecutableSearcherForURL = function(/*CFURL*/ referenceURL)
{
    var referenceURLString = referenceURL.absoluteString(),
        cachedFileExecutableSearcher = cachedFileExecutableSearchers[referenceURLString],
        cachedSearchResults = { };

    if (!cachedFileExecutableSearcher)
    {
        cachedFileExecutableSearcher = function(/*CFURL*/ aURL, /*BOOL*/ isQuoted, /*Function*/ success)
        {
            var cacheUID = (isQuoted && referenceURL || "") + aURL,
                cachedResult = cachedFileExecutableSearchResults[cacheUID];

            if (cachedResult)
                return completed(cachedResult);

            var isAbsoluteURL = (aURL instanceof CFURL) && aURL.scheme();

            if (isQuoted || isAbsoluteURL)
            {
                if (!isAbsoluteURL)
                    aURL = new CFURL(aURL, referenceURL);

                StaticResource.resolveResourceAtURL(aURL, NO, completed);
            }
            else
                StaticResource.resolveResourceAtURLSearchingIncludeURLs(aURL, completed);

            function completed(/*StaticResource*/ aStaticResource)
            {
                if (!aStaticResource)
                    throw new Error("Could not load file at " + aURL);

                cachedFileExecutableSearchResults[cacheUID] = aStaticResource;

                success(new FileExecutable(aStaticResource.URL()));
            }
        };

        cachedFileExecutableSearchers[referenceURLString] = cachedFileExecutableSearcher;
    }

    return cachedFileExecutableSearcher;
};

DISPLAY_NAME(Executable.fileExecutableSearcherForURL);
