/***
 * XML.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
window._parseXMLResolver = function()
{
    return function(aString)
    {
        if (window.DOMParser)
            return (new window.DOMParser().parseFromString(aString, "text/xml")).documentElement;

        else if (window.ActiveXObject)
        {
            XMLNode = new ActiveXObject("Microsoft.XMLDOM");

            // Extract the DTD, which confuses IE.
            var matches = aString.match(CFPropertyList.DTDRE);

            if (matches)
                aString = aString.substr(matches[0].length);

            XMLNode.loadXML(aString);

            return XMLNode
        }

        return NULL;
    };
};
