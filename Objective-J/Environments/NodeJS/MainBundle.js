global._mainBundleResolver = function()
{
    var root = process.argv.length > 1 ? require('path').dirname(process.argv[1]) : process.cwd();
    return new CFURL("file:" + root + '/');
}

