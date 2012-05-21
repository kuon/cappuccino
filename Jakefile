require('./jakelib/utils.js');

var FILE = require('fs'),
    PATH = require('path');

desc('Create build directory');
directory('Build');

desc('Objective-J runtime');
subjake('Objective-J', ['Build']);

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

desc('Update source headers');
task('update-headers', function()
{
    var headerTemplate = FILE.readFileSync('jakelib/header.txt').toString();

    function updateHeader(path)
    {
        var content = FILE.readFileSync(path).toString(),
            header = headerTemplate;

        header = header.replace(/@filename/, PATH.basename(path));
        header = header.replace(/@framework/, path.split('/')[0]);
        content = content.replace(/^\/\*{3}[\s\S]*?\*{3}\/\n/, '');

        FILE.writeFileSync(path, header + content);
    }

    function applyToDirectory(directory)
    {
        var files = FILE.readdirSync(directory);
        files.forEach(function(file)
        {
            var fullpath = PATH.join(directory, file),
                ext = PATH.extname(fullpath);

            if (FILE.statSync(fullpath).isDirectory())
                applyToDirectory(fullpath);

            if (ext === '.j' || ext === '.js')
                updateHeader(fullpath);
        });
    }
    applyToDirectory('Foundation');
});
