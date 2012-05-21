/***
 * _CPKeyPathExpression.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPExpression.j"
@import "_CPFunctionExpression.j"
@import "CPKeyValueCoding.j"
@import "CPString.j"

@implementation _CPKeyPathExpression : _CPFunctionExpression
{
}

- (id)initWithKeyPath:(CPString)keyPath
{
    return [self initWithOperand:[CPExpression expressionForEvaluatedObject] andKeyPath:keyPath];
}

- (id)initWithOperand:(CPExpression)operand andKeyPath:(CPString)keyPath
{
    var arg = [CPExpression expressionForConstantValue:keyPath];
    // Cocoa: if it's a direct path selector use valueForKey:
    self = [super initWithTarget:operand selector:@selector(valueForKeyPath:) arguments:[arg] type:CPKeyPathExpressionType];

    return self;
}

- (BOOL)isEqual:(id)object
{
    if (object === self)
        return YES;

    if (object.isa !== self.isa || ![[object keyPath] isEqualToString:[self keyPath]])
        return NO;

    return YES;
}

- (CPExpression)pathExpression
{
    return [[self arguments] objectAtIndex:0];
}

- (CPString)keyPath
{
    return [[self pathExpression] keyPath];
}

- (CPString)description
{
    var result = "";
    if ([_operand expressionType] != CPEvaluatedObjectExpressionType)
        result += [_operand description] + ".";
    result += [self keyPath];

    return result;
}

@end

@implementation _CPConstantValueExpression (KeyPath)

- (CPString)keyPath
{
    return [self constantValue];
}

@end
