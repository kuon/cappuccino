require('./Objective-J/Jake/Base');


file('node_modules/uglify-js', function()
{
    var cmd = 'npm install uglify-js';
    jake.exec([cmd], function()
    {
        console.log('[NPM LINK] Objective-J');
        complete();
    }, {stdout:true, stderr:true});
}, {async:true});

task('required-packages', ['node_modules/uglify-js']);

desc('Objective-J runtime');
tasks.subjake('Objective-J', ['required-packages']);

desc('Foundation framework');
tasks.subjake('Foundation', ['Objective-J']);

desc('Build cappuccino');
task('default', ['Foundation']);

desc('Clean the repository');
task('clean', function()
{
    console.log('# Deleting build directory');
    jake.rmRf('Build');
});
