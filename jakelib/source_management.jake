
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
    applyToDirectory('Objective-J');
});
