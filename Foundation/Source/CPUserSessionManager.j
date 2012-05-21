
@import "CPNotificationCenter.j"
@import "CPObject.j"
@import "CPString.j"

CPUserSessionUndeterminedStatus = 0;
CPUserSessionLoggedInStatus     = 1;
CPUserSessionLoggedOutStatus    = 2;

CPUserSessionManagerStatusDidChangeNotification         = @"CPUserSessionManagerStatusDidChangeNotification";
CPUserSessionManagerUserIdentifierDidChangeNotification = @"CPUserSessionManagerUserIdentifierDidChangeNotification";

var CPDefaultUserSessionManager = nil;

@implementation CPUserSessionManager : CPObject
{
    CPUserSessionStatus _status;

    CPString            _userIdentifier;
}

+ (id)defaultManager
{
    if (!CPDefaultUserSessionManager)
        CPDefaultUserSessionManager = [[CPUserSessionManager alloc] init];

    return CPDefaultUserSessionManager;
}

- (id)init
{
    self = [super init];

    if (self)
        _status = CPUserSessionUndeterminedStatus;

    return self;
}

- (CPUserSessionStatus)status
{
    return _status;
}

- (void)setStatus:(CPUserSessionStatus)aStatus
{
    if (_status == aStatus)
        return;

    _status = aStatus;

    [[CPNotificationCenter defaultCenter]
        postNotificationName:CPUserSessionManagerStatusDidChangeNotification
                      object:self];

    if (_status != CPUserSessionLoggedInStatus)
        [self setUserIdentifier:nil];
}

- (CPString)userIdentifier
{
    return _userIdentifier;
}

- (void)setUserIdentifier:(CPString)anIdentifier
{
    if (_userIdentifier == anIdentifier)
        return;

    _userIdentifier = anIdentifier;

    [[CPNotificationCenter defaultCenter]
        postNotificationName:CPUserSessionManagerUserIdentifierDidChangeNotification
                      object:self];
}

@end
