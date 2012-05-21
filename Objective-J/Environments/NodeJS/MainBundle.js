/***
 * MainBundle.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
global._mainBundleResolver = function()
{
    var root = process.argv.length > 1 ? require('path').dirname(process.argv[1]) : process.cwd();
    return new CFURL("file:" + root + '/');
};

