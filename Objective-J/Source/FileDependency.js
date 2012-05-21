
function FileDependency(/*CFURL*/ aURL, /*BOOL*/ isLocal)
{
    this._URL = aURL;
    this._isLocal = isLocal;
}

GLOBAL(objj_fileDependency) = FileDependency;

FileDependency.prototype.URL = function()
{
    return this._URL;
};

FileDependency.prototype.isLocal = function()
{
    return this._isLocal;
};

FileDependency.prototype.toMarkedString = function()
{
    var URLString = this.URL().absoluteString();

    return  (this.isLocal() ? MARKER_IMPORT_LOCAL : MARKER_IMPORT_STD) + ";" +
            URLString.length + ";" + URLString;
};

FileDependency.prototype.toString = function()
{
    return (this.isLocal() ? "LOCAL: " : "STD: ") + this.URL();
};
