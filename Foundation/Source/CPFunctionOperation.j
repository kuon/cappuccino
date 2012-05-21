
@import "CPArray.j"
@import "CPObject.j"
@import "CPOperation.j"

/*!
    @class CPFunctionOperation
    @brief Represents an operation using a JavaScript function that can be run in an CPOperationQueue
*/
@implementation CPFunctionOperation : CPOperation
{
    CPArray _functions;
}

- (void)main
{
    if (_functions && [_functions count] > 0)
    {
        var i = 0,
            count = [_functions count];

        for (; i < count; i++)
        {
            var func = [_functions objectAtIndex:i];
            func();
        }
    }
}

- (id)init
{
    self = [super init];

    if (self)
    {
        _functions = [];
    }
    return self;
}

/*!
    Adds the specified JS function to the receiver’s list of functions to perform.
*/
- (void)addExecutionFunction:(JSObject)jsFunction
{
    [_functions addObject:jsFunction];
}

/*!
    Returns an array containing the functions associated with the receiver.
*/
- (CPArray)executionFunctions
{
    return _functions;
}

/*!
    Creates and returns an CPFunctionOperation object and adds the specified function to it.
*/
+ (id)functionOperationWithFunction:(JSObject)jsFunction
{
    functionOp = [[CPFunctionOperation alloc] init];
    [functionOp addExecutionFunction:jsFunction];

    return functionOp;
}

@end
