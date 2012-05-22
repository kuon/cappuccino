/***
 * _CPCollectionKVCOperators.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@implementation _CPCollectionKVCOperator : CPObject

+ (id)performOperation:(CPString)operator withCollection:(id)aCollection propertyPath:(CPString)propertyPath
{
    var selector = CPSelectorFromString(operator + @"ForCollection:propertyPath:");

    if (![self respondsToSelector:selector])
        return [aCollection valueForUndefinedKey:@"@" + operator];

    return [self performSelector:selector withObject:aCollection withObject:propertyPath];
}

+ (double)avgForCollection:(id)aCollection propertyPath:(CPString)propertyPath
{
    if (!propertyPath)
        return [aCollection valueForUndefinedKey:@"@avg"];

    var objects = [aCollection valueForKeyPath:propertyPath],
        average = 0.0,
        enumerator = [objects objectEnumerator],
        object;

    while ((object = [enumerator nextObject]) !== nil)
        average += [object doubleValue];

    return average / [objects count];
}

+ (double)minForCollection:(id)aCollection propertyPath:(CPString)propertyPath
{
    if (!propertyPath)
        return [aCollection valueForUndefinedKey:@"@min"];

    var objects = [aCollection valueForKeyPath:propertyPath];

    if ([objects count] === 0)
        return nil;

    var enumerator = [objects objectEnumerator],
        min = [enumerator nextObject],
        object;

    while ((object = [enumerator nextObject]) !== nil)
    {
        if ([min compare:object] > 0)
            min = object;
    }

    return min;
}

+ (double)maxForCollection:(id)aCollection propertyPath:(CPString)propertyPath
{
    if (!propertyPath)
        return [aCollection valueForUndefinedKey:@"@max"];

    var objects = [aCollection valueForKeyPath:propertyPath];

    if ([objects count] === 0)
        return nil;

    var enumerator = [objects objectEnumerator],
        max = [enumerator nextObject],
        object;

    while ((object = [enumerator nextObject]) !== nil)
    {
        if ([max compare:object] < 0)
            max = object;
    }

    return max;
}

+ (double)sumForCollection:(id)aCollection propertyPath:(CPString)propertyPath
{
    if (!propertyPath)
        return [aCollection valueForUndefinedKey:@"@sum"];

    var objects = [aCollection valueForKeyPath:propertyPath],
        sum = 0.0,
        enumerator = [objects objectEnumerator],
        object;

    while ((object = [enumerator nextObject]) !== nil)
        sum += [object doubleValue];

    return sum;
}

+ (int)countForCollection:(id)aCollection propertyPath:(CPString)propertyPath
{
    return [aCollection count];
}

@end
