#define CONFIG_ENVIRONEMENTS ["Browser", "ObjJ"]
#define CONFIG_XML_USE_DOM
#define CONFIG_HTTP_USE_XMLHTTPREQUEST
#define CONFIG_RESOLVE_MAIN_BUNDLE_FROM_PAGE_URL
#define CONFIG_GLOBAL_OBJECT window

#define CONFIG_SET_TIMEOUT window.setTimeout
#define CONFIG_CLEAR_TIMEOUT window.clearTimeout
#define CONFIG_SET_INTERVAL window.setInterval
#define CONFIG_CLEAR_INTERVAL window.clearInterval


#include "Objective-J.js"
#include "CPLog+Loggers.js"
