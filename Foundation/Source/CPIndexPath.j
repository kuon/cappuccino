/***
 * CPIndexPath.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPArray.j"
@import "CPException.j"
@import "CPObject.j"
@import "CPRange.j"
@import "CPSortDescriptor.j"

@implementation CPIndexPath : CPObject
{
    CPArray _indexes @accessors(property=indexes);
}

+ (id)indexPathWithIndex:(int)index
{
    return [[self alloc] initWithIndexes:[index] length:1];
}

+ (id)indexPathWithIndexes:(CPArray)indexes length:(int)length
{
    return [[self alloc] initWithIndexes:indexes length:length];
}

+ (id)indexPathWithIndexes:(CPArray)indexes
{
    return [[self alloc] initWithIndexes:indexes];
}

- (id)initWithIndexes:(CPArray)indexes length:(int)length
{
    self = [super init];

    if (self)
        _indexes = [indexes subarrayWithRange:CPMakeRange(0, length)];

    return self;
}

- (id)initWithIndexes:(CPArray)indexes
{
    self = [super init];

    if (self)
        _indexes = [indexes copy];

    return self;
}

- (CPString)description
{
    return [super description] + " " + _indexes;
}

#pragma mark -
#pragma mark Accessing

- (id)length
{
    return [_indexes count];
}

- (int)indexAtPosition:(int)position
{
    return [_indexes objectAtIndex:position];
}

- (void)setIndexes:(CPArray)theIndexes
{
    _indexes = [theIndexes copy];
}

- (CPArray)indexes
{
    return [_indexes copy];
}

#pragma mark -
#pragma mark Modification

- (CPIndexPath)indexPathByAddingIndex:(int)index
{
    return [CPIndexPath indexPathWithIndexes:[_indexes arrayByAddingObject:index]];
}

- (CPIndexPath)indexPathByRemovingLastIndex
{
    return [CPIndexPath indexPathWithIndexes:_indexes length:[self length] - 1];
}

#pragma mark -
#pragma mark Comparison

- (BOOL)isEqual:(id)anObject
{
    if (anObject === self)
        return YES;

    if ([anObject class] !== [CPIndexPath class])
        return NO;

    return [_indexes isEqualToArray:[anObject indexes]];
}

- (CPComparisonResult)compare:(CPIndexPath)anIndexPath
{
    if (!anIndexPath)
        [CPException raise:CPInvalidArgumentException reason:"indexPath to " + self + " was nil"];

    var lhsIndexes = [self indexes],
        rhsIndexes = [anIndexPath indexes],
        lhsCount = [lhsIndexes count],
        rhsCount = [rhsIndexes count];

    var index = 0,
        count = MIN(lhsCount, rhsCount);

    for (; index < count; ++index)
    {
        var lhs = lhsIndexes[index],
            rhs = rhsIndexes[index];

        if (lhs < rhs)
            return CPOrderedAscending;

        else if (lhs > rhs)
            return CPOrderedDescending;
    }

    if (lhsCount === rhsCount)
        return CPOrderedSame;

    if (lhsCount === count)
        return CPOrderedAscending;

    return CPOrderedDescending;
}

@end

var CPIndexPathIndexesKey = @"CPIndexPathIndexes";

@implementation CPIndexPath (CPCoding)

- (id)initWithCoder:(CPCoder)theCoder
{
    if (self = [self init])
    {
        _indexes = [theCoder decodeObjectForKey:CPIndexPathIndexesKey];
    }

    return self;
}

- (void)encodeWithCoder:(CPCoder)theCoder
{
    [theCoder encodeObject:_indexes forKey:CPIndexPathIndexesKey];
}

@end
