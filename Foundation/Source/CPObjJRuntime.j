/***
 * CPObjJRuntime.j
 * Foundation framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

function CPStringFromSelector(aSelector)
{
    return sel_getName(aSelector);
}

function CPSelectorFromString(aSelectorName)
{
    return sel_registerName(aSelectorName);
}

function CPClassFromString(aClassName)
{
    return objj_getClass(aClassName);
}

function CPStringFromClass(aClass)
{
    return class_getName(aClass);
}

/*!
    The left operand is smaller than the right.
    @global
    @group CPComparisonResult
*/
CPOrderedAscending      = -1;
/*!
    The left and right operands are equal.
    @global
    @group CPComparisonResult
*/
CPOrderedSame           =  0;
/*!
    The left operand is greater than the right.
    @global
    @group CPComparisonResult
*/
CPOrderedDescending     =  1;

CPNotFound              = -1;
