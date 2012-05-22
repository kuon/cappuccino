
/*
Temporary macros to substitute for @ref and @deref functionality in a future version of Objective-J. Since these are C macros rather than a part of Preprocessor.js they can only be used within Cappuccino itself.
*/

// @ref
#define AT_REF(x) function(__input) { if (arguments.length) return x = __input; return x; }
// @deref (kind of)
#define AT_DEREF(x, ...) x(__VA_ARGS__)
