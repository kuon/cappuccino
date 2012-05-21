require('../../Build/Release/Objective-J/Objective-J.NodeJS.js');

CPLogRegister(CPLogDefault);

OBJJ_INCLUDE_PATHS = ['../../Build/Release'];

objj_importFile('main.j', YES);


