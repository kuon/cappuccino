
@import "CPObject.j"
@import "CPString.j"

/*!
    @class CPData
    @ingroup foundation
    @brief A Cappuccino wrapper for any data type.
*/

@implementation CPData : CPObject
{
}

+ (id)alloc
{
    var result = new CFMutableData();
    result.isa = [self class];
    return result;
}

+ (CPData)data
{
    return [[self alloc] init];
}

+ (CPData)dataWithRawString:(CPString)aString
{
    return [[self alloc] initWithRawString:aString];
}

+ (CPData)dataWithPlistObject:(id)aPlistObject
{
    return [[self alloc] initWithPlistObject:aPlistObject];
}

+ (CPData)dataWithPlistObject:(id)aPlistObject format:(CPPropertyListFormat)aFormat
{
    return [[self alloc] initWithPlistObject:aPlistObject format:aFormat];
}

+ (CPData)dataWithJSONObject:(Object)anObject
{
    return [[self alloc] initWithJSONObject:anObject];
}

+ (CPData)dataWithBytes:(CPArray)bytesArray
{
    var data = [[self alloc] init];
    data.setBytes(bytesArray);

    return data;
}

+ (CPData)dataWithBase64:(CPString)aString
{
    var data = [[self alloc] init];
    data.setBase64String(aString);

    return data;
}

- (id)initWithRawString:(CPString)aString
{
    self = [super init];

    if (self)
        [self setRawString:aString];

    return self;
}

- (id)initWithPlistObject:(id)aPlistObject
{
    self = [super init];

    if (self)
        [self setPlistObject:aPlistObject];

    return self;
}

- (id)initWithPlistObject:(id)aPlistObject format:aFormat
{
    self = [super init];

    if (self)
        [self setPlistObject:aPlistObject format:aFormat];

    return self;
}

- (id)initWithJSONObject:(Object)anObject
{
    self = [super init];

    if (self)
        [self setJSONObject:anObject];

    return self;
}

- (CPString)rawString
{
    return self.rawString();
}

- (id)plistObject
{
    return self.propertyList();
}

- (Object)JSONObject
{
    return self.JSONObject();
}

- (CPArray)bytes
{
    return self.bytes();
}

- (CPString)base64
{
    return self.base64();
}

- (int)length
{
    return [[self rawString] length];
}

- (CPString)description
{
    return self.toString();
}

@end

@implementation CPData (CPMutableData)

- (void)setRawString:(CPString)aString
{
    self.setRawString(aString);
}

- (void)setPlistObject:(id)aPlistObject
{
    self.setPropertyList(aPlistObject);
}

- (void)setPlistObject:(id)aPlistObject format:(CPPropertyListFormat)aFormat
{
    self.setPropertyList(aPlistObject, aFormat);
}

- (void)setJSONObject:(Object)anObject
{
    self.setJSONObject(anObject);
}

@end

@implementation CPData (Deprecated)

+ (id)dataWithString:(CPString)aString
{
    _CPReportLenientDeprecation(self, _cmd, @selector(dataWithRawString:));

    return [self dataWithRawString:aString];
}

- (id)initWithString:(CPString)aString
{
    _CPReportLenientDeprecation(self, _cmd, @selector(initWithRawString:));

    return [self initWithRawString:aString];
}

- (void)setString:(CPString)aString
{
    _CPReportLenientDeprecation(self, _cmd, @selector(setRawString:));

    [self setRawString:aString];
}

- (CPString)string
{
    _CPReportLenientDeprecation(self, _cmd, @selector(rawString));

    return [self rawString];
}

@end

CFData.prototype.isa = CPData;
CFMutableData.prototype.isa = CPData;
