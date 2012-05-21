
@import "CPException.j"
@import "CPObject.j"

/*!
    @class CPCoder
    @ingroup foundation
    @brief Defines methods for use when archiving & restoring (enc/decoding).

    Top-level class defining methods for use when archiving (encoding) objects to a byte array
    or file, and when restoring (decoding) objects.
*/
@implementation CPCoder : CPObject
{
}

/*!
    Returns a flag indicating whether the receiver supports keyed coding. The default implementation returns
    \c NO. Subclasses supporting keyed coding must override this to return \c YES.
*/
- (BOOL)allowsKeyedCoding
{
   return NO;
}

/*!
    Encodes a structure or object of a specified type. Usually this
    is used for primitives though it can be used for objects as well.
    Subclasses must override this method.
    @param aType the structure or object type
    @param anObject the object to be encoded
*/
- (void)encodeValueOfObjCType:(CPString)aType at:(id)anObject
{
   _CPRaiseInvalidAbstractInvocation(self, _cmd);
}

/*!
    Encodes a data object. Subclasses must override this method.
    @param aData the object to be encoded.
*/
- (void)encodeDataObject:(CPData)aData
{
   _CPRaiseInvalidAbstractInvocation(self, _cmd);
}

/*!
    Encodes an object. Subclasses must override this method.
    @param anObject the object to be encoded
*/
- (void)encodeObject:(id)anObject
{
//   [self encodeValueOfObjCType:@encode(id) at:object];
}

/*!
    Encodes a point
    @param aPoint the point to be encoded.
*/
- (void)encodePoint:(CPPoint)aPoint
{
    [self encodeNumber:aPoint.x];
    [self encodeNumber:aPoint.y];
}

/*!
    Encodes a CGRect
    @param aRect the rectangle to be encoded.
*/
- (void)encodeRect:(CGRect)aRect
{
    [self encodePoint:aRect.origin];
    [self encodeSize:aRect.size];
}

/*!
    Encodes a CGSize
    @param aSize the size to be encoded
*/
- (void)encodeSize:(CPSize)aSize
{
    [self encodeNumber:aSize.width];
    [self encodeNumber:aSize.height];
}

/*!
    Encodes a property list. Not yet implemented.
    @param aPropertyList the property list to be encoded
*/
- (void)encodePropertyList:(id)aPropertyList
{
//   [self encodeValueOfObjCType:@encode(id) at:&propertyList];
}

/*!
    Encodes the root object of a group of Obj-J objects.
    @param rootObject the root object to be encoded.
*/
- (void)encodeRootObject:(id)anObject
{
   [self encodeObject:anObject];
}

/*!
    Encodes an object.
    @param anObject the object to be encoded.
*/
- (void)encodeBycopyObject:(id)anObject
{
   [self encodeObject:anObject];
}

/*!
    Encodes an object.
    @param anObject the object to be encoded.
*/
- (void)encodeConditionalObject:(id)anObject
{
   [self encodeObject:anObject];
}

@end

@implementation CPObject (CPCoding)

/*!
    Called after an object is unarchived in case a different object should be used in place of it.
    The default method returns \c self. Interested subclasses should override this.
    @param aDecoder
    @return the original object or it's substitute.
*/
- (id)awakeAfterUsingCoder:(CPCoder)aDecoder
{
    return self;
}

@end
