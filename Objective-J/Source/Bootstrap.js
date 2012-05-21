
GLOBAL(OBJJ_MAIN_BUNDLE_URL) = CONFIG_MAIN_BUNDLE_RESOLVER();

GLOBAL(objj_importFile) = Executable.fileImporterForURL(OBJJ_MAIN_BUNDLE_URL);
GLOBAL(objj_executeFile) = Executable.fileExecuterForURL(OBJJ_MAIN_BUNDLE_URL);


GLOBAL(objj_import) = function()
{
    CPLog.warn("objj_import is deprecated, use objj_importFile instead");
    objj_importFile.apply(this, arguments);
};
