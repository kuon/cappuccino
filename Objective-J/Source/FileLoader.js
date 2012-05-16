

var asynchronousTimeoutCount = 0,
    asynchronousTimeoutId = null,
    asynchronousFunctionQueue = [];

function Asynchronous(/*Function*/ aFunction)
{
    var currentAsynchronousTimeoutCount = asynchronousTimeoutCount;

    if (asynchronousTimeoutId === null)
    {
        objj_setTimeout(function()
        {
            var queue = asynchronousFunctionQueue,
                index = 0,
                count = asynchronousFunctionQueue.length;

            ++asynchronousTimeoutCount;
            asynchronousTimeoutId = null;
            asynchronousFunctionQueue = [];

            for (; index < count; ++index)
                queue[index]();
        }, 0);
    }

    return function()
    {
        var args = arguments;

        if (asynchronousTimeoutCount > currentAsynchronousTimeoutCount)
            aFunction.apply(this, args);
        else
            asynchronousFunctionQueue.push(function()
            {
                aFunction.apply(this, args);
            });
    };
}

function FileRequest(/*CFURL*/ aURL, onsuccess, onfailure)
{
    var request = new CFHTTPRequest();

    if (OBJJ_ASYNCLOADER)
    {
        request.onsuccess = Asynchronous(onsuccess);
        request.onfailure = Asynchronous(onfailure);
    }
    else
    {
        request.onsuccess = onsuccess;
        request.onfailure = onfailure;
    }

    request.open("GET", aURL.absoluteString(), OBJJ_ASYNCLOADER);
    request.send("");
}

GLOBAL(OBJJ_ASYNCLOADER) = YES;
