/***
 * Objective-J.NodeJS.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/
#define CONFIG_ENVIRONEMENTS ["NodeJS", "ObjJ"]
#define CONFIG_GLOBAL_OBJECT global
#define CONFIG_MAIN_BUNDLE_RESOLVER global._mainBundleResolver
#define CONFIG_PARSE_XML_RESOLVER global._parseXMLResolver
#define CONFIG_HTTP_REQUEST_RESOLVER global._HTTPRequestResolver

#define CONFIG_SET_TIMEOUT global.setTimeout
#define CONFIG_CLEAR_TIMEOUT global.clearTimeout
#define CONFIG_SET_INTERVAL global.setInterval
#define CONFIG_CLEAR_INTERVAL global.clearInterval

#include "MainBundle.js"
#include "XML.js"
#include "HTTPRequest.js"
#include "Objective-J.js"
#include "CPLog+Loggers.js"
#include "CFPropertyList+File.js"
