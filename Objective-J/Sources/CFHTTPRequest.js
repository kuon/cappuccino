/*
 * CFHTTPRequest.js
 * Objective-J
 *
 * Created by Francisco Tolmasky.
 * Copyright 2010, 280 North, Inc.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

#ifdef CONFIG_HTTP_USE_XMLHTTPREQUEST
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

#elif defined(CONFIG_HTTP_USE_NODEJS)
var HTTP = require('http'),
    HTTPS = require('https'),
    URL = require("url"),
    FILE = require("fs");

NativeRequest = function()
{
    this.status = 0;
    this.statusText = '';
    this.readyState = 0;
    this.responseText = '';

    this.UNSENT = 0;
    this.OPENED = 1;
    this.HEADERS_RECEIVED = 2;
    this.LOADING = 3;
    this.DONE = 4;
    this._sent = false;
    this._error = false;
}

NativeRequest.prototype.open = function(/*String*/ aMethod, /*String*/ aURL, /*Boolean*/ isAsynchronous, /*String*/ aUser, /*String*/ aPassword)
{
    this.abort();
    this._user = aUser;
    this._password = aPassword;
    this._URL = URL.parse(aURL);
    this._isAsynchronous = typeof(isAsynchronous) === 'boolean' ? isAsynchronous : true;
    this._method = aMethod;
    this._headers = [];
    this._error = false;
}

NativeRequest.prototype.getResponseHeader = function(/*String*/ headerName)
{
    if (typeof(headerName) === "string" && this.readyState > this.OPENED && this._response && !this._error)
        return this._response.headers[headerName.toLowerCase()];

    return null;
}

NativeRequest.prototype.setRequestHeader = function(/*String*/ headerName, /*String*/ headerValue)
{
    if (this._sent) throw "Cannot set header on sent request";
    this._headers[headerName.toLowerCase()] = headerValue;
}

NativeRequest.prototype.send = function(/*String*/ body)
{
    var ssl = false,
        file = false,
        host, path;

    if (this._sent) throw "Request already sent";
    switch (this._URL.protocol) {
    case 'https:':
        ssl = true;
    case 'http:':
        host = this._URL.hostname;
        if (!this._isAsynchronous)
            throw "Synchronous HTTP requests are not supported in NodeJS";
        break;
    case 'file:':
        path = this._URL.pathname;
        file = true;
        break
    default:
        throw "Protocol not supported.";
    }

    var self = this;

    if (typeof(self.onreadystatechange) === "function")
        self.onreadystatechange();

    self._sent = true;
    self._error = false;

    self.responseText = '';

    if (file)
    {
        if (self._method != 'GET')
            throw 'Only GET requests are supported for files';

        var FS = require('fs');
        if (self._isAsynchronous)
        {
            self._fd = FS.readFile(path, 'UTF-8', function(err, data) {
                if (self._sent)
                    self.setState(self.LOADING);
                self.responseText = data;
                self.setState(self.DONE);
                self.status = 0;
            });
        }
        else
        {
            self.responseText = FS.readFileSync(path, 'UTF-8');
            self.setState(self.DONE);
        }
    }
    else
    {
        var options = {
            host: host,
            port: self._URL.port,
            path: self._URL.path,
            method: self._method,
            headers: self._headers
        };
        if (self._user && self._password)
            options['auth'] = self._user + ':' + self._password;

        self._request = (ssl ? HTTPS : HTTP).request(options, function(resp) {
            self._response = resp;
            self._response.setEncoding("utf8");

            self.setState(self.HEADERS_RECEIVED);
            self.status = response.statusCode;

            self._response.on('data', function(chunk) {
                if (chunk)
                    self.responseText += chunk;
                if (self._sent)
                    self.setState(self.LOADING);
            });

            self._response.on('end', function() {
                if (self._sent)
                {
                    setState(self.DONE);
                    self._sent = false;
                }
            });

            self._response.on('error', function(error) {
                self.handleError(error);
            });
        }).on('error', function(error) {
            self.handleError(error);
        });

        if (body)
            self._request.write(body);

        self._request.end();
    }
}

NativeRequest.prototype.handleError = function(error)
{
    this.status = 503;
    this.statusText = error;
    this.responseText = error.stack;
    this.setState(this.DONE);
    this._error = true;
}

NativeRequest.prototype.abort = function()
{
    if (this._request)
    {
        this._request.abort();
        this._request = null;
    }

    this.responseText = "";

    this._error = true;

    if (this.readyState !== this.UNSENT
        && (this.readyState !== this.OPENED || this._sent)
        && this.readyState !== this.DONE) {
      this._sent = false;
      this.setState(this.DONE);
    }
    this.readyState = this.UNSENT;
}

NativeRequest.prototype.setState = function(state) {
    this.readyState = state;
    if (typeof(this.onreadystatechange) === "function")
        this.onreadystatechange();
}

#elif defined(CONFIG_HTTP_CUSTOM_CLASS)
var NativeRequest = CONFIG_HTTP_CUSTOM_CLASS;
#else
#error Objective-J require an HTTP loading mechanism to load it's dependencies
#endif

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
}

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
    return CFPropertyList.propertyListFromString(this.responseText);
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

