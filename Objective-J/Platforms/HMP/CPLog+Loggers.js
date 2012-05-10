
GLOBAL(CPLogPrint) = function(aString, aLevel, aTitle, aFormatter) {
    var formatter = aFormatter || _CPFormatLogMessage;
    alert(formatter(aString, aLevel, aTitle));
}

CPLogDefault = CPLogPrint;


