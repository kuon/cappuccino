require('../../Objective-J/Build/Objective-J.NodeJS.js');

CPLogRegister(CPLogDefault);

OBJJ_INCLUDE_PATHS = ['../../Foundation/Build'];

//CPLog(OBJJ_MAIN_BUNDLE_URL);

objj_importFile('main.j', YES);
//console.log(f);
//objj_executeFile('Foundation.j', NO);


