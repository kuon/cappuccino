
@import "CPCoder.j"
@import "CPObject.j"

/*!
    @class CPValue
    @ingroup foundation
    @brief A generic "value". Can be subclassed to hold specific data types.

    The class can be subclassed to hold different types of scalar values.
*/
@implementation CPValue : CPObject
{
    JSObject    _JSObject;
}

/*!
    Creates a value from the specified JavaScript object
    @param aJSObject a JavaScript object containing a value
    @return the converted CPValue
*/
+ (id)valueWithJSObject:(JSObject)aJSObject
{
    return [[self alloc] initWithJSObject:aJSObject];
}

/*!
    Initializes the value from a JavaScript object
    @param aJSObject the object to get data from
    @return the initialized CPValue
*/
- (id)initWithJSObject:(JSObject)aJSObject
{
    self = [super init];

    if (self)
        _JSObject = aJSObject;

    return self;
}

/*!
    Returns the JavaScript object backing this value.
*/
- (JSObject)JSObject
{
    return _JSObject;
}

@end

var CPValueValueKey = @"CPValueValueKey";

@implementation CPValue (CPCoding)

/*!
    Initializes the value from a coder.
    @param aCoder the coder from which to initialize
    @return the initialized CPValue
*/
- (id)initWithCoder:(CPCoder)aCoder
{
    self = [super init];

    if (self)
        _JSObject = JSON.parse([aCoder decodeObjectForKey:CPValueValueKey]);

    return self;
}

/*!
    Encodes the data into the specified coder.
    @param the coder into which the data will be written.
*/
- (void)encodeWithCoder:(CPCoder)aCoder
{
    [aCoder encodeObject:JSON.stringify(_JSObject) forKey:CPValueValueKey];
}

@end

function CPJSObjectCreateJSON(aJSObject)
{
    CPLog.warn("CPJSObjectCreateJSON deprecated, use JSON.stringify() or CPString's objectFromJSON");
    return JSON.stringify(aJSObject);
}

function CPJSObjectCreateWithJSON(aString)
{
    CPLog.warn("CPJSObjectCreateWithJSON deprecated, use JSON.parse() or CPString's JSONFromObject");
    return JSON.parse(aString);
}
