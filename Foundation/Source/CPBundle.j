
@import "CPDictionary.j"
@import "CPNotification.j"
@import "CPNotificationCenter.j"
@import "CPObject.j"

CPBundleDidLoadNotification = @"CPBundleDidLoadNotification";

/*!
    @class CPBundle
    @ingroup foundation
    @brief Groups information about an application's code & resources.
*/

var CPBundlesForURLStrings = { };

@implementation CPBundle : CPObject
{
    CFBundle    _bundle;
    id          _delegate;
}

+ (CPBundle)bundleWithURL:(CPURL)aURL
{
    return [[self alloc] initWithURL:aURL];
}

+ (CPBundle)bundleWithPath:(CPString)aPath
{
    return [self bundleWithURL:aPath];
}

+ (CPBundle)bundleForClass:(Class)aClass
{
    return [self bundleWithURL:CFBundle.bundleForClass(aClass).bundleURL()];
}

+ (CPBundle)mainBundle
{
    return [CPBundle bundleWithPath:CFBundle.mainBundle().bundleURL()];
}

- (id)initWithURL:(CPURL)aURL
{
    aURL = new CFURL(aURL);

    var URLString = aURL.absoluteString(),
        existingBundle = CPBundlesForURLStrings[URLString];

    if (existingBundle)
        return existingBundle;

    self = [super init];

    if (self)
    {
        _bundle = new CFBundle(aURL);
        CPBundlesForURLStrings[URLString] = self;
    }

    return self;
}

- (id)initWithPath:(CPString)aPath
{
    return [self initWithURL:aPath];
}

- (Class)classNamed:(CPString)aString
{
    // ???
}

- (CPURL)bundleURL
{
    return _bundle.bundleURL();
}

- (CPString)bundlePath
{
    return [[self bundleURL] path];
}

- (CPString)resourcePath
{
    return [[self resourceURL] path];
}

- (CPURL)resourceURL
{
    return _bundle.resourcesDirectoryURL();
}

- (Class)principalClass
{
    var className = [self objectForInfoDictionaryKey:@"CPPrincipalClass"];

    //[self load];

    return className ? CPClassFromString(className) : Nil;
}

- (CPString)bundleIdentifier
{
    return [self objectForInfoDictionaryKey:@"CPBundleIdentifier"];
}

- (BOOL)isLoaded
{
    return _bundle.isLoaded();
}

- (CPString)pathForResource:(CPString)aFilename
{
    return _bundle.pathForResource(aFilename);
}

- (CPDictionary)infoDictionary
{
    return _bundle.infoDictionary();
}

- (id)objectForInfoDictionaryKey:(CPString)aKey
{
    return _bundle.valueForInfoDictionaryKey(aKey);
}

- (void)loadWithDelegate:(id)aDelegate
{
    _delegate = aDelegate;

    _bundle.addEventListener("load", function()
    {
        [_delegate bundleDidFinishLoading:self];
        // userInfo should contain a list of all classes loaded from this bundle. When writing this there
        // seems to be no efficient way to get it though.
        [[CPNotificationCenter defaultCenter] postNotificationName:CPBundleDidLoadNotification object:self userInfo:nil];
    });

    _bundle.addEventListener("error", function()
    {
        CPLog.error("Could not find bundle: " + self);
    });

    _bundle.load(YES);
}

- (CPArray)staticResourceURLs
{
    var staticResourceURLs = [],
        staticResources = _bundle.staticResources(),
        index = 0,
        count = [staticResources count];

    for (; index < count; ++index)
        [staticResourceURLs addObject:staticResources[index].URL()];

    return staticResourceURLs;
}

- (CPArray)environments
{
    return _bundle.environments();
}

- (CPString)mostEligibleEnvironment
{
    return _bundle.mostEligibleEnvironment();
}

- (CPString)description
{
    return [super description] + "(" + [self bundlePath] + ")";
}

@end
