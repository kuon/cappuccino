
#ifdef CONFIG_XML_PARSER_FUNCTION
function CFXMLParseString(/*String*/ aString)
{
    CONFIG_XML_PARSER_FUNCTION(aString);
}
#elif defined(CONFIG_PLATFORM_NODEJS)
function CFXMLParseString(/*String*/ aString)
{
// FIXME: write a nodejs parser solution
    return NULL;
}
#elif defined(CONFIG_PLATFORM_BROWSER)
function CFXMLParseString(/*String*/ aString)
{
    if (window.DOMParser)
        return DOCUMENT_ELEMENT(new window.DOMParser().parseFromString(aString, "text/xml"));

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
}
#endif
