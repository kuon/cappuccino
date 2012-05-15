// Copied from CPObject in foundation for testing until we can build foundation

@implementation Test
{
    Class isa;
}

+ (void)load
{
}

+ (void)initialize
{
}

+ (id)new
{
    return [[self alloc] init];
}

+ (id)alloc
{
    return class_createInstance(self);
}

- (void)sayHello
{
    CPLog('Hello');
}

@end

var t = [Test alloc];
[t sayHello];
