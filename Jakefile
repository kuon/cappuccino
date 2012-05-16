require('./jakelib/utils.js');

desc('Create build directory');
directory('Build');

desc('Objective-J runtime');
subjake('Objective-J', ['Build']);

desc('Foundation framework');
subjake('Foundation', ['Objective-J']);

desc('Build cappuccino');
task('default', ['Foundation']);

desc('Clean the repository');
task('clean', function ()
{
    console.log('# Deleting build directory');
    jake.rmRf('Build');
});
