global._parseXMLResolver = function()
{
    return function(aString)
    {
        var DOMParser = require('xmldom').DOMParser;
        var doc = new DOMParser().parseFromString(aString,'text/xml');
        return doc.documentElement;
    };
};
