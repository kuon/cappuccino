/***
 * CPCountedSet.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPObject.j"
@import "CPSet.j"

/*!
    @class CPCountedSet
    @ingroup foundation
    @brief An mutable collection which may contain a specific object
    numerous times.
*/
@implementation CPCountedSet : _CPConcreteMutableSet
{
    Object  _counts;
}

- (void)addObject:(id)anObject
{
    if (!_counts)
        _counts = {};

    [super addObject:anObject];

    var UID = [anObject UID];

    if (_counts[UID] === undefined)
        _counts[UID] = 1;
    else
        ++_counts[UID];
}

- (void)removeObject:(id)anObject
{
    if (!_counts)
        return;

    var UID = [anObject UID];

    if (_counts[UID] === undefined)
        return;

    else
    {
        --_counts[UID];

        if (_counts[UID] === 0)
        {
            delete _counts[UID];
            [super removeObject:anObject];
        }
    }
}

- (void)removeAllObjects
{
    [super removeAllObjects];
    _counts = {};
}

/*
    Returns the number of times anObject appears in the receiver.
    @param anObject The object to check the count for.
*/
- (unsigned)countForObject:(id)anObject
{
    if (!_counts)
        _counts = {};

    var UID = [anObject UID];

    if (_counts[UID] === undefined)
        return 0;

    return _counts[UID];
}


/*

Eventually we should see what these are supposed to do, and then do that.

- (void)intersectSet:(CPSet)set

- (void)minusSet:(CPSet)set

- (void)unionSet:(CPSet)set

*/

@end
