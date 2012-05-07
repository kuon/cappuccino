var exec = require('child_process').exec;
var fs = require('fs')
var util = require('util')
var puts = util.puts

function preprocess(inpath, outpath)
{
    exec('gcc -ISources -w  -E -x c -P '+ inpath + ' -o ' + outpath, function(error, stdout, stderr) {
        if (stdout)
            puts(stdout);
        if (stderr)
            puts(stderr);
    });
}

try {
    fs.mkdirSync('Build')
} catch(err) {}

var envs = fs.readdirSync('Environments');

for (var i = 0; i < envs.length; i++)
{
    var env = envs[i];
    preprocess('Environments/'+env, 'Build/'+env);
}
