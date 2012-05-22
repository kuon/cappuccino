/***
 * Objective-J.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/

#ifdef DEBUG
#define DISPLAY_NAME(name) name.displayName = #name
#else
#define DISPLAY_NAME(name)
#endif

#define GLOBAL(name) CONFIG_GLOBAL_OBJECT[#name]
#define DYNAMIC_GLOBAL(name) CONFIG_GLOBAL_OBJECT[name]

#include "DebugOptions.js"
#include "json2.js"
#include "sprintf.js"
#include "Timeout.js"
#include "CPLog.js"
#include "Constants.js"
#include "EventDispatcher.js"
#include "CFXML.js"
#include "CFHTTPRequest.js"
#include "FileLoader.js"
#include "CFPropertyList.js"
#include "CFDictionary.js"
#include "CFData.js"
#include "CFURL.js"
#include "MarkedStream.js"
#include "CFBundle.js"
#include "StaticResource.js"
#include "Preprocessor.js"
#include "FileDependency.js"
#include "Executable.js"
#include "FileExecutable.js"
#include "Runtime.js"

#ifdef DEBUG
#include "Debug.js"
#endif
#include "Bootstrap.js"
