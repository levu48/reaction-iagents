/**
* set app browser policies
*
* See: https://atmospherejs.com/meteor/browser-policy
*
* Note: these also exist in core/server/policy.coffee
* to ensure core can be tested, ran independantly.
*/

/*
BrowserPolicy.content.allowFontDataUrl();

BrowserPolicy.content.allowOriginForAll("fonts.googleapis.com");

BrowserPolicy.content.allowOriginForAll("fonts.gstatic.com");

BrowserPolicy.content.allowOriginForAll("enginex.kadira.io");

BrowserPolicy.content.allowImageOrigin("graph.facebook.com");

BrowserPolicy.content.allowImageOrigin("fbcdn-profile-a.akamaihd.net");

BrowserPolicy.content.allowImageOrigin("secure.gravatar.com");

BrowserPolicy.content.allowImageOrigin("i0.wp.com");

/// tcle, 151016

BrowserPolicy.content.allowDataUrlForAll();
BrowserPolicy.content.allowScriptDataUrl();
*/
BrowserPolicy.content.allowOriginForAll("*.google.com");
BrowserPolicy.content.allowOriginForAll("*.googleapis.com");
BrowserPolicy.content.allowOriginForAll("*.youtube.com");
BrowserPolicy.content.allowOriginForAll("*.gstatic.com");