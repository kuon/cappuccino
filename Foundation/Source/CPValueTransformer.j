
@import "CPData.j"
@import "CPDictionary.j"
@import "CPException.j"
@import "CPKeyedArchiver.j"
@import "CPKeyedUnarchiver.j"
@import "CPNumber.j"
@import "CPObject.j"

var transformerMap = [CPDictionary dictionary];

@implementation CPValueTransformer : CPObject
{

}

+ (void)initialize
{
    if (self !== [CPValueTransformer class])
        return;

    [CPValueTransformer setValueTransformer:[[CPNegateBooleanTransformer alloc] init] forName:CPNegateBooleanTransformerName];
    [CPValueTransformer setValueTransformer:[[CPIsNilTransformer alloc] init] forName:CPIsNilTransformerName];
    [CPValueTransformer setValueTransformer:[[CPIsNotNilTransformer alloc] init] forName:CPIsNotNilTransformerName];
    [CPValueTransformer setValueTransformer:[[CPUnarchiveFromDataTransformer alloc] init] forName:CPUnarchiveFromDataTransformerName];
}

+ (void)setValueTransformer:(CPValueTransformer)transformer forName:(CPString)aName
{
    [transformerMap setObject:transformer forKey:aName];
}

+ (CPValueTransformer)valueTransformerForName:(CPString)aName
{
    return [transformerMap objectForKey:aName];
}

+ (CPArray)valueTransformerNames
{
    return [transformerMap allKeys];
}

+ (BOOL)allowsReverseTransformation
{
  return NO;
}

+ (Class)transformedValueClass
{
    return [CPObject class];
}

- (id)reverseTransformedValue:(id)aValue
{
    if (![[self class] allowsReverseTransformation])
    {
        [CPException raise:CPInvalidArgumentException reason:(self + " is not reversible.")];
    }

    return [self transformedValue:aValue];
}

- (id)transformedValue:(id)aValue
{
    return nil;
}

@end

// built-in transformers

@implementation CPNegateBooleanTransformer : CPValueTransformer
{
}

+ (BOOL)allowsReverseTransformation
{
    return YES;
}

+ (Class)transformedValueClass
{
    return [CPNumber class];
}

- (id)reverseTransformedValue:(id)aValue
{
    return ![aValue boolValue];
}

- (id)transformedValue:(id)aValue
{
    return ![aValue boolValue];
}

@end

@implementation CPIsNilTransformer : CPValueTransformer
{
}

+ (BOOL)allowsReverseTransformation
{
    return NO;
}

+ (Class)transformedValueClass
{
    return [CPNumber class];
}

- (id)transformedValue:(id)aValue
{
    return aValue === nil || aValue === undefined;
}

@end

@implementation CPIsNotNilTransformer : CPValueTransformer
{
}

+ (BOOL)allowsReverseTransformation
{
    return NO;
}

+ (Class)transformedValueClass
{
    return [CPNumber class];
}

- (id)transformedValue:(id)aValue
{
    return aValue !== nil && aValue !== undefined;
}

@end

@implementation CPUnarchiveFromDataTransformer : CPValueTransformer
{
}

+ (BOOL)allowsReverseTransformation
{
    return YES;
}

+ (Class)transformedValueClass
{
    return [CPData class];
}

- (id)reverseTransformedValue:(id)aValue
{
    return [CPKeyedArchiver archivedDataWithRootObject:aValue];
}

- (id)transformedValue:(id)aValue
{
    return [CPKeyedUnarchiver unarchiveObjectWithData:aValue];
}

@end

CPNegateBooleanTransformerName          = @"CPNegateBoolean";
CPIsNilTransformerName                  = @"CPIsNil";
CPIsNotNilTransformerName               = @"CPIsNotNil";
CPUnarchiveFromDataTransformerName      = @"CPUnarchiveFromData";
CPKeyedUnarchiveFromDataTransformerName = @"CPKeyedUnarchiveFromData";
