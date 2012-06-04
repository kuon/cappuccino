/***
 * CPLog+Loggers.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
var levelColorMap = {
    "fatal": "31",
    "error": "31",
    "warn" : "33",
    "info" : "32",
    "debug": "36",
    "trace": "34"
};

try {
    var FILE = require("fs");
    if (process.title)
        CPLogDefaultTitle = process.title;
} catch (e) {
}

GLOBAL(CPLogColorize) = function(aString, aLevel)
{
    // Try to determine if a colorizing stanza is already open, they can't be nested
    if (/^.*\x00\w+\([^\x00]*$/.test(aString))
        return aString;
    else
        return "\033[" + (levelColorMap[aLevel] || "37") + "m" + aString + "\033[39m";
};

GLOBAL(CPLogPrint) = function(aString, aLevel, aTitle, aFormatter)
{
    var formatter = aFormatter || _CPFormatLogMessage;
    console.log(CPLogColorize(formatter(aString, aLevel, aTitle), aLevel));
};

GLOBAL(CPLogDefault) = CPLogPrint;

#ifdef DEBUG
CPLogRegister(CPLogDefault);
#endif
