    /*
 * AppController.j
 * CPBoxTest
 *
 * Created by You on January 13, 2012.
 * Copyright 2012, Your Company All rights reserved.
 */

@import <Foundation/CPObject.j>


@implementation AppController : CPObject
{
    CPWindow    theWindow; //this "outlet" is connected automatically by the Cib
    @outlet     CPBox   box1;
}

- (void)applicationDidFinishLaunching:(CPNotification)aNotification
{
    // This is called when the application is done loading.
}

- (void)awakeFromCib
{
    // This is called when the cib is done loading.
    // You can implement this method on any object instantiated from a Cib.
    // It's a useful hook for setting up current UI values, and other things.
    // In this case, we want the window from Cib to become our full browser window
    [theWindow setFullPlatformWindow:YES];
}

- (IBAction)click:(id)sender
{
    [box1 setFrameFromContentFrame:CPRectMake(30, 30, 100, 100)];
}

- (IBAction)click2:(id)sender
{
    [box1 setFrameFromContentFrame:CPRectMake(30, 30, 300, 300)];
}

- (IBAction)change:(id)aSender
{
    switch ([aSender title])
    {
        case @"CPAtTop":
            pos = CPAtTop;
            break;
        case @"CPAtBottom":
            pos = CPAtBottom;
            break;
        case @"CPAboveBottom":
            pos = CPAboveBottom;
            break;
        case @"CPBelowBottom":
            pos = CPBelowBottom;
            break;
        case @"CPAboveTop":
            pos = CPAboveTop;
            break;
        case @"CPBelowTop":
            pos = CPBelowTop;
            break;
        case @"CPNoTitle":
            pos = CPNoTitle;
            break;
    }
    [box1 setTitlePosition:pos];
}

@end
