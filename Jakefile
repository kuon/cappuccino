require('./jakelib/utils.js');


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
subjake('Objective-J', ['required-packages']);

task('npm-objective-j', ['Objective-J'], function()
{
    var cmd = 'npm link objective-j';
    jake.exec([cmd], function()
    {
        console.log('[NPM LINK] Objective-J');
        complete();
    }, {stdout:true, stderr:true});
}, {async:true});

desc('Foundation framework');
subjake('Foundation', ['npm-objective-j']);

desc('Build cappuccino');
task('default', ['Foundation']);

desc('Clean the repository');
task('clean', function()
{
    console.log('# Deleting build directory');
    jake.rmRf('Build');
});
