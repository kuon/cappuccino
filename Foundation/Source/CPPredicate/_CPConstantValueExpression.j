
@import "CPDictionary.j"
@import "CPExpression.j"

@implementation _CPConstantValueExpression : CPExpression
{
    id _value;
}

- (id)initWithValue:(id)value
{
    self = [super initWithExpressionType:CPConstantValueExpressionType];

    if (self)
        _value = value;

    return self;
}

- (BOOL)isEqual:(id)object
{
    if (self === object)
        return YES;

    if (object.isa !== self.isa || ![[object constantValue] isEqual:_value])
        return NO;

    return YES;
}

- (id)constantValue
{
    return _value;
}

- (id)expressionValueWithObject:(id)object context:(CPDictionary)context
{
    return _value;
}

- (CPString)description
{
    if ([_value isKindOfClass:[CPString class]])
        return @"\"" + _value + @"\"";

    return [_value description];
}

@end

var CPConstantValueKey = @"CPConstantValue";

@implementation _CPConstantValueExpression (CPCoding)

- (id)initWithCoder:(CPCoder)coder
{
    var value = [coder decodeObjectForKey:CPConstantValueKey];
    return [self initWithValue:value];
}

- (void)encodeWithCoder:(CPCoder)coder
{
    [coder encodeObject:_value forKey:CPConstantValueKey];
}

@end
