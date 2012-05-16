
var FILE = require('fs');

CFPropertyList.readPropertyListFromFile = function(/*String*/ aFilePath)
{
    return CFPropertyList.propertyListFromString(FILE.readFileSync(aFilePath, "UTF-8"));
};

CFPropertyList.writePropertyListToFile = function(/*CFPropertyList*/ aPropertyList, /*String*/ aFilePath, /*Format*/ aFormat)
{
    return FILE.writeFileSync(aFilePath, CFPropertyList.stringFromPropertyList(aPropertyList, aFormat), "UTF-8");
};
CFPropertyList.modifyPlist = function(/*String*/ aFilePath, /*Function*/ aCallback, /*String*/ aFormat)
{
    var string = FILE.readFileSync(aFilePath, "UTF-8");
    var format = CFPropertyList.sniffedFormatOfString(string);
    var plist = CFPropertyList.propertyListFromString(string, format);

    aCallback(plist);

    CFPropertyList.writePropertyListToFile(plist, aFilePath, aFormat || format);
};
