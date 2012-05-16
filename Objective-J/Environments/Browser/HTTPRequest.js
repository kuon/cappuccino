window._HTTPRequestResolver = function()
{
    var NativeRequest = null;

    // We check ActiveXObject first, because we require local file access and
    // overrideMimeType feature (which the native XMLHttpRequest does not have in IE).
    if (window.ActiveXObject !== undefined)
    {
        // DON'T try 4.0 and 5.0: http://bit.ly/microsoft-msxml-explanation
        var MSXML_XMLHTTP_OBJECTS = ["Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.6.0"],
            index = MSXML_XMLHTTP_OBJECTS.length;

        while (index--)
        {
            try
            {
                var MSXML_XMLHTTP = MSXML_XMLHTTP_OBJECTS[index];

                new ActiveXObject(MSXML_XMLHTTP);

                NativeRequest = function()
                {
                    return new ActiveXObject(MSXML_XMLHTTP);
                };

                break;
            }
            catch (anException)
            {
            }
        }
    }

    if (!NativeRequest)
        NativeRequest = window.XMLHttpRequest;
    return NativeRequest;
};
