GLOBAL(objj_eval) = function(/*String*/ aString)
{
#ifdef CONFIG_PLATFORM_NODEJS
    var url = process.cwd() + '/';
    Executable.setCommonJSParameters("require", "exports", "module", "system", "print", "global");
    Executable.setCommonJSArguments(require, exports, module, system, print, global);
#else
    var url = exports.pageURL;
#endif

    // Temporarily switch the loader to sychronous mode since objj_eval must be synchronous
    // therefore you shouldn't use @imports in objj_eval the browser
    var asyncLoaderSaved = exports.asyncLoader;
    exports.asyncLoader = NO;

    var executable = exports.preprocess(aString, url, 0);

    if (!executable.hasLoadedFileDependencies())
        executable.loadFileDependencies();

    // here we setup a scope object containing the free variables that would normally be arguments to the module function
    global._objj_eval_scope = {};

    global._objj_eval_scope.objj_executeFile = Executable.fileExecuterForURL(url);
    global._objj_eval_scope.objj_importFile = Executable.fileImporterForURL(url);
#ifdef CONFIG_PLATFORM_NODEJS
    global._objj_eval_scope.require = require;
    global._objj_eval_scope.global = global;
#endif

    // A bit of a hack. Executable compiles the code itself into a function, but we want
    // the raw code to eval here so we can get the result.
    // No known way to get the result of a statement except via eval.
    var code = "with(_objj_eval_scope){" + executable._code + "\n//*/\n}";

    var result;
    result = eval(code);

    // restore async loader setting
    exports.asyncLoader = asyncLoaderSaved;

    return result;
}

// deprecated, use global
exports.objj_eval = objj_eval;
