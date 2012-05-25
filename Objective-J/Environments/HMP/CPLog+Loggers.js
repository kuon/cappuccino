/***
 * CPLog+Loggers.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

GLOBAL(CPLogPrint) = function(aString, aLevel, aTitle, aFormatter)
{
    var formatter = aFormatter || _CPFormatLogMessage;
    alert(formatter(aString, aLevel, aTitle));
};

GLOBAL(CPLogDefault) = CPLogPrint;


