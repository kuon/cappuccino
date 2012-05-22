/***
 * CPPropertyListSerialization.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPException.j"
@import "CPObject.j"


CPPropertyListUnknownFormat         = 0;
CPPropertyListOpenStepFormat        = kCFPropertyListOpenStepFormat;
CPPropertyListXMLFormat_v1_0        = kCFPropertyListXMLFormat_v1_0;
CPPropertyListBinaryFormat_v1_0     = kCFPropertyListBinaryFormat_v1_0;
CPPropertyList280NorthFormat_v1_0   = kCFPropertyList280NorthFormat_v1_0;

@implementation CPPropertyListSerialization : CPObject
{
}

+ (CPData)dataFromPropertyList:(id)aPlist format:(CPPropertyListFormat)aFormat
{
    return CPPropertyListCreateData(aPlist, aFormat);
}

+ (id)propertyListFromData:(CPData)data format:(CPPropertyListFormat)aFormat
{
    return CPPropertyListCreateFromData(data, aFormat);
}

@end

@implementation CPPropertyListSerialization (Deprecated)

+ (CPData)dataFromPropertyList:(id)aPlist format:(CPPropertyListFormat)aFormat errorDescription:(id)anErrorString
{
    _CPReportLenientDeprecation(self, _cmd, @selector(dataFromPropertyList:format:));

    return [self dataFromPropertyList:aPlist format:aFormat];
}

+ (id)propertyListFromData:(CPData)data format:(CPPropertyListFormat)aFormat errorDescription:(id)errorString
{
    _CPReportLenientDeprecation(self, _cmd, @selector(propertyListFromData:format:));

    return [self propertyListFromData:data format:aFormat];
}

@end
