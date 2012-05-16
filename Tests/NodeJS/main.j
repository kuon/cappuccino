@import <Foundation/Foundation.j>

var o = @"Hello world";

var test = [CPArray new];
[test addObject:o];
CPLog('In main.j');
CPLog([test description]);

[CPTimer scheduledTimerWithTimeInterval:1 callback:function() {
    CPLog(@"Timer");
}
repeats:YES];

