/***
 * CPInvocationOperation.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

@import "CPInvocation.j"
@import "CPObject.j"
@import "CPOperation.j"

/*!
    @class CPInvocationOperation
    @brief Represents an operation using an invocation that can be run in an CPOperationQueue
*/
@implementation CPInvocationOperation : CPOperation
{
    CPInvocation _invocation;
}


- (void)main
{
    if (_invocation)
    {
        [_invocation invoke];
    }
}

- (id)init
{
    if (self = [super init])
    {
        _invocation = nil;
    }
    return self;
}

/*!
    Returns a CPInvocationOperation object initialized with the specified invocation object.
    @param inv the invocation
*/
- (id)initWithInvocation:(CPInvocation)inv
{
    if (self = [self init])
    {
        _invocation = inv;
    }

    return self;
}

/*!
    Returns a CPInvocationOperation object initialized with the specified target and selector.
    @param target the target
    @param sel the selector that should be called on the target
    @param arg the arguments
*/
- (id)initWithTarget:(id)target selector:(SEL)sel object:(id)arg
{
    var inv = [[CPInvocation alloc] initWithMethodSignature:nil];
    [inv setTarget:target];
    [inv setSelector:sel];
    [inv setArgument:arg atIndex:2];

    return [self initWithInvocation:inv];
}

/*!
    Returns the receiver’s invocation object.
*/
- (CPInvocation)invocation
{
    return _invocation;
}

/*!
    Returns the result of the invocation or method.
*/
- (id)result
{
    if ([self isFinished] && _invocation)
    {
        return [_invocation returnValue];
    }

    return nil;
}

@end
