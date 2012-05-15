require('../../Objective-J/Build/Objective-J.NodeJS.js');

CPLogRegister(CPLogDefault);

OBJJ_INCLUDE_PATHS = ['../../Foundation/Build/Intermediate'];

//CPLog(OBJJ_MAIN_BUNDLE_URL);

//objj_executeFile('main.j', YES);
//objj_executeFile('Foundation.j', NO);

CFBundle.mainBundle().load(YES);

