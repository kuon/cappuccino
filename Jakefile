require('./Objective-J/Jake/Base');

// Required packages (bootstrap)
file('node_modules/uglify-js', function()
{
    var cmd = 'npm install uglify-js';
    jake.exec([cmd], function()
    {
        console.log('[NPM LINK] uglify-js');
        complete();
    }, {stdout:true, stderr:true});
}, {async:true});

task('required-packages', ['node_modules/uglify-js']);


desc('Objective-J runtime');
tasks.subjake('Objective-J', ['required-packages']);

// Link Objective-J locally to be used for frameworks compilation and test runs
file('node_modules/Objective-J', ['Objective-J'], function()
{
    var cmd = 'npm link Objective-J';
    jake.exec([cmd], function()
    {
        console.log('[NPM LINK] Objective-J');
        complete();
    }, {stdout:true, stderr:true});
}, {async:true});

desc('Foundation framework');
tasks.subjake('Foundation', ['node_modules/Objective-J']);

desc('Build cappuccino');
task('default', ['Foundation']);

desc('Clean the repository');
task('clean', function()
{
    console.log('# Deleting build directory');
    jake.rmRf('Build');
});
