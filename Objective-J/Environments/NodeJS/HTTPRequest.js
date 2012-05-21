/***
 * HTTPRequest.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
global._HTTPRequestResolver = function()
{
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
    };

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
        this.setState(this.OPENED);
    };

    NativeRequest.prototype.getResponseHeader = function(/*String*/ headerName)
    {
        if (typeof(headerName) === "string" && this.readyState > this.OPENED && this._response && !this._error)
            return this._response.headers[headerName.toLowerCase()];

        return null;
    };

    NativeRequest.prototype.setRequestHeader = function(/*String*/ headerName, /*String*/ headerValue)
    {
        if (this._sent)
            throw "Cannot set header on sent request";

        this._headers[headerName.toLowerCase()] = headerValue;
    };

    NativeRequest.prototype.send = function(/*String*/ body)
    {
        var ssl = false,
            file = false,
            host,
            path;

        if (this._sent)
            throw "Request already sent";

        switch (this._URL.protocol)
        {
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
                break;
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
                self._fd = FS.readFile(path, 'UTF-8', function(err, data)
                {
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
            var options =
            {
                host: host,
                port: self._URL.port,
                path: self._URL.path,
                method: self._method,
                headers: self._headers
            };

            if (self._user && self._password)
                options['auth'] = self._user + ':' + self._password;

            self._request = (ssl ? HTTPS : HTTP).request(options, function(resp)
            {
                self._response = resp;
                self._response.setEncoding("utf8");

                self.setState(self.HEADERS_RECEIVED);
                self.status = response.statusCode;

                self._response.on('data', function(chunk)
                {
                    if (chunk)
                        self.responseText += chunk;

                    if (self._sent)
                        self.setState(self.LOADING);

                });

                self._response.on('end', function()
                {
                    if (self._sent)
                    {
                        setState(self.DONE);
                        self._sent = false;
                    }
                });

                self._response.on('error', function(error)
                {
                    self.handleError(error);
                });
            }).on('error', function(error)
            {
                self.handleError(error);
            });

            if (body)
                self._request.write(body);

            self._request.end();
        }
    };

    NativeRequest.prototype.handleError = function(error)
    {
        this.status = 503;
        this.statusText = error;
        this.responseText = error.stack;
        this.setState(this.DONE);
        this._error = true;
    };

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
            && this.readyState !== this.DONE)
        {
          this._sent = false;
          this.setState(this.DONE);
        }

        this.readyState = this.UNSENT;
    };

    NativeRequest.prototype.setState = function(state)
    {
        this.readyState = state;

        if (typeof(this.onreadystatechange) === "function")
            this.onreadystatechange();
    };
    return NativeRequest;
};
