/***
 * Timeout.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/


var asynchronousTimeoutCount = 0,
    asynchronousTimeoutId = null,
    asynchronousFunctionQueue = [];


GLOBAL(objj_setTimeout) = CONFIG_SET_TIMEOUT;
GLOBAL(objj_clearTimeout) = CONFIG_CLEAR_TIMEOUT;
GLOBAL(objj_setInterval) = CONFIG_SET_INTERVAL;
GLOBAL(objj_clearInterval) = CONFIG_CLEAR_INTERVAL;

function Asynchronous(/*Function*/ aFunction)
{
    var currentAsynchronousTimeoutCount = asynchronousTimeoutCount;

    if (asynchronousTimeoutId === null)
    {
        objj_setTimeout(function()
        {
            var queue = asynchronousFunctionQueue,
                index = 0,
                count = asynchronousFunctionQueue.length;

            ++asynchronousTimeoutCount;
            asynchronousTimeoutId = null;
            asynchronousFunctionQueue = [];

            for (; index < count; ++index)
                queue[index]();
        }, 0);
    }

    return function()
    {
        var args = arguments;

        if (asynchronousTimeoutCount > currentAsynchronousTimeoutCount)
            aFunction.apply(this, args);
        else
            asynchronousFunctionQueue.push(function()
            {
                aFunction.apply(this, args);
            });
    };
}
