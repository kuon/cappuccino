require('./jakelib/utils.js');

var buildDirectories = [];

directory('Build');

CONFIGURATIONS.forEach(function(configName)
{
    var dirName = 'Build/' + configName;

    directory(dirName, ['Build']);
    buildDirectories.push(dirName);
});

desc('Objective-J runtime');
subjake('Objective-J', buildDirectories);

desc('Foundation framework');
subjake('Foundation', ['Objective-J']);

desc('Build cappuccino');
task('default', ['Foundation']);

desc('Clean the repository');
task('clean', function()
{
    console.log('# Deleting build directory');
    jake.rmRf('Build');
});
