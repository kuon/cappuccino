/***
 * CFHTTPRequest.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

var NativeRequest = CONFIG_HTTP_REQUEST_RESOLVER();

GLOBAL(CFHTTPRequest) = function()
{
    this._isOpen = false;
    this._requestHeaders = {};

    this._eventDispatcher = new EventDispatcher(this);
    this._nativeRequest = new NativeRequest();

    var self = this;
    this._stateChangeHandler = function()
    {
        determineAndDispatchHTTPRequestEvents(self);
    };

    this._nativeRequest.onreadystatechange = this._stateChangeHandler;

    if (CFHTTPRequest.AuthenticationDelegate !== nil)
        this._eventDispatcher.addEventListener("HTTP403", function()
            {
                CFHTTPRequest.AuthenticationDelegate(self);
            });
};

CFHTTPRequest.UninitializedState    = 0;
CFHTTPRequest.LoadingState          = 1;
CFHTTPRequest.LoadedState           = 2;
CFHTTPRequest.InteractiveState      = 3;
CFHTTPRequest.CompleteState         = 4;

//override to forward all CFHTTPRequest authorization failures to a single function
CFHTTPRequest.AuthenticationDelegate = nil;

CFHTTPRequest.prototype.status = function()
{
    try
    {
        return this._nativeRequest.status || 0;
    }
    catch (anException)
    {
        return 0;
    }
};

CFHTTPRequest.prototype.statusText = function()
{
    try
    {
        return this._nativeRequest.statusText || "";
    }
    catch (anException)
    {
        return "";
    }
};

CFHTTPRequest.prototype.readyState = function()
{
    return this._nativeRequest.readyState;
};

CFHTTPRequest.prototype.success = function()
{
    var status = this.status();

    if (status >= 200 && status < 300)
        return YES;

    // file:// requests return with status 0, to know if they succeeded, we
    // need to know if there was any content.
    return status === 0 && this.responseText() && this.responseText().length;
};

CFHTTPRequest.prototype.responsePropertyList = function()
{
    return CFPropertyList.propertyListFromString(this.responseText());
};

CFHTTPRequest.prototype.responseText = function()
{
    return this._nativeRequest.responseText;
};

CFHTTPRequest.prototype.setRequestHeader = function(/*String*/ aHeader, /*Object*/ aValue)
{
    this._requestHeaders[aHeader] = aValue;
};

CFHTTPRequest.prototype.getResponseHeader = function(/*String*/ aHeader)
{
    return this._nativeRequest.getResponseHeader(aHeader);
};

CFHTTPRequest.prototype.open = function(/*String*/ aMethod, /*String*/ aURL, /*Boolean*/ isAsynchronous, /*String*/ aUser, /*String*/ aPassword)
{
    this._isOpen = true;
    this._URL = aURL;
    this._async = isAsynchronous;
    this._method = aMethod;
    this._user = aUser;
    this._password = aPassword;
    return this._nativeRequest.open(aMethod, aURL, isAsynchronous, aUser, aPassword);
};

CFHTTPRequest.prototype.send = function(/*Object*/ aBody)
{
    if (!this._isOpen)
    {
        delete this._nativeRequest.onreadystatechange;
        this._nativeRequest.open(this._method, this._URL, this._async, this._user, this._password);
        this._nativeRequest.onreadystatechange = this._stateChangeHandler;
    }

    for (var i in this._requestHeaders)
    {
        if (this._requestHeaders.hasOwnProperty(i))
            this._nativeRequest.setRequestHeader(i, this._requestHeaders[i]);
    }


    this._isOpen = false;

    try
    {
        return this._nativeRequest.send(aBody);
    }
    catch (anException)
    {
        // FIXME: Do something more complex, with 404's?
        this._eventDispatcher.dispatchEvent({ type:"failure", request:this });
    }
};

CFHTTPRequest.prototype.abort = function()
{
    this._isOpen = false;
    return this._nativeRequest.abort();
};

CFHTTPRequest.prototype.addEventListener = function(/*String*/ anEventName, /*Function*/ anEventListener)
{
    this._eventDispatcher.addEventListener(anEventName, anEventListener);
};

CFHTTPRequest.prototype.removeEventListener = function(/*String*/ anEventName, /*Function*/ anEventListener)
{
    this._eventDispatcher.removeEventListener(anEventName, anEventListener);
};

function determineAndDispatchHTTPRequestEvents(/*CFHTTPRequest*/ aRequest)
{
    var eventDispatcher = aRequest._eventDispatcher;

    eventDispatcher.dispatchEvent({ type:"readystatechange", request:aRequest});

    var readyStates = ["uninitialized", "loading", "loaded", "interactive", "complete"];

    if (readyStates[aRequest.readyState()] === "complete")
    {
        var status = "HTTP" + aRequest.status();
        eventDispatcher.dispatchEvent({ type:status, request:aRequest });

        var result = aRequest.success() ? "success" : "failure";
        eventDispatcher.dispatchEvent({ type:result, request:aRequest });

        eventDispatcher.dispatchEvent({ type:readyStates[aRequest.readyState()], request:aRequest});
    }
    else
        eventDispatcher.dispatchEvent({ type:readyStates[aRequest.readyState()], request:aRequest});
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
