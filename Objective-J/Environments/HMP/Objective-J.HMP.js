#define CONFIG_ENVIRONEMENTS ["HMP", "ObjJ"]
#define CONFIG_GLOBAL_OBJECT window
#define CONFIG_MAIN_BUNDLE_RESOLVER window._mainBundleResolver
#define CONFIG_PARSE_XML_RESOLVER window._parseXMLResolver
#define CONFIG_HTTP_REQUEST_RESOLVER window._HTTPRequestResolver

#define CONFIG_SET_TIMEOUT window.setTimeout
#define CONFIG_CLEAR_TIMEOUT window.clearTimeout
#define CONFIG_SET_INTERVAL window.setInterval
#define CONFIG_CLEAR_INTERVAL window.clearInterval

#include "MainBundle.js"
#include "XML.js"
#include "HTTPRequest.js"
#include "Objective-J.js"
#include "CPLog+Loggers.js"
