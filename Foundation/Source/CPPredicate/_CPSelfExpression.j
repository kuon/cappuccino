
@import "CPDictionary.j"
@import "CPExpression.j"
@import "CPString.j"

var evaluatedObject = nil;

@implementation _CPSelfExpression : CPExpression
{
}

+ (id)evaluatedObject
{
    if (evaluatedObject == nil)
        evaluatedObject = [_CPSelfExpression new];

    return evaluatedObject;
}

- (id)init
{
    self = [super initWithExpressionType:CPEvaluatedObjectExpressionType];

    return self;
}

- (id)initWithCoder:(CPCoder)coder
{
    return [_CPSelfExpression evaluatedObject];
}

- (void)encodeWithCoder:(CPCoder)coder
{
}

- (BOOL)isEqual:(id)object
{
    return (object === self);
}

- (id)expressionValueWithObject:(id)object context:(CPDictionary)context
{
    return object;
}

- (CPString)description
{
    return @"SELF";
}

@end

