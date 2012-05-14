require('../Build/Objective-J.NodeJS.js');

CPLogRegister(CPLogDefault);

//OBJJ_INCLUDE_PATHS = [require('path').dirname(__filename)];

CPLog(OBJJ_MAIN_BUNDLE_URL);

objj_executeFile('main.j', YES);

