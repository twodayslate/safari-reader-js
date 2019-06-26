/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
function setScrollTop(e) {
    document.documentElement.scrollTop = e
}
function readerWillBecomeVisible() {
    ReaderJS.readerWillBecomeVisible()
}
function readerWillEnterBackground() {
    ReaderJS.readerWillEnterBackground()
}
ReaderJS._clickingOutsideOfPaperRectangleDismissesReader = !0;
let cachedIframeURLMap = new Map;
ReaderJS._readerWillBecomeVisible = function() {
    for (let e of document.querySelectorAll("iframe")) {
        let r = cachedIframeURLMap.get(e);
        r && (e.src = r, cachedIframeURLMap["delete"](e))
    }
}, ReaderJS._readerWillEnterBackground = function() {
    for (let e of document.querySelectorAll("iframe")) {
        let r = e.src;
        r && (cachedIframeURLMap.set(e, e.src), e.removeAttribute("src"))
    }
}, ReaderJS._isJavaScriptEnabled = function() {
    return !!(ReaderJSController.initialConfiguration() || {})[ReaderConfigurationJavaScriptEnabledKey]
}, ReaderAppearanceJS._tryApplyStaticConfiguration = function() {
    return document.body.classList.add("mac"), !1
};

