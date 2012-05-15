window._mainBundleResolver = function() {
// This is automatic when importing, but we'd like these important URLs to
// be taken into consideration in the cache as well.
enableCFURLCaching();

// To determine where our application lives, start with the current URL of the page.
var pageURL = new CFURL(window.location.href),

// Look for any <base> tags and choose the last one (which is the one that will take effect).
    DOMBaseElements = document.getElementsByTagName("base"),
    DOMBaseElementsCount = DOMBaseElements.length;

if (DOMBaseElementsCount > 0)
{
    var DOMBaseElement = DOMBaseElements[DOMBaseElementsCount - 1],
        DOMBaseElementHref = DOMBaseElement && DOMBaseElement.getAttribute("href");

    // If we have one, use it instead.
    if (DOMBaseElementHref)
        pageURL = new CFURL(DOMBaseElementHref, pageURL);
}

// Turn the main file into a URL.
var mainFileURL = new CFURL(window.OBJJ_MAIN_FILE || "main.j"),

// The main bundle is the containing folder of the main file.
    mainBundleURL = new CFURL(".", new CFURL(mainFileURL, pageURL)).absoluteURL(),

// We assume the "first part" of the path is completely resolved.
    assumedResolvedURL = new CFURL("..", mainBundleURL).absoluteURL();

// .. doesn't work if we're already at root, so "go back" one more level to the scheme and authority.
if (mainBundleURL === assumedResolvedURL)
    assumedResolvedURL = new CFURL(assumedResolvedURL.schemeAndAuthority());

StaticResource.resourceAtURL(assumedResolvedURL, YES);


function resolveMainBundleURL()
{
    StaticResource.resolveResourceAtURL(mainBundleURL, YES, function(/*StaticResource*/ aResource)
    {
        var includeURLs = StaticResource.includeURLs(),
            index = 0,
            count = includeURLs.length;

        for (; index < count; ++index)
            aResource.resourceAtURL(includeURLs[index], YES);

        Executable.fileImporterForURL(mainBundleURL)(mainFileURL.lastPathComponent(), YES, function()
        {
            disableCFURLCaching();
            afterDocumentLoad(function()
            {
                var hashString = window.location.hash.substring(1),
                    args = [];

                if (hashString.length)
                {
                    args = hashString.split("/");
                    for (var i = 0, count = args.length; i < count; i++)
                        args[i] = decodeURIComponent(args[i]);
                }

                var namedArgsArray = window.location.search.substring(1).split("&"),
                    namedArgs = new CFMutableDictionary();

                for (var i = 0, count = namedArgsArray.length; i < count; i++)
                {
                    var thisArg = namedArgsArray[i].split("=");

                    if (!thisArg[0])
                        continue;

                    if (thisArg[1] == null)
                        thisArg[1] = true;

                    namedArgs.setValueForKey(decodeURIComponent(thisArg[0]), decodeURIComponent(thisArg[1]));
                }

                main(args, namedArgs);
            });
        });
    });
}

var documentLoaded = NO;

function afterDocumentLoad(/*Function*/ aFunction)
{
    if (documentLoaded)
        return aFunction();

    if (window.addEventListener)
        window.addEventListener("load", aFunction, NO);

    else if (window.attachEvent)
        window.attachEvent("onload", aFunction);
}

afterDocumentLoad(function()
{
    documentLoaded = YES;
});

if (typeof OBJJ_AUTO_BOOTSTRAP === "undefined" || OBJJ_AUTO_BOOTSTRAP)
    resolveMainBundleURL();
}
