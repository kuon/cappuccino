/***
 * CPLog.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

GLOBAL(CPLogDisable) = false;

var CPLogDefaultTitle = "Cappuccino";

var CPLogLevels = ["fatal", "error", "warn", "info", "debug", "trace"];
var CPLogDefaultLevel = CPLogLevels[3];

var _CPLogLevelsInverted = {};
for (var i = 0; i < CPLogLevels.length; i++)
    _CPLogLevelsInverted[CPLogLevels[i]] = i;

var _CPLogRegistrations = {};

// Register Functions:

// Register a logger for all levels, or up to an optional max level
GLOBAL(CPLogRegister) = function(aProvider, aMaxLevel, aFormatter)
{
    CPLogRegisterRange(aProvider, CPLogLevels[0], aMaxLevel || CPLogLevels[CPLogLevels.length-1], aFormatter);
};

// Register a logger for a range of levels
GLOBAL(CPLogRegisterRange) = function(aProvider, aMinLevel, aMaxLevel, aFormatter)
{
    var min = _CPLogLevelsInverted[aMinLevel];
    var max = _CPLogLevelsInverted[aMaxLevel];

    if (min !== undefined && max !== undefined && min <= max)
        for (var i = min; i <= max; i++)
            CPLogRegisterSingle(aProvider, CPLogLevels[i], aFormatter);
};

// Register a logger for a single level
GLOBAL(CPLogRegisterSingle) = function(aProvider, aLevel, aFormatter)
{
    if (!_CPLogRegistrations[aLevel])
        _CPLogRegistrations[aLevel] = [];

    // prevent duplicate registrations, but change formatter
    for (var i = 0; i < _CPLogRegistrations[aLevel].length; i++)
        if (_CPLogRegistrations[aLevel][i][0] === aProvider)
        {
            _CPLogRegistrations[aLevel][i][1] = aFormatter;
            return;
        }

    _CPLogRegistrations[aLevel].push([aProvider, aFormatter]);
};

GLOBAL(CPLogUnregister) = function(aProvider) {
    for (var aLevel in _CPLogRegistrations)
        for (var i = 0; i < _CPLogRegistrations[aLevel].length; i++)
            if (_CPLogRegistrations[aLevel][i][0] === aProvider)
                _CPLogRegistrations[aLevel].splice(i--, 1); // decrement since we're removing an element
};

// Main CPLog, which dispatches to individual loggers
function _CPLogDispatch(parameters, aLevel, aTitle)
{
    if (aTitle == undefined)
        aTitle = CPLogDefaultTitle;
    if (aLevel == undefined)
        aLevel = CPLogDefaultLevel;

    // use sprintf if param 0 is a string and there is more than one param. otherwise just convert param 0 to a string
    var message = (typeof parameters[0] == "string" && parameters.length > 1) ? objj_sprintf.apply(null, parameters) : String(parameters[0]);

    if (_CPLogRegistrations[aLevel])
        for (var i = 0; i < _CPLogRegistrations[aLevel].length; i++)
        {
            var logger = _CPLogRegistrations[aLevel][i];
            logger[0](message, aLevel, aTitle, logger[1]);
        }
}

// Setup CPLog() and CPLog.xxx() aliases

GLOBAL(CPLog) = function() { _CPLogDispatch(arguments); };

for (var i = 0; i < CPLogLevels.length; i++)
    CPLog[CPLogLevels[i]] = (function(level) { return function() { _CPLogDispatch(arguments, level); }; })(CPLogLevels[i]);

// Helpers functions:

var _CPFormatLogMessage = function(aString, aLevel, aTitle)
{
    var now = new Date(),
        titleAndLevel;

    if (aLevel === null)
        aLevel = "";
    else
    {
        aLevel = aLevel || "info";
        aLevel = "[" + aLevel + "]";
    }

    aTitle = aTitle || "";

    if (aTitle && aLevel)
        aTitle += " ";

    titleAndLevel = aTitle + aLevel;

    if (titleAndLevel)
        titleAndLevel += ": ";

    if (typeof objj_sprintf == "function")
        return objj_sprintf("%4d-%02d-%02d %02d:%02d:%02d.%03d %s%s",
            now.getFullYear(), now.getMonth() + 1, now.getDate(),
            now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds(),
            titleAndLevel, aString);
    else
        return now + " " + titleAndLevel + ": " + aString;
};

// Loggers:

// CPLogConsole uses the built in "console" object
GLOBAL(CPLogConsole) = function(aString, aLevel, aTitle, aFormatter)
{
    if (typeof console != "undefined")
    {
        var message = (aFormatter || _CPFormatLogMessage)(aString, aLevel, aTitle),
            logger = {
                "fatal": "error",
                "error": "error",
                "warn": "warn",
                "info": "info",
                "debug": "debug",
                "trace": "debug"
            }[aLevel];

        if (logger && console[logger])
            console[logger](message);
        else if (console.log)
            console.log(message);
    }
};

