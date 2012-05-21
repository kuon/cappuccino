
@import "CPObject.j"

/*!
    @class CPEnumerator
    @ingroup foundation
    @brief Defines an interface for enumerators.

    CPEnumerator is a superclass (with useless method bodies)
    that defines an interface for subclasses to follow. The purpose of an
    enumerator is to be a convenient system for traversing over the elements
    of a collection of objects.
*/
@implementation CPEnumerator : CPObject

/*!
    Returns the next object in the collection.
    No particular ordering is guaranteed.
*/
- (id)nextObject
{
    return nil;
}

/*!
    Returns all objects in the collection in an array.
    No particular ordering is guaranteed.
*/
- (CPArray)allObjects
{
    return [];
}

@end
