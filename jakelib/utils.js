
global.cpp = function(source, target, flags)
{
    flags.push('-DDEBUG');
    cmd = ['gcc', '-w', '-E', '-x c', '-P'].concat(flags).concat([source, '-o', target]).join(' ');
    jake.exec([cmd], function() {
        console.log('[CPP] %s', source);
        complete();
    }, {stdout:true, stderr:true});
}

global.subjake = function(folder, deps)
{
    if (deps === undefined)
        deps = [];

    task(folder, deps, function() {
        jake.exec(['cd ' + folder + ' && jake'], function() {
            complete();
        }, {stdout:true, stderr:true});
    }, {async: true});
}
