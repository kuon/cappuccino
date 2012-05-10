#ifdef CONFIG_XML_USE_DOM
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
#elif defined(CONFIG_XML_USE_PARSE_XML)
function CFXMLParseString(/*String*/ aString)
{
    return parseXML(aString);
}
#else
// Pure JS xml parser fallback
function CFXMLParseString(/*String*/ aString)
{
}
#endif
