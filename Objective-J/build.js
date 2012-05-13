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

var environments = fs.readdirSync('Environments');

for (var i = 0; i < environments.length; i++)
{
    var p = environments[i];
    var flags = '-DDEBUG=1 -ISources -IEnvironments/' + p;
    preprocess('Environments/' + p + '/Objective-J.' + p + '.js', 'Build/Objective-J.' + p + '.js', flags);
}
