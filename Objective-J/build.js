var exec = require('child_process').exec;
var fs = require('fs')
var util = require('util')
var puts = util.puts

function preprocess(inpath, outpath, flags)
{
    exec('gcc ' + flags + ' -w  -E -x c -P '+ inpath + ' -o ' + outpath, function(error, stdout, stderr) {
        if (stdout)
            puts(stdout);
        if (stderr)
            puts(stderr);
    });
}

try {
    fs.mkdirSync('Build')
} catch(err) {}

var platforms = fs.readdirSync('Platforms');

for (var i = 0; i < platforms.length; i++)
{
    var p = platforms[i];
    var flags = '-DDEBUG=1 -ISources -IPlatforms/' + p;
    preprocess('Platforms/' + p + '/Objective-J.' + p + '.js', 'Build/Objective-J.' + p + '.js', flags);
}
