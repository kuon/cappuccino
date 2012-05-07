#define CONFIG_ENVIRONMENTS ['HMP', 'ObjJ']
#define CONFIG_PLATFORM_OTHER
#define CONFIG_MAIN_BUNDLE_PATH ("/")
#define CONFIG_LOG_FUNCTION alert

var ObjectiveJ = { };

(function (global, exports)
{
#include "Objective-J.js"
})(window, ObjectiveJ);
