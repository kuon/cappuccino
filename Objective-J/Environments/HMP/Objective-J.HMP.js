HTTPWrapper = function() {
}


#define CONFIG_HTTP_CUSTOM_CLASS HTTPWrapper
#define CONFIG_ENVIRONEMENTS ["HMP", "ObjJ"]
#define CONFIG_MAIN_BUNDLE_URL 'file:/'
#define CONFIG_XML_USE_PARSE_XML
#define CONFIG_GLOBAL_OBJECT window

#define CONFIG_SET_TIMEOUT window.setTimeout
#define CONFIG_CLEAR_TIMEOUT window.clearTimeout
#define CONFIG_SET_INTERVAL window.setInterval
#define CONFIG_CLEAR_INTERVAL window.clearInterval

#include "Objective-J.js"
#include "CPLog+Loggers.js"
