/***
 * _CPAggregateExpression.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPArray.j"
@import "CPExpression.j"
@import "CPString.j"

@implementation _CPAggregateExpression : CPExpression
{
    CPArray _aggregate;
}

- (id)initWithAggregate:(CPArray)collection
{
    self = [super initWithExpressionType:CPAggregateExpressionType];

    if (self)
        _aggregate = collection;
    return self;
}

- (BOOL)isEqual:(id)object
{
    if (self === object)
        return YES;

    if (object.isa !== self.isa || ![[object collection] isEqual:_aggregate])
        return NO;

    return YES;
}

- (id)collection
{
    return _aggregate;
}

- (id)expressionValueWithObject:(id)object context:(CPDictionary)context
{
    var eval_array = [CPArray array],
        collection  = [_aggregate objectEnumerator],
        exp;

    while ((exp = [collection nextObject]) !== nil)
    {
        var eval = [exp expressionValueWithObject:object context:context];
        [eval_array addObject:eval];
    }

    return eval_array;
}

- (CPString)description
{
    var i = 0,
        count = [_aggregate count],
        result = "{";

    for (; i < count; i++)
        result = result + [CPString stringWithFormat:@"%s%s", [[_aggregate objectAtIndex:i] description], (i + 1 < count) ? @", " : @""];

    result = result + "}";

    return result;
}

- (CPExpression)_expressionWithSubstitutionVariables:(CPDictionary)variables
{
    var subst_array = [CPArray array],
        count = [_aggregate count],
        i = 0;

    for (; i < count; i++)
        [subst_array addObject:[[_aggregate objectAtIndex:i] _expressionWithSubstitutionVariables:variables]];

    return [CPExpression expressionForAggregate:subst_array];
}

@end

var CPCollectionKey = @"CPCollection";

@implementation _CPAggregateExpression (CPCoding)

- (id)initWithCoder:(CPCoder)coder
{
    var collection = [coder decodeObjectForKey:CPCollectionKey];
    return [self initWithAggregate:collection];
}

- (void)encodeWithCoder:(CPCoder)coder
{
    [coder encodeObject:_aggregate forKey:CPCollectionKey];
}

@end
