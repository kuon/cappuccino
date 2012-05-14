#define CONFIG_ENVIRONEMENTS ["NodeJS", "ObjJ"]
#define CONFIG_RESOLVE_MAIN_BUNDLE_FROM_ARGV
#define CONFIG_HTTP_USE_NODEJS
#define CONFIG_GLOBAL_OBJECT global

#define CONFIG_SET_TIMEOUT global.setTimeout
#define CONFIG_CLEAR_TIMEOUT global.clearTimeout
#define CONFIG_SET_INTERVAL global.setInterval
#define CONFIG_CLEAR_INTERVAL global.clearInterval

#include "Objective-J.js"
#include "CPLog+Loggers.js"
#include "CFPropertyList+File.js"
