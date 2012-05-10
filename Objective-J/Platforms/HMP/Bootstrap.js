

var mainBundleURL = new CFURL("file:/");

function makeAbsoluteURL(/*CFURL|String*/ aURL)
{
    if (aURL instanceof CFURL && aURL.scheme())
        return aURL;

    return new CFURL(aURL, mainBundleURL);
}

GLOBAL(CFApplicationURL) = mainBundleURL;

GLOBAL(objj_importFile) = Executable.fileImporterForURL(mainBundleURL);
GLOBAL(objj_executeFile) = Executable.fileExecuterForURL(mainBundleURL);

GLOBAL(objj_import) = function()
{
    CPLog.warn("objj_import is deprecated, use objj_importFile instead");
    objj_importFile.apply(this, arguments);
}
