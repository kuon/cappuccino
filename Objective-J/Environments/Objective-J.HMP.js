#define CONFIG_ENVIRONMENTS ['HMP', 'ObjJ']
#define CONFIG_MAIN_BUNDLE_PATH ("/")
#define CONFIG_LOG_FUNCTION alert
#define CONFIG_XML_PARSER_FUNCTION window.parseXML
#define CONFIG_NATIVE_REQUEST_CONSTRUCTOR null

var ObjectiveJ = { };

(function (global, exports)
{
#include "Objective-J.js"
})(window, ObjectiveJ);
