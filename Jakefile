require('./jakelib/utils.js');

desc('Create build directory');
directory('Build');

subjake('Objective-J', ['Build']);
subjake('Foundation', ['Objective-J']);

task('default', ['Foundation']);
