
@import "CPObject.j"
@import "CPURL.j"

/*
    CPURL       _URL;
    CPString    _MIMEType;
    unsigned    _expectedContentLength;
    CPString    _textEncodingName;
*/
/*!
    @class CPURLResponse
    @ingroup foundation
    @brief Protocol agnostic information about a request to a specific URL.

    Contains protocol agnostic information about a request to a specific URL.
*/
@implementation CPURLResponse : CPObject
{
    CPURL   _URL;
}

- (id)initWithURL:(CPURL)aURL
{
    self = [super init];

    if (self)
        _URL = aURL;

    return self;
}

- (CPURL)URL
{
    return _URL;
}
/*
Creating a Response
initWithURL:MIMEType:expectedContentLength:textEncodingName:
Getting the Response Properties
expectedContentLength
suggestedFilename
MIMEType
textEncodingName
URL
*/
@end

/*!
    Represents the response to an http request.
*/
@implementation CPHTTPURLResponse : CPURLResponse
{
    int _statusCode;
}

/* @ignore */
- (id)_setStatusCode:(int)aStatusCode
{
    _statusCode = aStatusCode;
}

/*!
    Returns the HTTP status code.
*/
- (int)statusCode
{
    return _statusCode;
}

@end
