/***
 * XML.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
global._parseXMLResolver = function()
{
    return function(aString)
    {
        var DOMParser = require('xmldom').DOMParser;
        var doc = new DOMParser().parseFromString(aString,'text/xml');
        return doc.documentElement;
    };
};
