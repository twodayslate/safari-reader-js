/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
//  Copyright (c) 2013 Apple Inc. All rights reserved.
function articleHeight() {
    return document.getElementById("article").offsetHeight + 2 * parseFloat(getComputedStyle(document.getElementById("article")).marginTop)
}
function smoothScroll(e, t, n, i) {
    function a(t, n) {
        scrollEventIsSmoothScroll = !0, e.scrollTop = n, setTimeout(function() {
            scrollEventIsSmoothScroll = !1
        }, 0)
    }
    const o = 1e3 / 60;
    let r = e.scrollTop,
        s = r + t,
        l = 0,
        m = articleHeight() - window.innerHeight;
    if (s < l && (s = l), s > m && (s = m), r != s) {
        let e = Math.abs(s - r);
        if (e < Math.abs(t) && (n = n * e / Math.abs(t)), smoothScrollingAnimator) {
            let e = smoothScrollingAnimator.animations[0],
                t = e.progress,
                l = t > .5 ? 1 - t : t,
                m = n / (1 - l),
                c = -l * m,
                d = Math.sin(Math.PI / 2 * l),
                u = d * d,
                g = (r - s * u) / (1 - u);
            return abortSmoothScroll(), smoothScrollingAnimator = new AppleAnimator(m, o, i), smoothScrollingAnimation = new AppleAnimation(g, s, a), smoothScrollingAnimator.addAnimation(smoothScrollingAnimation), void smoothScrollingAnimator.start(c)
        }
        smoothScrollingAnimator = new AppleAnimator(n, o, i), smoothScrollingAnimation = new AppleAnimation(r, s, a), smoothScrollingAnimator.addAnimation(smoothScrollingAnimation), smoothScrollingAnimator.start()
    }
}
function abortSmoothScroll() {
    smoothScrollingAnimator.stop(AnimationTerminationCondition.Interrupted), smoothScrollingAnimator = null, smoothScrollingAnimation = null
}
function articleScrolled() {
    !scrollEventIsSmoothScroll && smoothScrollingAnimator && abortSmoothScroll(), ReaderJSController.articleScrolled()
}
function traverseReaderContent(e, t) {
    if (e) {
        let n = e.offsetTop,
            i = document.createTreeWalker(document.getElementById("article"), NodeFilter.SHOW_ELEMENT, {
                acceptNode: function(e) {
                    let t = e.classList;
                    return t.contains("page-number") || t.contains("float") || t.contains("page") || t.contains("scrollable") || "HR" === e.tagName || 0 === e.offsetHeight || "inline" === getComputedStyle(e).display || n === e.offsetTop ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
                }
            });
        return i.currentNode = e, i[t]()
    }
}
function nextReaderContentElement(e) {
    return traverseReaderContent(e, "nextNode")
}
function previousReaderContentElement(e) {
    return traverseReaderContent(e, "previousNode")
}
function articleTitleElement() {
    return document.querySelector("#article .page .title")
}
function keyDown(e) {
    let t = !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey),
        n = !e.metaKey && !e.altKey && !e.ctrlKey && e.shiftKey;
    switch (e.keyCode) {
    case 8:
        n ? ReaderJSController.goForward() : t && ReaderJSController.goBack(), e.preventDefault();
        break;
    case 74:
        ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Down);
        break;
    case 75:
        ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Up)
    }
}
function getArticleScrollPosition() {
    scrollInfo = {}, scrollInfo.version = 1;
    let e = document.getElementsByClassName("page"),
        t = e.length;
    if (!t)
        return scrollInfo.pageIndex = 0, scrollInfo;
    scrollInfo.pageIndex = e.length - 1;
    let n = window.scrollY;
    for (let i = 0; i < t; i++) {
        let t = e[i];
        if (t.offsetTop + t.offsetHeight >= n) {
            scrollInfo.pageIndex = i;
            break
        }
    }
    return scrollInfo
}
function restoreInitialArticleScrollPosition() {
    let e = document.getElementsByClassName("page"),
        t = e[initialScrollPosition.pageIndex];
    t && (document.body.scrollTop = t.offsetTop)
}
function restoreInitialArticleScrollPositionIfPossible() {
    if (!didRestoreInitialScrollPosition) {
        if (!(initialScrollPosition || (initialScrollPosition = ReaderJSController.initialArticleScrollPosition()) && initialScrollPosition.pageIndex))
            return void (didRestoreInitialScrollPosition = !0);
        let e = document.getElementsByClassName("page-number").length;
        initialScrollPosition.pageIndex >= e || (setTimeout(restoreInitialArticleScrollPosition, DelayBeforeRestoringScrollPositionInMs), didRestoreInitialScrollPosition = !0)
    }
}
function makeWideElementsScrollable() {
    let e = document.querySelectorAll("table, pre");
    for (let t of e)
        if (!t.classList.contains("float") && !t.parentElement.classList.contains("scrollable")) {
            let e = document.createElement("div");
            t.parentElement.insertBefore(e, t), t.remove(), e.appendChild(t), e.classList.add("scrollable")
        }
}
function fontSettings(e) {
    const t = [15, 16, 17, 18, 19, 20, 21, 23, 26, 28, 37, 46],
        n = ["25px", "26px", "27px", "28px", "29px", "30px", "31px", "33px", "37px", "39px", "51px", "62px"],
        i = {
            System: {
                lineHeights: ["25px", "26px", "27px", "29px", "30px", "31px", "32px", "33px", "38px", "39px", "51px", "62px"],
                cssClassName: "system"
            },
            Athelas: {
                cssClassName: "athelas"
            },
            Charter: {
                lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "39px", "51px", "62px"],
                cssClassName: "charter"
            },
            Georgia: {
                lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "41px", "51px", "62px"],
                cssClassName: "georgia"
            },
            "Iowan Old Style": {
                lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "39px", "51px", "62px"],
                cssClassName: "iowan"
            },
            Palatino: {
                lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "31px", "34px", "37px", "40px", "51px", "62px"],
                cssClassName: "palatino"
            },
            Seravek: {
                lineHeights: ["25px", "26px", "27px", "28px", "28px", "30px", "31px", "34px", "37px", "39px", "51px", "62px"],
                cssClassName: "seravek"
            },
            "Times New Roman": {
                cssClassName: "times"
            },
            "Hiragino Sans W3": {
                cssClassName: "hiraginosans",
                lineHeights: ["1.85em", "1.78em", "1.74em", "1.71em", "1.72em", "1.73em", "1.75em", "1.76em", "1.78em", "1.9em", "1.92em", "2em"]
            },
            "Hiragino Kaku Gothic ProN": {
                cssClassName: "hiraginokaku",
                lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"]
            },
            "Hiragino Mincho ProN": {
                cssClassName: "hiraginomincho",
                lineHeights: ["1.75em", "1.72em", "1.69em", "1.66em", "1.64em", "1.56em", "1.53em", "1.56em", "1.6em", "1.65em", "1.69em", "1.72em"]
            },
            "Hiragino Maru Gothic ProN": {
                cssClassName: "hiraginomaru",
                lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"]
            },
            "PingFang SC": {
                lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"],
                cssClassName: "pingfangsc"
            },
            "Heiti SC": {
                lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.7em", "1.71em", "1.72em", "1.75em", "1.8em", "1.9em", "1.95em", "2em"],
                cssClassName: "heitisc"
            },
            "Songti SC": {
                lineHeights: ["1.8em", "1.78em", "1.74em", "1.72em", "1.71em", "1.72em", "1.73em", "1.75em", "1.8em", "1.9em", "1.95em", "1.96em"],
                cssClassName: "songtisc"
            },
            "Kaiti SC": {
                lineHeights: ["1.75em", "1.72em", "1.69em", "1.66em", "1.64em", "1.56em", "1.53em", "1.56em", "1.6em", "1.65em", "1.69em", "1.72em"],
                cssClassName: "kaitisc"
            },
            "Yuanti SC": {
                lineHeights: ["1.95em", "1.93em", "1.9em", "1.87em", "1.85em", "1.8em", "1.83em", "1.85em", "1.88em", "1.9em", "1.91em", "1.92em"],
                cssClassName: "yuantisc"
            },
            "Libian SC": {
                fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
                lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
                cssClassName: "libiansc"
            },
            "Weibei SC": {
                fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
                lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
                cssClassName: "weibeisc"
            },
            "Yuppy SC": {
                lineHeights: ["1.75em", "1.73em", "1.7em", "1.67em", "1.65em", "1.6em", "1.63em", "1.65em", "1.68em", "1.7em", "1.71em", "1.72em"],
                cssClassName: "yuppysc"
            },
            "PingFang TC": {
                lineHeights: ["1.85em", "1.78em", "1.75em", "1.72em", "1.7em", "1.7em", "1.7em", "1.72em", "1.75em", "1.82em", "1.85em", "1.9em"],
                cssClassName: "pingfangtc"
            },
            "Heiti TC": {
                lineHeights: ["1.85em", "1.78em", "1.75em", "1.72em", "1.71em", "1.71em", "1.72em", "1.75em", "1.78em", "1.82em", "1.86em", "1.9em"],
                cssClassName: "heititc"
            },
            "Songti TC": {
                lineHeights: ["1.8em", "1.78em", "1.74em", "1.73em", "1.72em", "1.72em", "1.73em", "1.75em", "1.8em", "1.9em", "1.95em", "1.96em"],
                cssClassName: "songtitc"
            },
            "Kaiti TC": {
                fontSizes: [20, 21, 22, 23, 24, 25, 26, 28, 31, 33, 38, 43],
                lineHeights: ["1.63em", "1.62em", "1.62em", "1.6em", "1.56em", "1.53em", "1.5em", "1.53em", "1.56em", "1.6em", "1.62em", "1.63em"],
                cssClassName: "kaititc"
            },
            "Yuanti TC": {
                lineHeights: ["1.95em", "1.93em", "1.9em", "1.87em", "1.85em", "1.8em", "1.83em", "1.85em", "1.88em", "1.9em", "1.91em", "1.92em"],
                cssClassName: "yuantitc"
            },
            "Libian TC": {
                fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
                lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
                cssClassName: "libiantc"
            },
            "Weibei TC": {
                fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
                lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
                cssClassName: "weibeitc"
            },
            "Yuppy TC": {
                lineHeights: ["1.75em", "1.73em", "1.7em", "1.67em", "1.65em", "1.6em", "1.63em", "1.65em", "1.68em", "1.7em", "1.71em", "1.72em"],
                cssClassName: "yuppytc"
            },
            "Apple SD Gothic Neo": {
                cssClassName: "applesdgothicneo"
            },
            "Nanum Gothic": {
                cssClassName: "nanumgothic"
            },
            "Nanum Myeongjo": {
                cssClassName: "nanummyeongjo"
            },
            "Khmer Sangam MN": {
                cssClassName: "khmersangammn"
            },
            "Lao Sangam MN": {
                cssClassName: "laosangam"
            },
            Thonburi: {
                cssClassName: "thonburi"
            },
            Damascus: {
                cssClassName: "damascus"
            },
            Kefa: {
                cssClassName: "kefa"
            },
            "Arial Hebrew": {
                cssClassName: "arialhebrew"
            },
            Mshtakan: {
                cssClassName: "mshtakan"
            },
            "Plantagenet Cherokee": {
                cssClassName: "plantagenetcherokee"
            },
            "Euphemia UCAS": {
                cssClassName: "euphemiaucas"
            },
            "Kohinoor Bangla": {
                cssClassName: "kohinoorbangla"
            },
            "Bangla Sangam MN": {
                cssClassName: "banglasangammn"
            },
            "Gujarati Sangam MN": {
                cssClassName: "gujarati"
            },
            "Gurmukhi MN": {
                cssClassName: "gurmukhi"
            },
            "Kohinoor Devanagari": {
                cssClassName: "kohinoordevanagari"
            },
            "ITF Devanagari": {
                cssClassName: "itfdevanagari"
            },
            "Kannada Sangam MN": {
                cssClassName: "kannada"
            },
            "Malayalam Sangam MN": {
                cssClassName: "malayalam"
            },
            "Oriya Sangam MN": {
                cssClassName: "oriya"
            },
            "Sinhala Sangam MN": {
                cssClassName: "sinhala"
            },
            InaiMathi: {
                cssClassName: "inaimathi"
            },
            "Tamil Sangam MN": {
                cssClassName: "tamil"
            },
            "Kohinoor Telugu": {
                cssClassName: "kohinoortelugu"
            },
            "Telugu Sangam MN": {
                cssClassName: "telugu"
            },
            "Noto Nastaliq Urdu": {
                lineHeights: ["2.6em", "2.7em", "2.8em", "2.8em", "2.8em", "2.8em", "2.8em", "2.6em", "2.5em", "2.5em", "2.5em", "2.6em"],
                cssClassName: "noto"
            },
            "Geeza Pro": {
                cssClassName: "geezapro"
            },
            "Arial Unicode MS": {
                cssClassName: "arialunicodems"
            },
            "Arial Rounded MT Bold": {
                cssClassName: "arialmt"
            },
            Tahoma: {
                cssClassName: "tahoma"
            }
        };
    let a = i[e];
    return a ? (a.fontSizes || (a.fontSizes = t), a.lineHeights || (a.lineHeights = n), a) : a
}
function prepareTweetsInPrintingMailingFrame(e) {
    let t = e.querySelectorAll(".tweet-wrapper");
    for (let e of t) {
        let t = e.querySelector("iframe");
        t && t.remove();
        let n = e.querySelector(".simple-tweet");
        n && n.classList.remove("hidden")
    }
}
function localeForElement(e) {
    let t = ReaderJSController.bestLocaleForString(e.textContent);
    return t && t.length && "und" !== t ? t : "en"
}
function urlFromString(e) {
    try {
        return new URL(e)
    } catch (e) {
        return null
    }
}
function stopExtendingElementBeyondTextColumn(e) {
    e.classList.remove("extendsBeyondTextColumn"), e.style && (e.style.removeProperty("width"), e.style.removeProperty("-webkit-margin-start"))
}
function leadingMarginAndPaddingAppliedToElementFromAncestors(e) {
    let t = 0,
        n = e.parentElement;
    for (; n && !n.classList.contains("page");) {
        let e = getComputedStyle(n);
        t += parseFloat(e["-webkit-padding-start"]) + parseFloat(e["-webkit-margin-start"]), n = n.parentElement
    }
    return t
}
function extendElementBeyondTextColumn(e, t, n) {
    e.classList.add("extendsBeyondTextColumn"), e.style && (e.style.setProperty("width", t + "px"), e.style.setProperty("-webkit-margin-start", (n - t) / 2 - leadingMarginAndPaddingAppliedToElementFromAncestors(e) + "px"))
}
function monitorMouseDownForPotentialDeactivation(e) {
    lastMouseDownWasOutsideOfPaper = e && ReaderAppearanceJS.usesPaperAppearance() && !document.getElementById("article").contains(e.target)
}
function deactivateIfEventIsOutsideOfPaperContainer(e) {
    lastMouseDownWasOutsideOfPaper && e && ReaderAppearanceJS.usesPaperAppearance() && !document.getElementById("article").contains(e.target) && ReaderJSController.requestDeactivationFromUserAction()
}
function updatePageNumbers() {
    let e = document.getElementsByClassName("page-number"),
        t = e.length,
        n = ReaderJS.isLoadingNextPage();
    for (let i = 0; i < t; ++i)
        e[i].textContent = n ? getLocalizedString("Page %@").format(i + 1) : getLocalizedString("Page %@ of %@").format(i + 1, t)
}
function incomingPagePlaceholder() {
    return document.getElementById("incoming-page-placeholder")
}
function addIncomingPagePlaceholder(e) {
    let t = document.createElement("div");
    t.className = "page", t.id = "incoming-page-placeholder";
    let n = document.createElement("div");
    n.id = "incoming-page-corner";
    let i = document.createElement("div");
    i.id = "incoming-page-text", i.innerText = getLocalizedString(e ? "Loading Next Page\u2026" : "Connect to the Internet to view remaining pages."), n.appendChild(i), t.appendChild(n), document.getElementById("article").appendChild(t)
}
function removeIncomingPagePlaceholder() {
    let e = incomingPagePlaceholder();
    e.parentNode.removeChild(e)
}
function nextPageContainer() {
    return document.getElementById("next-page-container")
}
function getLocalizedString(e) {
    let t = localizedStrings[e];
    return t || e
}
function nextPageLoadComplete() {
    if (nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), ReaderJS.pageNumber++, ReaderJS.readerOperationMode == ReaderOperationMode.OffscreenFetching) {
        let e = ReaderJS.pageURLs[ReaderJS.pageURLs.length - 1];
        ReaderJSController.nextPageLoadComplete(ReaderJS.pageNumber, e, "next-page-container")
    }
    ReaderJSController.prepareNextPageFrame("next-page-container");
    let e = ReaderJSController.nextPageArticleFinder();
    e.pageNumber = ReaderJS.pageNumber, e.suggestedRouteToArticle = ReaderJS.routeToArticle, e.previouslyDiscoveredPageURLStrings = ReaderJS.pageURLs;
    let t = e.adoptableArticle();
    t && (ReaderJS.createPageFromNode(t), ReaderJS.routeToArticle = e.routeToArticleNode()), nextPageContainer().removeAttribute("src"), ReaderJSController.clearNextPageArticleFinder(), ReaderJS.canLoadNextPage() ? ReaderJS.setNextPageURL(e.nextPageURL()) : ReaderJS.setCachedNextPageURL(e.nextPageURL()), updatePageNumbers(), restoreInitialArticleScrollPositionIfPossible(), ReaderJS.isLoadingNextPage() || ReaderJS.doneLoadingAllPages()
}
function contentElementTouchingTopOfViewport() {
    let e = articleTitleElement();
    do {
        let t = e.getBoundingClientRect();
        if (t.top <= 0 && t.bottom >= 0)
            return e
    } while (e = nextReaderContentElement(e));
    return null
}
function setConfiguration(e) {
    ReaderAppearanceJS.applyConfiguration(e)
}
const LoadNextPageDelay = 250,
    MaxNumberOfNextPagesToLoad = 80,
    ReaderOperationMode = {
        Normal: 0,
        OffscreenFetching: 1,
        ArchiveViewing: 2
    },
    DelayBeforeRestoringScrollPositionInMs = 1e3;
String.prototype.format = function() {
    let e = this.split("%@");
    for (let t = 0, n = arguments.length; t < n; ++t)
        e.splice(2 * t + 1, 0, arguments[t].toString());
    return e.join("")
};
const AnimationTerminationCondition = {
    Interrupted: 0,
    CompletedSuccessfully: 1
};
AppleAnimator = function(e, t, n) {
    this.startTime = 0, this.duration = e, this.interval = t, this.animations = [], this.animationFinishedCallback = n, this.currentFrameRequestID = null, this._firstTime = !0;
    let i = this;
    this.animate = function() {
        function e(e, t, n) {
            return e < t ? t : e > n ? n : e
        }
        let t,
            n,
            a,
            o = (new Date).getTime(),
            r = i.duration;
        t = e(o - i.startTime, 0, r), o = t / r, n = .5 - .5 * Math.cos(Math.PI * o), a = t >= r;
        let s = i.animations,
            l = s.length,
            m = i._firstTime;
        for (let e = 0; e < l; ++e)
            s[e].doFrame(i, n, m, a, o);
        if (a)
            return void i.stop(AnimationTerminationCondition.CompletedSuccessfully);
        i._firstTime = !1, this.currentFrameRequestID = requestAnimationFrame(i.animate)
    }
}, AppleAnimator.prototype = {
    start: function(e) {
        let t = (new Date).getTime(),
            n = this.interval;
        this.startTime = t - n, e && (this.startTime += e), this.currentFrameRequestID = requestAnimationFrame(this.animate)
    },
    stop: function(e) {
        this.animationFinishedCallback && this.animationFinishedCallback(e), this.currentFrameRequestID && cancelAnimationFrame(this.currentFrameRequestID)
    },
    addAnimation: function(e) {
        this.animations[this.animations.length] = e
    }
}, AppleAnimation = function(e, t, n) {
    this.from = e, this.to = t, this.callback = n, this.now = e, this.ease = 0, this.progress = 0
}, AppleAnimation.prototype = {
    doFrame: function(e, t, n, i, a) {
        let o;
        o = i ? this.to : this.from + (this.to - this.from) * t, this.now = o, this.ease = t, this.progress = a, this.callback(e, o, n, i)
    }
};
let smoothScrollingAnimator,
    smoothScrollingAnimation,
    scrollEventIsSmoothScroll = !1;
window.addEventListener("scroll", articleScrolled, !1);
const ContentAwareNavigationMarker = "reader-content-aware-navigation-marker",
    ContentAwareNavigationAnimationDuration = 200,
    ContentAwareNavigationElementOffset = 8,
    ContentAwareNavigationDirection = {
        Up: 0,
        Down: 1
    };
ContentAwareScroller = function() {
    this._numberOfContentAwareScrollAnimationsInProgress = 0
}, ContentAwareScroller.prototype = {
    _contentElementAtTopOfViewport: function() {
        let e = articleTitleElement();
        do {
            if (!(e.getBoundingClientRect().top < ContentAwareNavigationElementOffset))
                return e
        } while (e = nextReaderContentElement(e));
        return null
    },
    _clearTargetOfContentAwareScrolling: function() {
        let e = document.getElementById(ContentAwareNavigationMarker);
        e && e.removeAttribute("id")
    },
    _contentAwareScrollFinished: function(e) {
        e === AnimationTerminationCondition.CompletedSuccessfully && (--this._numberOfContentAwareScrollAnimationsInProgress || (smoothScrollingAnimator = null, smoothScrollingAnimation = null, this._clearTargetOfContentAwareScrolling()))
    },
    scroll: function(e) {
        let t,
            n,
            i = document.getElementById(ContentAwareNavigationMarker),
            a = i || this._contentElementAtTopOfViewport();
        if (e === ContentAwareNavigationDirection.Down) {
            let e = Math.abs(a.getBoundingClientRect().top - ContentAwareNavigationElementOffset) < 1;
            t = i || e ? nextReaderContentElement(a) : a
        } else if (e === ContentAwareNavigationDirection.Up)
            if (a === articleTitleElement()) {
                if (0 === document.body.scrollTop)
                    return;
                n = -1 * document.body.scrollTop
            } else
                t = previousReaderContentElement(a);
        t && (n = t.getBoundingClientRect().top - ContentAwareNavigationElementOffset), ++this._numberOfContentAwareScrollAnimationsInProgress, smoothScroll(document.body, n, ContentAwareNavigationAnimationDuration, this._contentAwareScrollFinished.bind(this)), this._clearTargetOfContentAwareScrolling(), t && (t.id = ContentAwareNavigationMarker)
    }
}, window.addEventListener("keydown", keyDown, !1);
let initialScrollPosition,
    didRestoreInitialScrollPosition = !1;
const ThemeSettings = {
        White: {
            cssClassName: "white"
        },
        Gray: {
            cssClassName: "gray",
            tweetTheme: "dark"
        },
        Sepia: {
            cssClassName: "sepia"
        },
        Night: {
            cssClassName: "night",
            tweetTheme: "dark"
        }
    },
    ShouldRestoreReadingPosition = {
        No: !1,
        Yes: !0
    },
    MinTextZoomIndex = 0,
    MaxTextZoomIndex = 11,
    MaximumWidthOfImageOrVideoExtendingBeyondTextContainer = 1050,
    ReaderConfigurationJavaScriptEnabledKey = "javaScriptEnabled";
ReaderAppearanceController = function() {
    this._shouldUsePaperAppearance = function() {
        return this.articleWidth() + 140 < this.documentElementWidth()
    }, this._isOLEDDisplay = function() {
        return !1
    }, this._tryApplyStaticConfiguration = function() {
        return !1
    }, this._canLayOutContentBeyondMainTextColumn = !0, this._defaultFontFamilyName = "System", this._defaultThemeName = "White", this.configuration = {}, this._textSizeIndex = null, this._fontFamilyName = this._defaultFontFamilyName, this._themeName = this._defaultThemeName
}, ReaderAppearanceController.prototype = {
    initialize: function() {
        this.applyConfiguration(ReaderJSController.initialConfiguration()), this._isOLEDDisplay() && document.body.classList.add("oled")
    },
    applyConfiguration: function(e) {
        if (this._tryApplyStaticConfiguration())
            return void this.layOutContent();
        let t = this._locale();
        this.setLocale(t), this.setFontFamily(e.fontFamilyNameForLanguageTag[t] || e.defaultFontFamilyNameForLanguage[t] || "System"), this.setTheme(e.themeName), this.setCurrentTextSizeIndex(e.fontSizeIndex), this.configuration = e, this.layOutContent()
    },
    articleWidth: function() {
        return document.getElementById("article").getBoundingClientRect().width
    },
    _textColumnWidthInPoints: function() {
        return parseFloat(getComputedStyle(document.querySelector("#article .page")).width)
    },
    documentElementWidth: function() {
        return document.documentElement.clientWidth
    },
    setCurrentTextSizeIndex: function(e) {
        this._textSizeIndex = e, this._rebuildDynamicStyleSheet()
    },
    currentFontCSSClassName: function() {
        return this._currentFontSettings().cssClassName
    },
    _currentFontSettings: function() {
        return fontSettings(this._fontFamilyName)
    },
    setLocale: function(e) {
        if (e !== this._lastSetLocale) {
            let t = document.body.classList;
            const n = "locale-";
            t.remove(n + this._lastSetLocale), t.add(n + e), this._lastSetLocale = e
        }
    },
    setFontFamily: function(e) {
        let t = document.body,
            n = fontSettings(e);
        t.classList.contains(n.cssClassName) || (this._fontFamilyName && t.classList.remove(fontSettings(this._fontFamilyName).cssClassName), t.classList.add(n.cssClassName), this._fontFamilyName = e)
    },
    _theme: function() {
        return ThemeSettings[this._themeName]
    },
    setTheme: function(e) {
        let t = document.body,
            n = ThemeSettings[e];
        t.classList.contains(n.cssClassName) || (this._theme() && t.classList.remove(this._theme().cssClassName), t.classList.add(n.cssClassName), this._themeName = e)
    },
    usesPaperAppearance: function() {
        return document.documentElement.classList.contains("paper")
    },
    layOutContent: function(e) {
        e === undefined && (e = ShouldRestoreReadingPosition.Yes), this._shouldUsePaperAppearance() ? document.documentElement.classList.add("paper") : document.documentElement.classList.remove("paper"), makeWideElementsScrollable(), this._canLayOutContentBeyondMainTextColumn && (this._layOutImagesAndVideoElementsBeyondTextColumn(), this._layOutElementsContainingTextBeyondTextColumn(), this._layOutVideos()), this._layOutMetadataBlock(), e === ShouldRestoreReadingPosition.Yes && ReadingPositionStabilizerJS.restorePosition()
    },
    _layOutMetadataBlock: function() {
        let e = document.querySelector(".metadata");
        if (e) {
            let t = e.querySelector(".byline"),
                n = e.querySelector(".date");
            if (!t || !n)
                return void e.classList.add("singleline");
            let i = 0;
            for (let e of t.getClientRects())
                i += e.width;
            for (let e of n.getClientRects())
                i += e.width;
            i + 25 > this._textColumnWidthInPoints() ? e.classList.remove("singleline") : e.classList.add("singleline")
        }
    },
    _layOutImagesAndVideoElementsBeyondTextColumn: function() {
        let e = this.canLayOutContentMaintainingAspectRatioBeyondTextColumn(),
            t = document.getElementById("article").querySelectorAll("img, video");
        for (let n of t)
            this.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(n, e)
    },
    _layOutElementsContainingTextBeyondTextColumn: function() {
        const e = {
                PRE: !0,
                TABLE: !1
            },
            t = 22;
        let n = document.querySelectorAll(".scrollable pre, .scrollable table");
        for (let i of n) {
            let n = i.parentElement;
            for (let e = n; e; e = e.parentElement)
                "BLOCKQUOTE" === e.tagName && e.classList.add("simple");
            stopExtendingElementBeyondTextColumn(n);
            let a = i.scrollWidth,
                o = this._textColumnWidthInPoints();
            if (!(a <= o)) {
                let r = getComputedStyle(document.querySelector(".page")),
                    s = 0;
                if (e[i.tagName]) {
                    let e = parseFloat(r["-webkit-padding-start"]) + parseFloat(r["-webkit-margin-start"]);
                    s = Math.min(e, t)
                }
                let l = Math.min(a, this._widthAvailableForLayout() - 2 * s);
                extendElementBeyondTextColumn(n, l, o)
            }
        }
    },
    _layOutVideos: function() {
        function e(e) {
            return e.src && /^(.+\.)?(youtube(-nocookie)?|vimeo)\.com\.?$/.test(urlFromString(e.src).hostname)
        }
        const t = 16 / 9;
        let n,
            i,
            a = ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn();
        for (let o of document.getElementById("article").querySelectorAll("iframe"))
            if (e(o)) {
                let e;
                if (o.parentElement.classList.contains("iframe-wrapper") ? e = o.parentElement : (e = document.createElement("div"), e.className = "iframe-wrapper", o.nextSibling ? o.parentNode.insertBefore(e, o.nextSibling) : o.parentNode.appendChild(e), e.appendChild(o)), n || (n = Math.min(MaximumWidthOfImageOrVideoExtendingBeyondTextContainer, this._widthAvailableForLayout())), i || (i = this._textColumnWidthInPoints()), a && n > i) {
                    e.style.height = n / t + "px", extendElementBeyondTextColumn(e, n, i), o.style.height = "100%";
                    let a = this.usesPaperAppearance() ? 2 : 0;
                    o.style.width = n - a + "px"
                } else
                    stopExtendingElementBeyondTextColumn(e), e.style.width = "100%", e.style.height = this._textColumnWidthInPoints() / t + "px"
            }
    },
    canLayOutContentMaintainingAspectRatioBeyondTextColumn: function() {
        return window.innerHeight >= 700 || window.innerWidth / window.innerHeight <= 1.25
    },
    setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate: function(e, t) {
        if (t && !e.closest("blockquote, table, .float")) {
            let t,
                n = this._textColumnWidthInPoints(),
                i = parseFloat(e.getAttribute("width"));
            t = isNaN(i) ? e.naturalWidth : i;
            let a = Math.min(t, Math.min(MaximumWidthOfImageOrVideoExtendingBeyondTextContainer, this._widthAvailableForLayout()));
            if (a > n)
                return void extendElementBeyondTextColumn(e, a, n)
        }
        stopExtendingElementBeyondTextColumn(e)
    },
    _widthAvailableForLayout: function() {
        return this.usesPaperAppearance() ? this.articleWidth() : this.documentElementWidth()
    },
    _rebuildDynamicStyleSheet: function() {
        let e = document.getElementById("dynamic-article-content").sheet;
        for (; e.cssRules.length;)
            e.removeRule(0);
        let t = this._currentFontSettings().fontSizes[this._textSizeIndex] + "px",
            n = this._currentFontSettings().lineHeights[this._textSizeIndex];
        e.insertRule("#article { font-size: " + t + "; line-height: " + n + "; }")
    },
    _locale: function() {
        let e = document.getElementById("article").style.webkitLocale;
        return e && e.length ? e : ""
    }
};
let lastMouseDownWasOutsideOfPaper = !1;
ReaderController = function() {
    this.pageNumber = 1, this.pageURLs = [], this.articleIsLTR = !0, this.loadingNextPage = !1, this.loadingNextPageManuallyStopped = !1, this.cachedNextPageURL = null, this.lastKnownUserVisibleWidth = 0, this.lastKnownDocumentElementWidth = 0, this._readerWillBecomeVisible = function() {}, this._readerWillEnterBackground = function() {}, this._distanceFromBottomOfArticleToStartLoadingNextPage = function() {
        return NaN
    }, this._clickingOutsideOfPaperRectangleDismissesReader = !1, this._shouldSkipActivationWhenPageLoads = function() {
        return !1
    }, this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing = !1, this._deferSendingContentIsReadyForDisplay = !1, this._isJavaScriptEnabled = function() {
        return !0
    }
}, ReaderController.prototype = {
    setOriginalURL: function(e) {
        this.originalURL = e, this.pageURLs.push(e), document.head.getElementsByTagName("base")[0].href = this.originalURL
    },
    setNextPageURL: function(e) {
        if (!e || -1 !== this.pageURLs.indexOf(e) || this.pageNumber + 1 === MaxNumberOfNextPagesToLoad)
            return void this.setLoadingNextPage(!1);
        this.setLoadingNextPage(!0), this.pageURLs.push(e);
        let t = function() {
            nextPageContainer().addEventListener("load", nextPageLoadComplete, !1), nextPageContainer().src = e
        };
        this.readerOperationMode == ReaderOperationMode.OffscreenFetching ? t() : this.nextPageLoadTimer = setTimeout(t, LoadNextPageDelay)
    },
    pauseLoadingNextPage: function() {
        this.readerOperationMode == ReaderOperationMode.Normal && (nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), this.cachedNextPageURL || (this.cachedNextPageURL = this.pageURLs.pop()), nextPageContainer().src = null, this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer), ReaderJSController.didChangeNextPageLoadingState(!1))
    },
    stopLoadingNextPage: function() {
        nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), nextPageContainer().src = null, this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer), this.isLoadingNextPage() && (this.setLoadingNextPage(!1), this.loadingNextPageManuallyStopped = !0)
    },
    isLoadingNextPage: function() {
        return this.loadingNextPage
    },
    setLoadingNextPage: function(e) {
        this.loadingNextPage != e && (e ? addIncomingPagePlaceholder(ReaderJSController.canLoadFromNetwork()) : removeIncomingPagePlaceholder(), this.loadingNextPage = e, ReaderJSController.didChangeNextPageLoadingState(this.loadingNextPage))
    },
    doneLoadingAllPages: function() {
        ReaderJSController.doneLoadingReaderPage()
    },
    loaded: function() {
        if (this.readerOperationMode = ReaderJSController.readerOperationMode(), !ReaderJSController.originalArticleFinder() || this._shouldSkipActivationWhenPageLoads())
            return void ReaderJSController.deactivateNow();
        this.loadArticle(), ReadingPositionStabilizerJS.initialize();
        let e = ReaderJSController.cachedTopScrollOffset();
        if (e > 0)
            document.body.scrollTop = e;
        else {
            let e = document.getElementById("safari-reader-element-marker");
            if (e) {
                let t = parseFloat(e.style.top) / 100,
                    n = e.parentElement,
                    i = n.getBoundingClientRect();
                document.body.scrollTop = window.scrollY + i.top + i.height * t, n.removeChild(e)
            }
        }
        this._clickingOutsideOfPaperRectangleDismissesReader && (document.documentElement.addEventListener("mousedown", monitorMouseDownForPotentialDeactivation), document.documentElement.addEventListener("click", deactivateIfEventIsOutsideOfPaperContainer));
        let t = function() {
            this.setUserVisibleWidth(this.lastKnownUserVisibleWidth)
        }.bind(this);
        window.addEventListener("resize", t, !1);
        let n = this._bestLocale,
            i = function() {
                ReaderJSController.contentIsReadyForDisplay(n)
            };
        this._deferSendingContentIsReadyForDisplay ? setTimeout(i, 0) : i()
    },
    setUserVisibleWidth: function(e) {
        let t = ReaderAppearanceJS.documentElementWidth();
        e === this.lastKnownUserVisibleWidth && t === this.lastKnownDocumentElementWidth || (this.lastKnownUserVisibleWidth = e, this.lastKnownDocumentElementWidth = t, ReaderAppearanceJS.layOutContent())
    },
    loadArticle: function() {
        let e = ReaderJSController.originalArticleFinder();
        if (e.article || e.articleNode(!0), !e.article)
            return this.setOriginalURL(e.contentDocument.baseURI), void this.doneLoadingAllPages();
        this.routeToArticle = e.routeToArticleNode(), this.displayTitleInformation = e.articleTitleInformation(), this.displaySubhead = e.articleSubhead(), this.metadataElement = e.adoptableMetadataBlock(), this.articleIsLTR = e.articleIsLTR();
        let t = e.adoptableArticle(),
            n = t.ownerDocument;
        if (document.title = n.title, this.setOriginalURL(n.baseURI), this.readerOperationMode == ReaderOperationMode.ArchiveViewing)
            return void ReaderAppearanceJS.layOutContent();
        let i;
        if (this._isJavaScriptEnabled())
            i = e.nextPageURL(), this.setNextPageURL(i);
        else {
            for (let e of t.querySelectorAll("iframe"))
                e.remove();
            this.stopLoadingNextPage()
        }
        this.updateLocaleFromElement(t), ReaderAppearanceJS.initialize(), this.createPageFromNode(t), i || (e.adoptableMultiPageContentElements().forEach(this.createPageFromNode, this), updatePageNumbers()), this.isLoadingNextPage() || this.doneLoadingAllPages()
    },
    reloadArticlePreservingScrollPosition: function() {
        this._reloadArticleAndPreserveScrollPosition(!0)
    },
    loadNewArticle: function() {
        this._reloadArticleAndPreserveScrollPosition(!1)
    },
    _reloadArticleAndPreserveScrollPosition: function(e) {
        if (!ReaderJSController.originalArticleFinder())
            return void ReaderJSController.deactivateNow();
        const [t, n] = [scrollX, scrollY];
        let i = document.getElementById("article");
        for (; i.childNodes.length >= 1;)
            i.removeChild(i.firstChild);
        this.reinitialize(), e || (document.body.scrollTop = 0), this.loadArticle(), e && scrollTo(t, n)
    },
    reinitialize: function() {
        this.pageNumber = 1, this.pageURLs = [], this.articleIsLTR = !0, this.loadingNextPage = !1, this.loadingNextPageManuallyStopped = !1, this.routeToArticle = undefined, this.displayTitleInformation = undefined, this.displaySubhead = undefined, this.originalURL = undefined, this.nextPageLoadTimer = undefined, this.readerOperationMode = ReaderJSController.readerOperationMode(), this.cachedNextPageURL = null
    },
    createPageFromNode: function(e) {
        let t = document.createElement("div");
        t.className = "page", this.articleIsLTR || t.classList.add("rtl");
        let n = document.createElement("div");
        n.className = "page-number", t.appendChild(n);
        let i = this.displayTitleInformation,
            a = document.createElement("h1");
        if (a.className = "title", a.textContent = i.titleText, i.linkURL && i.linkIsForExternalPage) {
            let e = document.createElement("a");
            e.href = i.linkURL, i.linkIsTargetBlank && e.setAttribute("target", "_blank"), e.appendChild(a), a = e
        }
        if (t.appendChild(a), this.displaySubhead) {
            let e = document.createElement("h2");
            e.className = "subhead", e.textContent = this.displaySubhead, t.appendChild(e)
        }
        if (this.metadataElement && this.metadataElement.innerText) {
            let e = document.createElement("div");
            for (e.className = "metadata"; this.metadataElement.firstChild;)
                e.appendChild(this.metadataElement.firstChild);
            t.appendChild(e)
        }
        let o = e.tagName;
        if ("PRE" === o || "CODE" === o)
            t.appendChild(e);
        else
            for (; e.firstChild;)
                t.appendChild(e.firstChild);
        document.getElementById("article").insertBefore(t, incomingPagePlaceholder()), ReaderJS._isJavaScriptEnabled() && ReaderJSController.replaceSimpleTweetsWithRichTweets(this.optionsForTweetCreation()), ReaderAppearanceJS.layOutContent(ShouldRestoreReadingPosition.No), updatePageNumbers(), restoreInitialArticleScrollPositionIfPossible();
        for (let e of t.querySelectorAll("img"))
            e.onload = function(e) {
                let t = e.target;
                ReaderAppearanceJS.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(t, ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn()), t.onload = null
            };
        this._fixImageElementsWithinPictureElements()
    },
    optionsForTweetCreation: function() {
        let e = {
                dnt: !0
            },
            t = ReaderAppearanceJS._theme();
        return t && t.tweetTheme && (e.theme = t.tweetTheme), e
    },
    removeAttribute: function(e, t) {
        let n = e.querySelectorAll("[" + t + "]");
        for (let e of n)
            e.removeAttribute(t)
    },
    preparePrintingMailingFrame: function() {
        let e = this.printingMailingFrameElementId(),
            t = document.getElementById(e);
        t && document.body.removeChild(t), t = this.sanitizedFullArticleFrame(), t.id = e
    },
    sanitizedFullArticleFrame: function() {
        let e = document.createElement("iframe");
        e.style.display = "none", e.style.position = "absolute", document.body.appendChild(e);
        let t = e.contentDocument,
            n = document.createElement("base");
        n.href = this.originalURL, t.head.appendChild(n);
        let i = document.createElement("div");
        i.className = "original-url";
        let a = document.createElement("a");
        a.href = this.originalURL, a.textContent = this.originalURL, i.appendChild(document.createElement("br")), i.appendChild(a), i.appendChild(document.createElement("br")), i.appendChild(document.createElement("br")), t.body.appendChild(i), t.body.appendChild(this.sanitizedFullArticle()), t.head.appendChild(document.getElementById("print").cloneNode(!0));
        let o = t.createElement("title");
        return o.innerText = document.title, t.head.appendChild(o), e
    },
    sanitizedFullArticle: function() {
        let e = document.getElementById("article").cloneNode(!0);
        e.removeAttribute("tabindex");
        const t = e.querySelectorAll(".title");
        for (let e = 1, n = t.length; e < n; ++e)
            t[e].remove();
        for (let t of e.querySelectorAll(".page-number, #incoming-page-placeholder"))
            t.remove();
        if (prepareTweetsInPrintingMailingFrame(e), this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing) {
            const t = /^http:\/\/|^https:\/\/|^data:/i;
            let n = e.querySelectorAll("img, video, audio, source");
            for (let e of n) {
                let n = e.getAttribute("src");
                t.test(n) || e.setAttribute("src", e.src)
            }
        }
        for (let t of e.querySelectorAll(".extendsBeyondTextColumn"))
            stopExtendingElementBeyondTextColumn(t);
        for (let t of e.querySelectorAll(".delimeter"))
            t.innerText = "\u2022";
        e.classList.add(ReaderAppearanceJS.currentFontCSSClassName()), e.classList.add("exported");
        let n = document.getElementById("article-content").sheet.cssRules,
            i = n.length;
        for (let t = 0; t < i; ++t) {
            let i = n[t].selectorText,
                a = n[t].style;
            if (a) {
                let t = a.cssText;
                e.matches(i) && e.style && (e.style.cssText += t);
                for (let n of e.querySelectorAll(i))
                    n.style && (n.style.cssText += t)
            }
        }
        return e
    },
    printingMailingFrameElementId: function() {
        return "printing-mailing-frame"
    },
    updateLocaleFromElement: function(e) {
        this._bestLocale = localeForElement(e), document.getElementById("article").style.webkitLocale = "'" + this._bestLocale + "'"
    },
    canLoadNextPage: function() {
        if (this.readerOperationMode != ReaderOperationMode.Normal)
            return !0;
        let e = document.querySelectorAll(".page"),
            t = e[e.length - 1],
            n = t.getBoundingClientRect(),
            i = this._distanceFromBottomOfArticleToStartLoadingNextPage();
        return !!isNaN(i) || !(n.bottom - window.scrollY > i)
    },
    setCachedNextPageURL: function(e) {
        e ? (this.cachedNextPageURL = e, ReaderJSController.didChangeNextPageLoadingState(!1)) : this.setNextPageURL(e)
    },
    loadNextPage: function() {
        null != this.cachedNextPageURL && (this.setNextPageURL(this.cachedNextPageURL), this.cachedNextPageURL = null, ReaderJSController.didChangeNextPageLoadingState(!0))
    },
    resumeCachedNextPageLoadIfNecessary: function() {
        ReaderJS.cachedNextPageURL && ReaderJS.canLoadNextPage() && ReaderJS.loadNextPage()
    },
    readerWillBecomeVisible: function() {
        document.body.classList.remove("cached"), this.resumeCachedNextPageLoadIfNecessary(), this._readerWillBecomeVisible()
    },
    readerWillEnterBackground: function() {
        (ReaderJS.isLoadingNextPage() || ReaderJS.loadingNextPageManuallyStopped) && this.pauseLoadingNextPage();
        for (let e of document.querySelectorAll("audio"))
            e.pause();
        for (let e of document.querySelectorAll("video"))
            e.hasAttribute("data-reader-silent-looped-animation") || e.pause();
        document.body.classList.add("cached"), this._readerWillEnterBackground()
    },
    _fixImageElementsWithinPictureElements: function() {
        requestAnimationFrame(function() {
            let e = !1,
                t = document.querySelectorAll("#article picture img");
            for (let n of t) {
                let t = n.previousElementSibling;
                if (t)
                    n.remove(), t.after(n), e = !0;
                else {
                    let t = n.parentElement;
                    n.remove(), t.appendChild(n), e = !0
                }
            }
            e && ReaderAppearanceJS.layOutContent()
        })
    }
}, ReadingPositionStabilizer = function() {
    this.elementTouchingTopOfViewport = null, this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = 0
}, ReadingPositionStabilizer.prototype = {
    initialize: function() {
        this.setTrackPosition(!0)
    },
    setTrackPosition: function(e) {
        this._positionUpdateFunction || (this._positionUpdateFunction = this._updatePosition.bind(this)), e ? window.addEventListener("scroll", this._positionUpdateFunction, !1) : window.removeEventListener("scroll", this._positionUpdateFunction, !1)
    },
    _updatePosition: function() {
        let e = contentElementTouchingTopOfViewport();
        if (!e)
            return void (this.elementTouchingTopOfViewport = null);
        this.elementTouchingTopOfViewport = e;
        let t = this.elementTouchingTopOfViewport.getBoundingClientRect();
        this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = t.height > 0 ? t.top / t.height : 0
    },
    restorePosition: function() {
        if (this.elementTouchingTopOfViewport) {
            let e = this.elementTouchingTopOfViewport.getBoundingClientRect(),
                t = document.body.scrollTop + e.top - e.height * this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio;
            t > 0 && (document.body.scrollTop = t), this._updatePosition()
        }
    }
};
var ContentAwareScrollerJS = new ContentAwareScroller,
    ReaderAppearanceJS = new ReaderAppearanceController,
    ReadingPositionStabilizerJS = new ReadingPositionStabilizer,
    ReaderJS = new ReaderController;
window.addEventListener("load", function() {
    ReaderJS.loaded()
}, !1);

