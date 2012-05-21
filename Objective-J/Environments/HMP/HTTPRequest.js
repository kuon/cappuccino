/***
 * HTTPRequest.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
window._HTTPRequestResolver = function()
{

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
        this._responseHeaders = {};
    };

    NativeRequest.prototype.open = function(/*String*/ aMethod, /*String*/ aURL, /*Boolean*/ isAsynchronous, /*String*/ aUser, /*String*/ aPassword)
    {

        if (!isAsynchronous)
            throw "Only asynchronous requests are supported";

        this.abort();
        this._URL = aURL.replace(/^file:/, '');
        this._method = aMethod;
        this._error = false;
        this._contentType = 'text/plain';
        this._contentEncoding = 'UTF-8';
        this.setState(this.OPENED);
    };

    NativeRequest.prototype.getResponseHeader = function(/*String*/ headerName)
    {
        return this._responseHeaders[headerName.toLowerCase()];
    };

    NativeRequest.prototype.setRequestHeader = function(/*String*/ headerName, /*String*/ headerValue)
    {
        headerName = headerName.toLowerCase();

        if (headerName == 'content-type')
            this._contentType = headerValue;
        else if (headerName == 'content-encoding')
            this._contentEncoding = headerValue;
    };

    NativeRequest.prototype.send = function(/*String*/ body)
    {
        var self = this;

        var callback = function(status)
        {
            if (self._error)
            {
                self.status = 503;
            }
            else if (status.success)
            {
                self.responseText = status.content;
                self._responseHeaders = {"content-type":status.contentType};
                self.status = 200;
            }
            else
            {
                self.status = 503;
            }
            self.setState(self.DONE);
        };
        if (this._method == 'GET')
        {
            this.setState(this.LOADING);
            window.getURL(this._URL, callback);
        }
        else if (this._method == 'POST')
        {
            this.setState(this.LOADING);
            window.postURL(this._URL, body, callback, this._contentType, this._contentEncoding);
        }
        else
            throw 'Unsupported HTTP method, only GET and POST is supported';
    };

    NativeRequest.prototype.abort = function()
    {
        this._error = true;
    };

    NativeRequest.prototype.setState = function(state)
    {
        this.readyState = state;
        if (typeof(this.onreadystatechange) === "function")
            this.onreadystatechange();
    };

    return NativeRequest;
}
