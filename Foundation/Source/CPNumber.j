/***
 * CPNumber.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPObject.j"
@import "CPObjJRuntime.j"

var CPNumberUIDs    = new CFMutableDictionary();

/*!
    @class CPNumber
    @ingroup foundation
    @brief A bridged object to native Javascript numbers.

    This class primarily exists for source compatibility. The JavaScript
    \c Number type can be changed on the fly based on context,
    so there is no need to call any of these methods.

    In other words, native JavaScript numbers are bridged to CPNumber,
    so you can use them interchangeably (including operators and methods).
*/
@implementation CPNumber : CPObject

+ (id)alloc
{
    var result = new Number();
    result.isa = [self class];
    return result;
}

+ (id)numberWithBool:(BOOL)aBoolean
{
    return aBoolean;
}

+ (id)numberWithChar:(char)aChar
{
    if (aChar.charCodeAt)
        return aChar.charCodeAt(0);

    return aChar;
}

+ (id)numberWithDouble:(double)aDouble
{
    return aDouble;
}

+ (id)numberWithFloat:(float)aFloat
{
    return aFloat;
}

+ (id)numberWithInt:(int)anInt
{
    return anInt;
}

+ (id)numberWithLong:(long)aLong
{
    return aLong;
}

+ (id)numberWithLongLong:(long long)aLongLong
{
    return aLongLong;
}

+ (id)numberWithShort:(short)aShort
{
    return aShort;
}

+ (id)numberWithUnsignedChar:(unsigned char)aChar
{
    if (aChar.charCodeAt)
        return aChar.charCodeAt(0);

    return aChar;
}

+ (id)numberWithUnsignedInt:(unsigned)anUnsignedInt
{
    return anUnsignedInt;
}

+ (id)numberWithUnsignedLong:(unsigned long)anUnsignedLong
{
    return anUnsignedLong;
}
/*
+ (id)numberWithUnsignedLongLong:(unsigned long long)anUnsignedLongLong
{
    return anUnsignedLongLong;
}
*/
+ (id)numberWithUnsignedShort:(unsigned short)anUnsignedShort
{
    return anUnsignedShort;
}

- (id)initWithBool:(BOOL)aBoolean
{
    return aBoolean;
}

- (id)initWithChar:(char)aChar
{
    if (aChar.charCodeAt)
        return aChar.charCodeAt(0);

    return aChar;
}

- (id)initWithDouble:(double)aDouble
{
    return aDouble;
}

- (id)initWithFloat:(float)aFloat
{
    return aFloat;
}

- (id)initWithInt:(int)anInt
{
    return anInt;
}

- (id)initWithLong:(long)aLong
{
    return aLong;
}

- (id)initWithLongLong:(long long)aLongLong
{
    return aLongLong;
}

- (id)initWithShort:(short)aShort
{
    return aShort;
}

- (id)initWithUnsignedChar:(unsigned char)aChar
{
    if (aChar.charCodeAt)
        return aChar.charCodeAt(0);

    return aChar;
}

- (id)initWithUnsignedInt:(unsigned)anUnsignedInt
{
    return anUnsignedInt;
}

- (id)initWithUnsignedLong:(unsigned long)anUnsignedLong
{
    return anUnsignedLong;
}
/*
- (id)initWithUnsignedLongLong:(unsigned long long)anUnsignedLongLong
{
    return anUnsignedLongLong;
}
*/
- (id)initWithUnsignedShort:(unsigned short)anUnsignedShort
{
    return anUnsignedShort;
}

- (CPString)UID
{
    var UID = CPNumberUIDs.valueForKey(self);

    if (!UID)
    {
        UID = objj_generateObjectUID();
        CPNumberUIDs.setValueForKey(self, UID);
    }

    return UID + "";
}

- (BOOL)boolValue
{
    // Ensure we return actual booleans.
    return self ? true : false;
}

- (char)charValue
{
    return String.fromCharCode(self);
}

/*
FIXME: Do we need this?
*/
- (CPDecimal)decimalValue
{
    throw new Error("decimalValue: NOT YET IMPLEMENTED");
}

- (CPString)descriptionWithLocale:(CPDictionary)aDictionary
{
    if (!aDictionary) return toString();

    throw new Error("descriptionWithLocale: NOT YET IMPLEMENTED");
}

- (CPString)description
{
    return [self descriptionWithLocale:nil];
}

- (double)doubleValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (float)floatValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (int)intValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (long long)longLongValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (long)longValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (short)shortValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (CPString)stringValue
{
    return toString();
}

- (unsigned char)unsignedCharValue
{
    return String.fromCharCode(self);
}

- (unsigned int)unsignedIntValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}
/*
- (unsigned long long)unsignedLongLongValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}
*/
- (unsigned long)unsignedLongValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (unsigned short)unsignedShortValue
{
    if (typeof self == "boolean") return self ? 1 : 0;
    return self;
}

- (CPComparisonResult)compare:(CPNumber)aNumber
{
    if (self > aNumber) return CPOrderedDescending;
    else if (self < aNumber) return CPOrderedAscending;

    return CPOrderedSame;
}

- (BOOL)isEqualToNumber:(CPNumber)aNumber
{
    return self == aNumber;
}

@end

@implementation CPNumber (CPCoding)

- (id)initWithCoder:(CPCoder)aCoder
{
    return [aCoder decodeNumber];
}

- (void)encodeWithCoder:(CPCoder)aCoder
{
    [aCoder encodeNumber:self forKey:@"self"];
}

@end

Number.prototype.isa = CPNumber;
Boolean.prototype.isa = CPNumber;
[CPNumber initialize];
