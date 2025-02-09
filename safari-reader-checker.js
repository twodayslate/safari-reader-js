/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 *
 * Portions Copyright (c) 2009 Arc90 Inc
 * Readability. An Arc90 Lab Experiment.
 * Website: http://lab.arc90.com/experiments/readability
 * Source:  http://code.google.com/p/arc90labs-readability
 * Readability is licensed under the Apache License, Version 2.0.
 */
function hostnameMatchesHostKnownToContainEmbeddableMedia(e) {
    return /^(.+\.)?(youtube(-nocookie)?\.com|vimeo\.com|dailymotion\.com|soundcloud\.com|mixcloud\.com|embedly\.com|embed\.ly)\.?$/.test(e)
}
function lazyLoadingImageURLForElement(e, t) {
    const n = /(data:image\/)?gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/,
        r = new Set(["data-lazy-src", "data-original", "datasrc", "data-src", "original-src", "rel:bf_image_src", "deferred-src", "data-mediaviewer-src", "data-hi-res-src", "data-native-src"]),
        i = new Set(["original"]);
    var a = e.getAttribute("src"),
        o = /transparent|empty/i.test(a) || n.test(a);
    const l = 2;
    for (var s = e, c = 0; s && c < l; s = s.parentElement, ++c)
        for (var u = attributesForElement(s), m = u.length, d = 0; d < m; ++d) {
            var h = u[d].nodeName;
            if (r.has(h.toLowerCase()))
                return s.getAttribute(h);
            var g = /\.(jpe?g|png|gif|bmp)$/i.test(u[h].value);
            if (i.has(h.toLowerCase()) && g)
                return s.getAttribute(h);
            if (o && /^data.*(src|source)$/i.test(h) && g)
                return s.getAttribute(h)
        }
    if (LazyLoadRegex.test(t) && "function" == typeof URL) {
        var f;
        try {
            f = new URL(e.src)
        } catch (e) {}
        if (f && f.search) {
            var p,
                E;
            const t = ["w", "width"];
            for (var v = t.length, d = 0; d < v; ++d) {
                var N = t[d],
                    S = f.searchParams.get(N);
                if (S && !isNaN(parseInt(S))) {
                    p = N;
                    break
                }
            }
            const n = ["h", "height"];
            for (var C = n.length, d = 0; d < C; ++d) {
                var A = n[d],
                    y = f.searchParams.get(A);
                if (y && !isNaN(parseInt(y))) {
                    E = A;
                    break
                }
            }
            if (p && E) {
                var b = e.getAttribute("width"),
                    T = e.getAttribute("height");
                if (!isNaN(parseInt(b)) && !isNaN(parseInt(T)))
                    return f.searchParams.set(p, b), f.searchParams.set(E, T), f.href
            }
        }
    }
    return null
}
function sanitizeElementByRemovingAttributes(e) {
    const t = /^on|^id$|^class$|^style$|^autofocus$/;
    for (var n = attributesForElement(e), r = 0; r < n.length; ++r) {
        var i = n[r].nodeName;
        t.test(i) && (e.removeAttribute(i), r--)
    }
}
function characterNeedsScoreMultiplier(e) {
    if (!e || 0 === e.length)
        return !1;
    var t = e.charCodeAt(0);
    return t > 11904 && t < 12031 || (t > 12352 && t < 12543 || (t > 12736 && t < 19903 || (t > 19968 && t < 40959 || (t > 44032 && t < 55215 || (t > 63744 && t < 64255 || (t > 65072 && t < 65103 || (t > 131072 && t < 173791 || t > 194560 && t < 195103)))))))
}
function domDistance(e, t, n) {
    for (var r = [], i = e; i;)
        r.unshift(i), i = i.parentNode;
    var a = [];
    for (i = t; i;)
        a.unshift(i), i = i.parentNode;
    for (var o = Math.min(r.length, a.length), l = Math.abs(r.length - a.length), s = o; s >= 0 && r[s] !== a[s]; --s)
        if (l += 2, n && l >= n)
            return n;
    return l
}
function fontSizeFromComputedStyle(e, t) {
    var n = parseInt(e.fontSize);
    return isNaN(n) && (n = t || BaseFontSize), n
}
function contentTextStyleForNode(e, t) {
    function n(e) {
        if (isNodeWhitespace(e))
            return null;
        var t = getComputedStyle(e.parentNode);
        return "none" !== t.float ? null : t
    }
    for (var r = "descendant::text()[not(parent::h1) and not(parent::h2) and not(parent::h3) and not(parent::h4) and not(parent::h5) and not(parent::h6)]", i = e.evaluate(r, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), a = i.snapshotLength, o = 0; o < a; ++o) {
        for (var l = i.snapshotItem(o), s = !1, c = l.parentElement; c !== t; c = c.parentElement)
            if (NegativeRegEx.test(c.className)) {
                s = !0;
                break
            }
        if (!s) {
            var u = n(l);
            if (u)
                return u
        }
    }
    return null
}
function isNodeWhitespace(e) {
    return !(!e || e.nodeType !== Node.TEXT_NODE) && !/\S/.test(e.data)
}
function removeWhitespace(e) {
    return e.replace(/\s+/g, "")
}
function isElementNode(e) {
    return !(!e || e.nodeType !== Node.ELEMENT_NODE)
}
function computedStyleIndicatesElementIsInvisibleDueToClipping(e) {
    if ("absolute" !== e.position)
        return !1;
    var t = e.clip.match(/^rect\((\d+px|auto), (\d+px|auto), (\d+px|auto), (\d+px|auto)\)$/);
    if (!t || 5 !== t.length)
        return !1;
    var n = t.map(function(e) {
            return parseInt(e)
        }),
        r = n[1];
    isNaN(r) && (r = 0);
    var i = n[2],
        a = n[3],
        o = n[4];
    return isNaN(o) && (o = 0), r >= a || i >= o
}
function isElementVisible(e) {
    var t = getComputedStyle(e);
    if ("visible" !== t.visibility || "none" === t.display)
        return !1;
    if (cachedElementBoundingRect(e).height)
        return !0;
    var n = document.createRange();
    return n.selectNode(e), !!n.getBoundingClientRect().height
}
function isElementPositionedOffScreen(e) {
    var t = cachedElementBoundingRect(e);
    return !(!t.height || !t.width) && (t.bottom <= 0 || t.right <= 0)
}
function elementDepth(e) {
    for (var t = 0; e; e = e.parentElement)
        t++;
    return t
}
function depthOfElementWithinElement(e, t) {
    for (var n = 0; e !== t; e = e.parentElement) {
        if (!e)
            return NaN;
        n++
    }
    return n
}
function nearestAncestorElementWithTagName(e, t, n) {
    var r = {};
    if (n)
        for (var i = 0; i < n.length; ++i)
            r[n[i]] = !0;
    if (r[normalizedElementTagName(e)])
        return null;
    for (; e = e.parentElement;) {
        var a = normalizedElementTagName(e);
        if (r[a])
            break;
        if (a === t)
            return e
    }
    return null
}
function cachedElementBoundingRect(e) {
    if (e._cachedElementBoundingRect)
        return e._cachedElementBoundingRect;
    var t = e.getBoundingClientRect();
    return ReaderArticleFinderJS._elementsWithCachedBoundingRects.push(e), ReaderArticleFinderJS._cachedScrollX || ReaderArticleFinderJS._cachedScrollY ? (e._cachedElementBoundingRect = {
        top: t.top + ReaderArticleFinderJS._cachedScrollY,
        right: t.right + ReaderArticleFinderJS._cachedScrollX,
        bottom: t.bottom + ReaderArticleFinderJS._cachedScrollY,
        left: t.left + ReaderArticleFinderJS._cachedScrollX,
        width: t.width,
        height: t.height
    }, e._cachedElementBoundingRect) : (e._cachedElementBoundingRect = t, e._cachedElementBoundingRect)
}
function clearCachedElementBoundingRects() {
    for (var e = ReaderArticleFinderJS._elementsWithCachedBoundingRects, t = e.length, n = 0; n < t; ++n)
        e[n]._cachedElementBoundingRect = null;
    ReaderArticleFinderJS._elementsWithCachedBoundingRects = []
}
function trimmedInnerTextIgnoringTextTransform(e) {
    var t = e.innerText;
    if (!/\S/.test(t))
        return e.textContent.trim();
    var n = getComputedStyle(e),
        r = n.textTransform;
    return "uppercase" === r || "lowercase" === r ? e.textContent.trim() : t ? t.trim() : ""
}
function levenshteinDistance(e, t) {
    for (var n = e.length, r = t.length, i = new Array(n + 1), a = 0; a < n + 1; ++a)
        i[a] = new Array(r + 1), i[a][0] = a;
    for (var o = 0; o < r + 1; ++o)
        i[0][o] = o;
    for (var o = 1; o < r + 1; ++o)
        for (var a = 1; a < n + 1; ++a)
            if (e[a - 1] === t[o - 1])
                i[a][o] = i[a - 1][o - 1];
            else {
                var l = i[a - 1][o] + 1,
                    s = i[a][o - 1] + 1,
                    c = i[a - 1][o - 1] + 1;
                i[a][o] = Math.min(l, s, c)
            }
    return i[n][r]
}
function stringSimilarity(e, t) {
    var n = Math.max(e.length, t.length);
    return n ? (n - levenshteinDistance(e, t)) / n : 0
}
function stringsAreNearlyIdentical(e, t) {
    return e === t || stringSimilarity(e, t) > StringSimilarityToDeclareStringsNearlyIdentical
}
function elementIsCommentBlock(e) {
    if (/(^|\s)comment/.test(e.className))
        return !0;
    var t = e.getAttribute("id");
    return !(!t || 0 !== t.indexOf("comment") && 0 !== t.indexOf("Comment"))
}
function elementLooksLikeEmbeddedTweet(e) {
    var t = null;
    if ("iframe" === normalizedElementTagName(e)) {
        if (!e.contentDocument)
            return !1;
        t = e.contentDocument.documentElement
    } else
        "twitter-widget" === normalizedElementTagName(e) && (t = e.shadowRoot);
    if (!t)
        return !1;
    if (e.closest(".twitter-video") && t.querySelector("[data-tweet-id]"))
        return !0;
    let n = 0,
        r = t.querySelector("blockquote");
    r && TweetURLRegex.test(r.getAttribute("cite")) && ++n;
    let i = t.querySelector("[data-iframe-title]");
    return i && TweetIframeTitleRegex.test(i.getAttribute("data-iframe-title")) && ++n, e.classList.contains("twitter-tweet") && ++n, t.querySelector("[data-tweet-id]") && ++n, n > 2
}
function elementLooksLikePartOfACarousel(e) {
    const t = /carousel-|carousel_|-carousel|_carousel/,
        n = 3;
    for (var r = e, i = 0; i < n; ++i) {
        if (!r)
            return !1;
        if (t.test(r.className) || t.test(r.getAttribute("data-analytics")))
            return !0;
        r = r.parentElement
    }
}
function urlIsHTTPFamilyProtocol(e) {
    let t = e.protocol;
    return "http:" === t || "https:" === t
}
function shouldPruneIframe(e) {
    if (e.srcdoc)
        return !0;
    let t = urlFromString(e.src);
    if (t) {
        if (!urlIsHTTPFamilyProtocol(t))
            return !0;
        if (hostnameMatchesHostKnownToContainEmbeddableMedia(t.hostname))
            return !1
    }
    return !elementLooksLikeEmbeddedTweet(e.originalElement)
}
function languageScoreMultiplierForTextNodes(e) {
    if (!e || !e.length)
        return 1;
    for (var t = Math.min(e.length, DefaultNumberOfTextNodesToCheckForLanguageMultiplier), n = 0, r = 0, i = 0; i < t; i++) {
        for (var a = e[i].nodeValue.trim(), o = Math.min(a.length, NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier), l = 0; l < o; l++)
            characterNeedsScoreMultiplier(a[l]) && n++;
        r += o
    }
    return n >= r * MinimumRatioOfCharactersForLanguageMultiplier ? ScoreMultiplierForChineseJapaneseKorean : 1
}
function scoreMultiplierForElementTagNameAndAttributes(e) {
    for (var t = 1, n = e; n; n = n.parentElement) {
        var r = n.getAttribute("id");
        r && (ArticleRegEx.test(r) && (t += ArticleMatchBonus), CommentRegEx.test(r) && (t -= CommentMatchPenalty), CarouselRegEx.test(r) && (t -= CarouselMatchPenalty));
        var i = n.className;
        i && (ArticleRegEx.test(i) && (t += ArticleMatchBonus), CommentRegEx.test(i) && (t -= CommentMatchPenalty), CarouselRegEx.test(i) && (t -= CarouselMatchPenalty)), "article" === normalizedElementTagName(n) && (t += ArticleMatchBonus)
    }
    return t < 0 ? 0 : t
}
function elementAtPoint(e, t) {
    if ("undefined" != typeof ReaderArticleFinderJSController && ReaderArticleFinderJSController.nodeAtPoint) {
        var n = ReaderArticleFinderJSController.nodeAtPoint(e, t);
        return n && n.nodeType !== Node.ELEMENT_NODE && (n = n.parentElement), n
    }
    return document.elementFromPoint(e, t)
}
function userVisibleURLString(e) {
    return "undefined" != typeof ReaderArticleFinderJSController && ReaderArticleFinderJSController.userVisibleURLString ? ReaderArticleFinderJSController.userVisibleURLString(e) : e
}
function urlStringIsJavaScriptURL(e) {
    return !!e && "javascript:" === e.trim().substring(0, 11).toLowerCase()
}
function urlFromString(e) {
    try {
        return new URL(e)
    } catch (e) {
        return null
    }
}
function anchorLinksToAttachment(e) {
    return /\battachment\b/i.test(e.getAttribute("rel"))
}
function anchorLinksToTagOrCategoryPage(e) {
    return /\bcategory|tag\b/i.test(e.getAttribute("rel"))
}
function anchorLooksLikeDownloadFlashLink(e) {
    return /^https?:\/\/(www\.|get\.)(adobe|macromedia)\.com\/(((products|[a-zA-Z]{1,2}|)\/flashplayer|flashplayer|go\/getflash(player)?)|(shockwave\/download\/(index|download)\.cgi\?P1_Prod_Version=ShockwaveFlash)\/?$)/i.test(e.href)
}
function elementsHaveSameTagAndClassNames(e, t) {
    return normalizedElementTagName(e) === normalizedElementTagName(t) && e.className === t.className
}
function selectorForElement(e) {
    let t = normalizedElementTagName(e);
    for (var n = e.classList, r = n.length, i = 0; i < r; i++)
        t += "." + n[i];
    return t
}
function elementFingerprintForDepth(e, t) {
    function n(e, t) {
        if (!e)
            return "";
        var o = [];
        o.push(selectorForElement(e));
        var l = e.children,
            s = l.length;
        if (s && t > 0) {
            o.push(r);
            for (var c = 0; c < s; ++c)
                o.push(n(l[c], t - 1)), c !== s - 1 && o.push(a);
            o.push(i)
        }
        return o.join("")
    }
    const r = " / ",
        i = " \\",
        a = " | ";
    return n(e, t)
}
function childrenOfParentElement(e) {
    var t = e.parentElement;
    return t ? t.children : []
}
function arrayOfKeysAndValuesOfObjectSortedByValueDescending(e) {
    var t = [];
    for (var n in e)
        e.hasOwnProperty(n) && t.push({
            key: n,
            value: e[n]
        });
    return t.sort(function(e, t) {
        return t.value - e.value
    }), t
}
function walkElementSubtree(e, t, n) {
    if (!(t < 0)) {
        for (var r = e.children, i = r.length, a = t - 1, o = 0; o < i; ++o)
            walkElementSubtree(r[o], a, n);
        n(e, t)
    }
}
function elementIndicatesItIsASchemaDotOrgArticleContainer(e) {
    var t = e.getAttribute("itemtype");
    return /^https?:\/\/schema\.org\/((News)?Article|APIReference)$/.test(t)
}
function elementIndicatesItIsASchemaDotOrgImageObject(e) {
    var t = e.getAttribute("itemtype");
    return "https://schema.org/ImageObject" === t || "http://schema.org/ImageObject" === t
}
function elementWouldAppearBetterAsFigureOrAuxiliary(e, t) {
    const n = /caption/i;
    if (!e)
        return !1;
    if (t.closest("figure, .auxiliary"))
        return !1;
    if (elementIndicatesItIsASchemaDotOrgImageObject(e) && !t.querySelector("figure, .auxiliary"))
        return !0;
    var r = t.ownerDocument,
        i = r.createTreeWalker(t, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
            acceptNode: function() {
                return NodeFilter.FILTER_ACCEPT
            }
        });
    i.currentNode = t;
    for (var a = !1, o = !1; i.nextNode();) {
        var l = i.currentNode;
        if (l.nodeType !== Node.TEXT_NODE) {
            if (l.nodeType !== Node.ELEMENT_NODE)
                return !1;
            let e = normalizedElementTagName(l);
            if ("figure" === e || "table" === e)
                return !1;
            if (l.classList.contains("auxiliary"))
                return !1;
            if ("img" === e) {
                if (a)
                    return !1;
                a = !0
            }
            var s = l.originalElement;
            o || s && !hasClassMatchingRegexp(l.originalElement, n) || !/\S/.test(l.innerText) || (o = !0)
        } else if (!a && /\S/.test(l.nodeValue))
            return !1
    }
    return a && o
}
function cleanStyleAndClassList(e) {
    e.classList.length || e.removeAttribute("class"), e.getAttribute("style") || e.removeAttribute("style")
}
function getVisibleNonWhitespaceTextNodes(e, t, n, r, i) {
    function a(e) {
        var t = e.children[0];
        if (t)
            for (var n = t.children, r = n.length, i = 0; i < r; ++i)
                if ("none" !== getComputedStyle(n[i]).float)
                    return !1;
        return !0
    }
    function o(e, r) {
        if (e.nodeType === Node.TEXT_NODE)
            return void (/\S/.test(e.nodeValue) && s.push(e));
        if (e.nodeType === Node.ELEMENT_NODE && isElementVisible(e) && !(n && ++l > n || i && i.has(e))) {
            let n = normalizedElementTagName(e);
            if ("iframe" !== n && "form" !== n) {
                if (c.has(n))
                    r--;
                else if ("ul" !== n && "ol" !== n || !a(e)) {
                    var u = e.parentElement;
                    if (u) {
                        var m = normalizedElementTagName(u);
                        "section" !== m || e.previousElementSibling || e.nextElementSibling || r--
                    }
                } else
                    r--;
                var d = r + 1;
                if (d < t)
                    for (var h = e.childNodes, g = h.length, f = 0; f < g; ++f)
                        o(h[f], d)
            }
        }
    }
    var l = 0,
        s = [];
    let c = new Set(["p", "strong", "b", "em", "i", "span", "section"]);
    return r && (c.add("center"), c.add("font")), o(e, 0), s
}
function mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(e, t) {
    const n = 100;
    for (var r = {}, i = getVisibleNonWhitespaceTextNodes(e, n), a = i.length, o = 0; o < a; ++o) {
        var l = i[o],
            s = l.length,
            c = l.parentElement,
            u = getComputedStyle(c),
            m = t(u);
        r[m] ? r[m] += s : r[m] = s
    }
    return r
}
function keyOfMaximumValueInDictionary(e) {
    var t,
        n;
    for (var r in e) {
        var i = e[r];
        (!n || i > n) && (t = r, n = i)
    }
    return t
}
function elementIsProtected(e) {
    return e.classList.contains("protected") || e.querySelector(".protected")
}
function dominantFontFamilyAndSizeForElement(e) {
    return keyOfMaximumValueInDictionary(mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(e, function(e) {
        return e.fontFamily + "|" + e.fontSize
    }))
}
function dominantFontSizeInPointsFromFontFamilyAndSizeString(e) {
    return e ? parseInt(e.split("|")[1]) : null
}
function canvasElementHasNoUserVisibleContent(e) {
    if (!e.width || !e.height)
        return !0;
    for (var t = e.getContext("2d"), n = t.getImageData(0, 0, e.width, e.height).data, r = 0, i = n.length; r < i; r += 4) {
        if (n[r + 3])
            return !1
    }
    return !0
}
function findArticleNodeSelectorsInWhitelistForHostname(e, t) {
    const n = [[AppleDotComAndSubdomainsRegex, "*[itemprop='articleBody']"], [/^(.+\.)?buzzfeed\.com\.?$/, "article #buzz_sub_buzz"], [/^(.+\.)?mashable\.com\.?$/, ".parsec-body .parsec-container"], [/^(.+\.)?cnet\.com\.?$/, "#rbContent.container"], [/^(.+\.)?engadget\.com\.?$/, "main article #page_body"], [/^(.*\.)?m\.wikipedia\.org\.?$/, "#content #bodyContent"], [/^(.*\.)?theintercept\.com\.?$/, ".PostContent"], [/^(.*\.)?tools\.ietf\.org\.?$/, "div.content"]];
    for (var r = n.length, i = 0; i < r; ++i) {
        var a = n[i];
        if (a[0].test(e.toLowerCase())) {
            if (t(a[1]))
                return
        }
    }
}
function functionToPreventPruningDueToInvisibilityInWhitelistForHostname(e) {
    const t = [[/^mobile\.nytimes\.com\.?$/, function(e, t) {
        var n = e;
        if (!t)
            return !1;
        for (; n && n !== t;) {
            if (n.classList.contains("hidden"))
                return !0;
            n = n.parentElement
        }
        return !1
    }]];
    for (var n = t.length, r = 0; r < n; ++r) {
        var i = t[r];
        if (i[0].test(e.toLowerCase()))
            return i[1]
    }
    return null
}
function elementIsAHeader(e) {
    return !!{
        h1: 1,
        h2: 1,
        h3: 1,
        h4: 1,
        h5: 1,
        h6: 1
    }[normalizedElementTagName(e)]
}
function leafElementForElementAndDirection(e, t) {
    var n = e.ownerDocument,
        r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function(e) {
                return 0 === e.children.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            }
        });
    return r.currentNode = e, r[t]()
}
function previousLeafElementForElement(e) {
    return leafElementForElementAndDirection(e, "previousNode")
}
function nextLeafElementForElement(e) {
    return leafElementForElementAndDirection(e, "nextNode")
}
function nextNonFloatingVisibleElementSibling(e) {
    for (var t = e; t = t.nextElementSibling;)
        if (isElementVisible(t) && "none" === getComputedStyle(t).float)
            return t;
    return null
}
function elementWithLargestAreaFromElements(e) {
    var t = e.length;
    if (!t)
        return null;
    for (var n, r = 0, i = 0; i < t; ++i) {
        var a = e[i],
            o = cachedElementBoundingRect(a),
            l = o.width * o.height;
        l > r && (n = a, r = l)
    }
    return n
}
function unwrappedArticleContentElement(e) {
    for (var t = e;;) {
        for (var n = t.childNodes, r = n.length, i = null, a = 0; a < r; ++a) {
            var o = n[a],
                l = o.nodeType;
            if (function() {
                return l === Node.ELEMENT_NODE || l === Node.TEXT_NODE && !isNodeWhitespace(o)
            }()) {
                if (i)
                    return t;
                var s = normalizedElementTagName(o);
                if ("div" !== s && "article" !== s && "section" !== s)
                    return t;
                i = o
            }
        }
        if (!i)
            break;
        t = i
    }
    return t
}
function elementsMatchingClassesInClassList(e, t) {
    return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t)
}
function elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(e, t) {
    return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, /clearfix/i)
}
function elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(e, t) {
    return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, /\d+$/)
}
function elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, n) {
    for (var r = "", i = e.length, a = 0; a < i; ++a) {
        var o = e[a];
        n && n.test(o) || (r += "." + o)
    }
    try {
        return t.querySelectorAll(r)
    } catch (e) {
        return []
    }
}
function imageIsContainedByContainerWithImageAsBackgroundImage(e) {
    var t = e.parentElement;
    if (!t || !t.style || !t.style.backgroundImage)
        return !1;
    var n = /url\((.*)\)/.exec(t.style.backgroundImage);
    return !(!n || 2 !== n.length) && n[1] === e.src
}
function pseudoElementContent(e, t) {
    var n = getComputedStyle(e, t).content,
        r = /^\"(.*)\"$/.exec(n);
    return r && 2 == r.length ? r[1] : n
}
function hasClassMatchingRegexp(e, t) {
    for (var n = e.classList, r = n.length, i = 0; i < r; ++i)
        if (t.test(n[i]))
            return !0;
    return !1
}
function elementLooksLikeDropCap(e) {
    return hasClassMatchingRegexp(e, DropCapRegex) && 1 === e.innerText.length
}
function changeElementType(e, t) {
    for (var n = e.ownerDocument.createElement(t), r = attributesForElement(e), i = r.length, a = 0; a < i; ++a) {
        var o = r.item(a);
        n.setAttribute(o.nodeName, o.nodeValue)
    }
    for (; e.firstChild;)
        n.appendChild(e.firstChild);
    return e.replaceWith(n), n
}
function pathComponentsForAnchor(e) {
    var t = e.pathname.substring(1).split("/");
    return t[t.length - 1] || t.pop(), t
}
function lastPathComponentFromAnchor(e) {
    var t = pathComponentsForAnchor(e);
    return t.length ? t[t.length - 1] : null
}
function clamp(e, t, n) {
    return Math.min(Math.max(e, t), n)
}
function normalizedElementTagName(e) {
    return e.localName
}
function childrenWithParallelStructure(e) {
    var t = e.children;
    if (!t)
        return [];
    var n = t.length;
    if (!n)
        return [];
    for (var r = {}, i = 0; i < n; ++i) {
        var a = t[i];
        if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(a)) && a.className)
            for (var o = a.classList, l = o.length, s = 0; s < l; ++s) {
                var c = o[s],
                    u = r[c];
                u ? u.push(a) : r[c] = [a]
            }
    }
    var m = Math.floor(n / 2);
    for (var c in r) {
        var u = r[c];
        if (u.length > m)
            return u
    }
    return []
}
function elementAppearsToBeCollapsed(e) {
    return !(!ReaderArticleFinderJS.isMediaWikiPage() || !/collaps/.test(e.className)) || "false" === e.getAttribute("aria-expanded") && !isElementVisible(e)
}
const ReaderMinimumScore = 1600,
    ReaderMinimumAdvantage = 15,
    ArticleMinimumScoreDensity = 4.25,
    CandidateMinimumWidthPortionForIndicatorElements = .5,
    CandidateMinumumListItemLineCount = 4,
    SetOfCandidateTagNamesToIgnore = new Set(["a", "embed", "form", "html", "iframe", "object", "ol", "option", "script", "style", "svg", "ul"]),
    PrependedArticleCandidateMinimumHeight = 50,
    AppendedArticleCandidateMinimumHeight = 200,
    AppendedArticleCandidateMaximumVerticalDistanceFromArticle = 150,
    StylisticClassNames = {
        justfy: 1,
        justify: 1,
        left: 1,
        right: 1,
        small: 1
    },
    CommentRegEx = /[Cc]omment|meta|footer|footnote|talkback/,
    CommentMatchPenalty = .75,
    ArticleRegEx = /(?:(?:^|\s)(?:(post|hentry|entry)[-_]?(?:content|text|body)?|article[-_]?(?:content|text|body|page|copy)?)(?:\s|$))/i,
    ArticleMatchBonus = .5,
    CarouselRegEx = /carousel/i,
    CarouselMatchPenalty = .75,
    SectionRegex = /section|content.*component/i,
    DropCapRegex = /first.*letter|drop.*cap/i,
    ProgressiveLoadingRegex = /progressive/i,
    DensityExcludedElementSelector = "#disqus_thread, #comments, .userComments",
    PositiveRegEx = /article|body|content|entry|hentry|page|pagination|post|related-asset|text/i,
    NegativeRegEx = /advertisement|breadcrumb|combx|comment|contact|disqus|footer|link|meta|mod-conversations|promo|related|scroll|share|shoutbox|sidebar|social|sponsor|spotim|subscribe|talkback|tags|toolbox|widget|[-_]ad$|zoom-(in|out)/i,
    VeryPositiveClassNameRegEx = /instapaper_body/,
    VeryNegativeClassNameRegEx = /instapaper_ignore/,
    SharingRegex = /email|print|rss|digg|slashdot|delicious|reddit|share|twitter|facebook|pinterest|whatsapp/i,
    VeryLiberalCommentRegex = /comment/i,
    AdvertisementHostRegex = /^adserver\.|doubleclick.net$/i,
    SidebarRegex = /sidebar/i,
    MinimumAverageDistanceBetweenHRElements = 400,
    MinimumAverageDistanceBetweenHeaderElements = 400,
    PortionOfCandidateHeightToIgnoreForHeaderCheck = .1,
    DefaultNumberOfTextNodesToCheckForLanguageMultiplier = 3,
    NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier = 12,
    MinimumRatioOfCharactersForLanguageMultiplier = .5,
    ScoreMultiplierForChineseJapaneseKorean = 3,
    MinimumContentMediaHeight = 150,
    MinimumContentMediaWidthToArticleWidthRatio = .25,
    MaximumContentMediaAreaToArticleAreaRatio = .2,
    LinkContinueMatchRegEx = /continue/gi,
    LinkNextMatchRegEx = /next/gi,
    LinkPageMatchRegEx = /page/gi,
    LinkListItemBonus = 5,
    LinkPageMatchBonus = 10,
    LinkNextMatchBonus = 15,
    LinkContinueMatchBonus = 15,
    LinkNextOrdinalValueBase = 3,
    LinkMismatchValueBase = 2,
    LinkMatchWeight = 200,
    LinkMaxVerticalDistanceFromArticle = 200,
    LinkVerticalDistanceFromArticleWeight = 150,
    LinkCandidateXPathQuery = "descendant-or-self::*[(not(@id) or (@id!='disqus_thread' and @id!='comments')) and (not(@class) or @class!='userComments')]/a",
    LinkDateRegex = /\D(?:\d\d(?:\d\d)?[\-\/](?:10|11|12|0?[1-9])[\-\/](?:30|31|[12][0-9]|0?[1-9])|\d\d(?:\d\d)?\/(?:10|11|12|0[1-9])|(?:10|11|12|0?[1-9])\-(?:30|31|[12][0-9]|0?[1-9])\-\d\d(?:\d\d)?|(?:30|31|[12][0-9]|0?[1-9])\-(?:10|11|12|0?[1-9])\-\d\d(?:\d\d)?)\D/,
    LinkURLSearchParameterKeyMatchRegex = /(page|^p$|^pg$)/i,
    LinkURLPageSlashNumberMatchRegex = /\/.*page.*\/\d+/i,
    LinkURLSlashDigitEndMatchRegex = /\/\d+\/?$/,
    LinkURLArchiveSlashDigitEndMatchRegex = /archives?\/\d+\/?$/,
    LinkURLBadSearchParameterKeyMatchRegex = /author|comment|feed|id|nonce|related/i,
    LinkURLSemanticMatchBonus = 100,
    LinkMinimumURLSimilarityRatio = .75,
    HeaderMinimumDistanceFromArticleTop = 200,
    HeaderLevenshteinDistanceToLengthRatio = .75,
    MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList = .5,
    FloatMinimumHeight = 130,
    ImageSizeTiny = 32,
    ToleranceForLeadingMediaWidthToArticleWidthForFullWidthPresentation = 80,
    MaximumFloatWidth = 325,
    AnchorImageMinimumWidth = 100,
    AnchorImageMinimumHeight = 100,
    MinimumHeightForImagesAboveTheArticleTitle = 50,
    MainImageMinimumWidthAndHeight = 83,
    BaseFontSize = 16,
    BaseLineHeightRatio = 1.125,
    MaximumExactIntegralValue = 9007199254740992,
    TitleCandidateDepthScoreMultiplier = .1,
    TextNodeLengthPower = 1.25,
    LazyLoadRegex = /lazy/i,
    HeaderElementsSelector = "h1, h2, h3, h4, h5, h6",
    PageType = {
        homepage: "homepage",
        searchResults: "search-results",
        article: "article"
    },
    StringSimilarityToDeclareStringsNearlyIdentical = .97,
    FindArticleMode = {
        Element: !1,
        ExistenceOfElement: !0
    },
    AppleDotComAndSubdomainsRegex = /.*\.apple\.com\.?$/,
    SchemaDotOrgArticleContainerSelector = "*[itemtype='https://schema.org/Article'], *[itemtype='https://schema.org/NewsArticle'], *[itemtype='https://schema.org/APIReference'], *[itemtype='http://schema.org/Article'], *[itemtype='http://schema.org/NewsArticle'], *[itemtype='http://schema.org/APIReference']",
    CleaningType = {
        MainArticleContent: 0,
        MetadataContent: 1,
        LeadingMedia: 2
    },
    MaximumWidthOrHeightOfImageInMetadataSection = 20;
var attributesForElement = function() {
    var e = Element.prototype.__lookupGetter__("attributes");
    return function(t) {
        return e.call(t)
    }
}();
const TweetURLRegex = /^https?:\/\/(.+\.)?twitter\.com\/.*\/status\/(.*\/)*[0-9]+\/?$/i,
    TweetIframeTitleRegex = /tweet/i;
CandidateElement = function(e, t) {
    this.element = e, this.contentDocument = t, this.textNodes = this.usableTextNodesInElement(this.element), this.rawScore = this.calculateRawScore(), this.tagNameAndAttributesScoreMultiplier = this.calculateElementTagNameAndAttributesScoreMultiplier(), this.languageScoreMultiplier = 0, this.depthInDocument = 0
}, CandidateElement.extraArticleCandidateIfElementIsViable = function(e, t, n, r) {
    const i = "a, b, strong, i, em, u, span";
    var a = cachedElementBoundingRect(e),
        o = cachedElementBoundingRect(t.element);
    if ((r && a.height < PrependedArticleCandidateMinimumHeight || !r && a.height < AppendedArticleCandidateMinimumHeight) && e.childElementCount && e.querySelectorAll("*").length !== e.querySelectorAll(i).length)
        return null;
    if (r) {
        if (a.bottom > o.top)
            return null
    } else if (a.top < o.bottom)
        return null;
    if (!r) {
        if (a.top - o.bottom > AppendedArticleCandidateMaximumVerticalDistanceFromArticle)
            return null
    }
    if (a.left > o.right || a.right < o.left)
        return null;
    if (elementLooksLikePartOfACarousel(e))
        return null;
    var l = new CandidateElement(e, n);
    return l.isPrepended = r, l
}, CandidateElement.candidateIfElementIsViable = function(e, t, n) {
    var r = cachedElementBoundingRect(e),
        i = ReaderArticleFinderJS.candidateElementFilter;
    return r.width < i.minimumWidth || r.height < i.minimumHeight ? null : r.width * r.height < i.minimumArea ? null : !n && r.top > i.maximumTop ? null : CandidateElement.candidateElementAdjustedHeight(e) < i.minimumHeight ? null : new CandidateElement(e, t)
}, CandidateElement.candidateElementAdjustedHeight = function(e) {
    for (var t = cachedElementBoundingRect(e), n = t.height, r = e.getElementsByTagName("form"), i = r.length, a = 0; a < i; ++a) {
        var o = r[a],
            l = cachedElementBoundingRect(o);
        l.width > t.width * CandidateMinimumWidthPortionForIndicatorElements && (n -= l.height)
    }
    for (var s = e.querySelectorAll("ol, ul"), c = s.length, u = null, a = 0; a < c; ++a) {
        var m = s[a];
        if (!(u && u.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
            var d = m.getElementsByTagName("li"),
                h = d.length,
                g = cachedElementBoundingRect(m);
            if (h) {
                var f = g.height / h,
                    p = getComputedStyle(d[0]),
                    E = parseInt(p.lineHeight);
                if (isNaN(E)) {
                    E = fontSizeFromComputedStyle(p) * BaseLineHeightRatio
                }
                g.width > t.width * CandidateMinimumWidthPortionForIndicatorElements && f / E < CandidateMinumumListItemLineCount && (n -= g.height, u = m)
            } else
                n -= g.height
        }
    }
    return n
}, CandidateElement.prototype = {
    calculateRawScore: function() {
        for (var e = 0, t = this.textNodes, n = t.length, r = 0; r < n; ++r)
            e += this.rawScoreForTextNode(t[r]);
        return e
    },
    calculateElementTagNameAndAttributesScoreMultiplier: function() {
        return scoreMultiplierForElementTagNameAndAttributes(this.element)
    },
    calculateLanguageScoreMultiplier: function() {
        0 === this.languageScoreMultiplier && (this.languageScoreMultiplier = languageScoreMultiplierForTextNodes(this.textNodes))
    },
    depth: function() {
        return this.depthInDocument || (this.depthInDocument = elementDepth(this.element)), this.depthInDocument
    },
    finalScore: function() {
        return this.calculateLanguageScoreMultiplier(), this.basicScore() * this.languageScoreMultiplier
    },
    basicScore: function() {
        return this.rawScore * this.tagNameAndAttributesScoreMultiplier
    },
    scoreDensity: function() {
        var e = 0,
            t = this.element.querySelector(DensityExcludedElementSelector);
        t && (e = t.clientWidth * t.clientHeight);
        for (var n = this.element.children || [], r = n.length, i = 0; i < r; ++i) {
            var a = n[i];
            elementIsCommentBlock(a) && (e += a.clientWidth * a.clientHeight)
        }
        for (var o = cachedElementBoundingRect(this.element).width * cachedElementBoundingRect(this.element).height, l = o * MaximumContentMediaAreaToArticleAreaRatio, s = cachedElementBoundingRect(this.element).width * MinimumContentMediaWidthToArticleWidthRatio, c = this.element.querySelectorAll("img, object, video"), u = c.length, i = 0; i < u; ++i) {
            var m = cachedElementBoundingRect(c[i]);
            if (m.width >= s && m.height > MinimumContentMediaHeight) {
                var d = m.width * m.height;
                d < l && (e += d)
            }
        }
        for (var h = this.basicScore(), g = o - e, f = this.textNodes.length, p = 0, E = 0, i = 0; i < f; ++i) {
            var v = this.textNodes[i].parentNode;
            v && (E += fontSizeFromComputedStyle(getComputedStyle(v)), p++)
        }
        var N = BaseFontSize;
        return p && (N = E /= p), this.calculateLanguageScoreMultiplier(), h / g * 1e3 * (N / BaseFontSize) * this.languageScoreMultiplier
    },
    usableTextNodesInElement: function(e) {
        var t = [];
        if (!e)
            return t;
        const n = new Set(["a", "dd", "dt", "noscript", "ol", "option", "pre", "script", "style", "td", "ul", "iframe"]);
        var r = this.contentDocument,
            i = function(e) {
                const i = "text()|*/text()|*/a/text()|*/li/text()|*/li/p/text()|*/span/text()|*/em/text()|*/i/text()|*/strong/text()|*/b/text()|*/font/text()|blockquote/*/text()|div[count(./p)=count(./*)]/p/text()|div[count(*)=1]/div/p/text()|div[count(*)=1]/div/p/*/text()|div/div/text()";
                for (var a = r.evaluate(i, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), o = a.snapshotLength, l = 0; l < o; ++l) {
                    var s = a.snapshotItem(l);
                    n.has(normalizedElementTagName(s.parentNode)) || s._countedTextNode || isNodeWhitespace(s) || (s._countedTextNode = !0, t.push(s))
                }
            };
        i(e);
        for (var a = childrenWithParallelStructure(e), o = a.length, l = 0; l < o; ++l) {
            i(a[l])
        }
        for (var s = t.length, l = 0; l < s; ++l)
            delete t[l]._countedTextNode;
        return t
    },
    addTextNodesFromCandidateElement: function(e) {
        for (var t = this.textNodes.length, n = 0; n < t; ++n)
            this.textNodes[n].alreadyCounted = !0;
        for (var r = e.textNodes, i = r.length, n = 0; n < i; ++n)
            r[n].alreadyCounted || this.textNodes.push(r[n]);
        for (var t = this.textNodes.length, n = 0; n < t; ++n)
            this.textNodes[n].alreadyCounted = null;
        this.rawScore = this.calculateRawScore()
    },
    rawScoreForTextNode: function(e) {
        const t = 20;
        if (!e)
            return 0;
        var n = e.length;
        if (n < t)
            return 0;
        var r = e.parentNode;
        if (!isElementVisible(r))
            return 0;
        for (var i = 1; r && r !== this.element;)
            i -= .1, r = r.parentNode;
        return Math.pow(n * i, TextNodeLengthPower)
    },
    shouldDisqualifyDueToScoreDensity: function() {
        return this.scoreDensity() < ArticleMinimumScoreDensity
    },
    shouldDisqualifyDueToHorizontalRuleDensity: function() {
        for (var e = this.element.getElementsByTagName("hr"), t = e.length, n = 0, r = cachedElementBoundingRect(this.element), i = .7 * r.width, a = 0; a < t; ++a)
            e[a].clientWidth > i && n++;
        if (n) {
            if (r.height / n < MinimumAverageDistanceBetweenHRElements)
                return !0
        }
        return !1
    },
    shouldDisqualifyDueToHeaderDensity: function() {
        var e = "(h1|h2|h3|h4|h5|h6|*/h1|*/h2|*/h3|*/h4|*/h5|*/h6)[a[@href]]",
            t = this.contentDocument.evaluate(e, this.element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
            n = t.snapshotLength;
        if (n > 2) {
            for (var r = 0, i = cachedElementBoundingRect(this.element), a = i.height * PortionOfCandidateHeightToIgnoreForHeaderCheck, o = 0; o < n; ++o) {
                var l = t.snapshotItem(o);
                if ("#" !== l.querySelector("a").getAttribute("href").substring(0, 1)) {
                    var s = cachedElementBoundingRect(l);
                    s.top - i.top > a && i.bottom - s.bottom > a && r++
                }
            }
            if (i.height / r < MinimumAverageDistanceBetweenHeaderElements)
                return !0
        }
        return !1
    },
    shouldDisqualifyDueToSimilarElements: function(e) {
        function t(e, t) {
            if (!e || !t)
                return !1;
            var n = 1;
            return e.className ? e.className === t.className : elementFingerprintForDepth(e, n) === elementFingerprintForDepth(t, n)
        }
        var n = function(e) {
                const t = /related-posts/i;
                for (var n = e.parentElement; n && n !== this.contentDocument.body; n = n.parentElement)
                    if (t.test(n.className))
                        return !0;
                return !1
            }.bind(this),
            r = this.element;
        if ("article" === normalizedElementTagName(r.parentElement))
            return !1;
        let i = normalizedElementTagName(r);
        if ("li" === i || "dd" === i)
            for (var a = r.parentNode, o = a.children.length, l = 0; l < o; ++l) {
                var s = a.children[l];
                if (normalizedElementTagName(s) === i && s.className === r.className && s !== r)
                    return !0
            }
        var c = r.classList;
        if (c.length || (r = r.parentElement) && (c = r.classList, c.length || (r = r.parentElement) && (c = r.classList)), c.length) {
            e || (e = []);
            for (var u = e.length, l = 0; l < u; ++l)
                e[l].element.candidateElement = e[l];
            for (var m = elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(c, this.contentDocument), d = !1, h = elementDepth(r), g = n(r), f = m.length, l = 0; l < f; ++l) {
                var s = m[l];
                if (s !== r && (s.parentElement !== r && r.parentElement !== s && isElementVisible(s))) {
                    var p = s.candidateElement;
                    if ((p || (p = new CandidateElement(s, this.contentDocument))) && p.basicScore() * ReaderMinimumAdvantage > this.basicScore()) {
                        if (s.closest("section") && r.closest("section"))
                            return !1;
                        if (SectionRegex.test(s.className) && SectionRegex.test(r.className))
                            return !1;
                        if (n(s) && !g)
                            return !1;
                        if (!d && cachedElementBoundingRect(s).bottom < cachedElementBoundingRect(this.element).top) {
                            d = !0;
                            continue
                        }
                        if (t(r.previousElementSibling, s.previousElementSibling) || t(r.nextElementSibling, s.nextElementSibling)) {
                            var E = r.querySelector(HeaderElementsSelector),
                                v = s.querySelector(HeaderElementsSelector);
                            if (E && v && elementsHaveSameTagAndClassNames(E, v))
                                return !0;
                            if (E = r.previousElementSibling, v = s.previousElementSibling, E && v && elementIsAHeader(E) && elementIsAHeader(v) && elementsHaveSameTagAndClassNames(E, v))
                                return !0
                        }
                        if (elementDepth(s) === h)
                            for (; s.parentElement && r.parentElement && s.parentElement !== r.parentElement;)
                                s = s.parentElement, r = r.parentElement;
                        for (; r.childElementCount <= 1;) {
                            if (!r.childElementCount || !s.childElementCount)
                                return !1;
                            if (s.childElementCount > 1)
                                return !1;
                            if (normalizedElementTagName(r.firstElementChild) !== normalizedElementTagName(s.firstElementChild))
                                return !1;
                            r = r.firstElementChild, s = s.firstElementChild
                        }
                        if (s.childElementCount <= 1)
                            return !1;
                        var v = s.firstElementChild,
                            N = s.lastElementChild,
                            E = r.firstElementChild,
                            S = r.lastElementChild;
                        if (normalizedElementTagName(v) !== normalizedElementTagName(E))
                            return !1;
                        if (normalizedElementTagName(N) !== normalizedElementTagName(S))
                            return !1;
                        var C = v.className,
                            A = N.className,
                            y = E.className,
                            b = N.className,
                            T = b === y ? 2 : 1;
                        if (C.length || y.length) {
                            if (!C.length || !y.length)
                                return !1;
                            if (C === y && elementsMatchingClassesInClassList(E.classList, r).length <= T)
                                return !0
                        }
                        if (A.length || b.length) {
                            if (!A.length || !b.length)
                                return !1;
                            if (A === b && elementsMatchingClassesInClassList(N.classList, r).length <= T)
                                return !0
                        }
                        var x = E.clientHeight,
                            R = S.clientHeight;
                        return !(!x || !v.clientHeight) && (!(!R || !N.clientHeight) && (x === v.clientHeight || R === N.clientHeight))
                    }
                }
            }
            for (var l = 0; l < u; ++l)
                e[l].element.candidateElement = null
        }
        return !1
    },
    shouldDisqualifyForDeepLinking: function() {
        const e = 5;
        for (var t = this.element, n = this.contentDocument.location, r = pathComponentsForAnchor(n), i = r.length, a = [], o = t.getElementsByTagName("a"), l = o.length, s = 0; s < l; s++) {
            var c = o[s];
            if (n.host === c.host && !(pathComponentsForAnchor(c).length <= i || 0 !== (c.host + c.pathname).indexOf(n.host + n.pathname) || anchorLinksToAttachment(c) || (a.push(c), a.length < e))) {
                var u = t.offsetTop + t.offsetHeight / e;
                return a[0].offsetTop < u
            }
        }
        return !1
    }
}, String.prototype.lastInteger = function() {
    const e = /[0-9]+/g;
    var t = this.match(e);
    return t ? parseInt(t[t.length - 1]) : NaN
};
ReaderArticleFinder = function(e) {
    this.contentDocument = e, this.didSearchForArticleNode = !1, this.article = null, this.didSearchForExtraArticleNode = !1, this.extraArticle = null, this._leadingMediaElement = null, this._isMediaWikiPage = undefined, this._cachedScrollY = 0, this._cachedScrollX = 0, this._elementsWithCachedBoundingRects = [], this._cachedContentTextStyle = null, this.pageNumber = 1, this.prefixWithDateForNextPageURL = null, this.previouslyDiscoveredPageURLStrings = [], this.candidateElementFilter = {
        minimumWidth: 280,
        minimumHeight: 295,
        minimumArea: 17e4,
        maxTop: 1300
    }
}, ReaderArticleFinder.prototype = {
    setCandidateElementFilter: function(e) {
        let [t, n] = this._validityAndValidCandidateElementFilterFromFilter(e);
        t && (this.candidateElementFilter = n)
    },
    _validityAndValidCandidateElementFilterFromFilter: function(e) {
        let t = {},
            n = !1;
        for (let i of ["minimumWidth", "minimumHeight", "minimumArea", "maxTop"]) {
            let r = (e || {})[i];
            if (r === undefined || "number" != typeof r || r < 0) {
                t = {}, n = !1;
                break
            }
            t[i] = r, n = !0
        }
        return [n, t]
    },
    isReaderModeAvailable: function() {
        return !!this.findArticleBySearchingWhitelist() || (this.cacheWindowScrollPosition(), !!this.findArticleFromMetadata(FindArticleMode.ExistenceOfElement) || (this.article = this.findArticleByVisualExamination(), this.article && this.articleIsLTR(), !!this.article))
    },
    reloadArticleContent: function() {
        this.didSearchForArticleNode = !1, this.didSearchForExtraArticleNode = !1, delete this.article, delete this.extraArticle, delete this._articleTitleInformation, delete this._leadingMediaElement, delete this._cachedContentTextStyle, delete this._adoptableArticle, delete this._articleIsLTR, delete this._nextPageURL, this._isMediaWikiPage = undefined, this.prepareToTransitionToReader()
    },
    prepareToTransitionToReader: function() {
        this.adoptableArticle(!0), this.nextPageURL(), this.articleIsLTR()
    },
    nextPageURL: function() {
        if (!this._nextPageURL) {
            var e = this.nextPageURLString();
            "undefined" != typeof ReaderArticleFinderJSController && e && (e = ReaderArticleFinderJSController.substituteURLForNextPageURL(e)), this._nextPageURL = e
        }
        return this._nextPageURL
    },
    containerElementsForMultiPageContent: function() {
        const e = /(.*page[^0-9]*|.*article.*item[^0-9]*)(\d{1,2})(.*)/i;
        for (var t, n = [], i = this.articleNode(), r = 0; !(t = e.exec(i.getAttribute("id")));)
            if (!(i = i.parentElement) || 3 == r++)
                return [];
        for (var a = childrenOfParentElement(i), l = a.length, o = 0; o < l; ++o) {
            var s = a[o];
            if (s !== i) {
                var c = e.exec(s.getAttribute("id"));
                c && c[1] === t[1] && c[3] === t[3] && (isElementVisible(s) && !isElementPositionedOffScreen(s) || n.push(s))
            }
        }
        return n
    },
    adoptableMultiPageContentElements: function() {
        return this.containerElementsForMultiPageContent().map(function(e) {
            return this.cleanArticleNode(e, e.cloneNode(!0), CleaningType.MainArticleContent, !1)
        }, this)
    },
    classNameIsSignificantInRouteComputation: function(e) {
        return !!e && !(e.toLowerCase() in StylisticClassNames)
    },
    shouldIgnoreInRouteComputation: function(e) {
        let t = normalizedElementTagName(e);
        return "script" === t || "link" === t || "style" === t || "tr" === t && !e.offsetHeight
    },
    routeToArticleNode: function() {
        for (var e = [], t = this.articleNode(); t;) {
            var n = {};
            n.tagName = normalizedElementTagName(t);
            var i = t.getAttribute("id");
            i && (n.id = i), this.classNameIsSignificantInRouteComputation(t.className) && (n.className = t.className), n.index = 1;
            for (var r = t.previousElementSibling; r; r = r.previousElementSibling)
                this.shouldIgnoreInRouteComputation(r) || n.index++;
            e.unshift(n), t = t.parentElement
        }
        return e
    },
    adjustArticleNodeUpwardIfNecessary: function() {
        if (this.article) {
            var e = this.article.element;
            if (e.parentElement) {
                for (var t = e; t; t = t.parentElement)
                    if (VeryPositiveClassNameRegEx.test(t.className))
                        return void (this.article.element = t);
                if ("header" === normalizedElementTagName(e) && "article" === normalizedElementTagName(e.parentElement))
                    return void (this.article.element = e.parentElement);
                var n = e.previousElementSibling;
                if (n && "figure" === normalizedElementTagName(n) && "article" === normalizedElementTagName(e.parentElement))
                    return void (this.article.element = e.parentElement);
                var i = "section" === normalizedElementTagName(e) ? e : nearestAncestorElementWithTagName(e, "section", ["article"]);
                if (i) {
                    var r = i.parentElement;
                    if (function() {
                        for (var e = r.children, t = e.length, n = 0; n < t; ++n) {
                            var a = e[n],
                                l = normalizedElementTagName(a);
                            if (a !== i && ("section" === l || "header" === l))
                                return !0
                        }
                        return !1
                    }() && (/\barticleBody\b/.test(r.getAttribute("itemprop")) || "main" === normalizedElementTagName(r) || "main" === r.getAttribute("role") || "article" === normalizedElementTagName(r) || r === this.contentDocument.body || r.classList.contains("entry-content")))
                        return void (this.article.element = r)
                }
                const T = /intro/i,
                    y = /body|content/i;
                if (e = this.article.element, T.test(e.className) && e.nextElementSibling && y.test(e.nextElementSibling.className) || y.test(e.className) && e.previousElementSibling && T.test(e.previousElementSibling.className))
                    return void (this.article.element = e.parentElement);
                if ("article" !== normalizedElementTagName(e)) {
                    var a = e.parentElement.closest("*[itemprop='articleBody']");
                    if (a && a.parentElement.closest(SchemaDotOrgArticleContainerSelector))
                        return void (this.article.element = a)
                }
                var l = e.closest("article");
                if (l) {
                    e = unwrappedArticleContentElement(e);
                    var o = elementDepth(e);
                    "p" !== normalizedElementTagName(e) || e.className || (e = e.parentElement, o--);
                    var s;
                    e.classList.length ? (s = elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(e.classList, this.contentDocument), 1 === s.length && (s = elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(e.classList, this.contentDocument))) : s = e.parentElement.children;
                    for (var c = s.length, m = 0; m < c; ++m) {
                        var d = s[m];
                        if (e !== d && o === elementDepth(d) && (isElementVisible(d) && !d.querySelector("article") && Object.keys(e.dataset).join() === Object.keys(d.dataset).join() && dominantFontFamilyAndSizeForElement(e) === dominantFontFamilyAndSizeForElement(d)))
                            return void (this.article.element = l)
                    }
                }
                if (e = this.article.element, !e.getAttribute("id") && e.className) {
                    var h = normalizedElementTagName(e),
                        u = e.className,
                        g = e.parentElement;
                    if (g)
                        for (var f = g.children, m = 0, p = f.length; m < p; ++m) {
                            var E = f[m];
                            if (E !== e && (normalizedElementTagName(E) === h && E.className === u)) {
                                var v = CandidateElement.candidateIfElementIsViable(E, this.contentDocument, !0);
                                if (v && !(v.finalScore() < ReaderMinimumScore))
                                    return void (this.article.element = g)
                            }
                        }
                }
            }
        }
    },
    findArticleBySearchingWhitelist: function() {
        var e,
            t = this.contentDocument;
        return findArticleNodeSelectorsInWhitelistForHostname(t.location.hostname, function(n) {
            var i = t.querySelectorAll(n);
            if (1 === i.length)
                return e = new CandidateElement(i[0], t), !0
        }), e
    },
    articleNode: function(e) {
        return this.didSearchForArticleNode || (this.article = this.findArticleBySearchingWhitelist(), this.article || (this.article = this.findArticleBySearchingAllElements()), this.article || (this.article = this.findArticleByVisualExamination()), this.article || (this.article = this.findArticleFromMetadata()), !this.article && e && (this.article = this.findArticleBySearchingAllElements(!0)), this.adjustArticleNodeUpwardIfNecessary(), this.article && (this.article.element = unwrappedArticleContentElement(this.article.element)), this.didSearchForArticleNode = !0, this.article && this.articleIsLTR()), this.article ? this.article.element : null
    },
    extraArticleNode: function() {
        return this.didSearchForArticleNode || this.articleNode(), this.didSearchForExtraArticleNode || (this.extraArticle = this.findExtraArticle(), this.didSearchForExtraArticleNode = !0), this.extraArticle ? this.extraArticle.element : null
    },
    cacheWindowScrollPosition: function() {
        this._cachedScrollY = window.scrollY, this._cachedScrollX = window.scrollX
    },
    contentTextStyle: function() {
        return this._cachedContentTextStyle ? this._cachedContentTextStyle : (this._cachedContentTextStyle = contentTextStyleForNode(this.contentDocument, this.articleNode()), this._cachedContentTextStyle || (this._cachedContentTextStyle = getComputedStyle(this.articleNode())), this._cachedContentTextStyle)
    },
    commaCountIsLessThan: function(e, t) {
        for (var n = 0, i = e.textContent, r = -1; n < t && (r = i.indexOf(",", r + 1)) >= 0;)
            n++;
        return n < t
    },
    calculateLinkDensityForPruningElement: function(e, t) {
        var n = removeWhitespace(e.textContent).length;
        if (!n)
            return 0;
        for (var i = this.article.element, r = function() {
                for (var t = e.originalElement; t && t !== i; t = t.parentElement)
                    if ("none" !== getComputedStyle(t).float)
                        return t;
                return null
            }(), a = e.getElementsByTagName("a"), l = 0, o = a.length, s = 0; s < o; ++s) {
            var c = a[s];
            !r && c.href && t && t === dominantFontFamilyAndSizeForElement(c.originalElement) || (l += removeWhitespace(c.textContent).length)
        }
        return l / n
    },
    shouldPruneElement: function(e, t, n) {
        const i = .33,
            r = .5,
            a = .2,
            l = 25,
            o = 4e4;
        let s = normalizedElementTagName(e);
        if (!e.parentElement)
            return !1;
        if (t.classList.contains("footnotes"))
            return !1;
        if (e.querySelector(".tweet-wrapper"))
            return !1;
        if ("figure" === normalizedElementTagName(e.parentElement) && e.querySelector("img"))
            return !1;
        if ("iframe" === s)
            return shouldPruneIframe(e);
        if ("object" !== s && "embed" !== s && "canvas" !== s) {
            for (var c = !1, m = e.childNodes.length, d = 0; d < m; ++d) {
                var h = e.childNodes[d],
                    u = h.nodeType;
                if (u === Node.ELEMENT_NODE || u === Node.TEXT_NODE && !isNodeWhitespace(h)) {
                    c = !0;
                    break
                }
            }
            if (!c) {
                if ("p" === s) {
                    var g = e.previousSibling,
                        f = e.nextSibling;
                    if (g && g.nodeType === Node.TEXT_NODE && !isNodeWhitespace(g) && f && f.nodeType === Node.TEXT_NODE && !isNodeWhitespace(f))
                        return !1
                }
                return !0
            }
            if ("p" === s)
                return !1
        }
        if ("canvas" === s)
            return window.innerWidth === t.width && window.innerHeight === t.height || (!(!ProgressiveLoadingRegex.test(t.className) || "img" !== normalizedElementTagName(t.nextElementSibling)) || (!!canvasElementHasNoUserVisibleContent(t) || "cufon" === normalizedElementTagName(e.parentNode)));
        if (e.closest("figure") && e.querySelector("picture"))
            return !1;
        var p = 0;
        if (t) {
            if (VeryNegativeClassNameRegEx.test(t.className))
                return !0;
            var E = t.className,
                v = t.getAttribute("id");
            PositiveRegEx.test(E) && p++, PositiveRegEx.test(v) && p++, NegativeRegEx.test(E) && p--, NegativeRegEx.test(v) && p--
        }
        let T = this.isMediaWikiPage();
        if (p < 0 && !T)
            return !0;
        if (elementIsProtected(e))
            return !1;
        if ("ul" === s || "ol" === s) {
            if (t.querySelector("iframe") && t.querySelector("script"))
                return !0;
            var y = t.children,
                N = y.length;
            if (!N && !/\S/.test(e.innerText))
                return !0;
            for (var A = 0, S = 0, d = 0; d < N; ++d) {
                var b = y[d];
                if (SharingRegex.test(b.className))
                    A++;
                else {
                    var x = b.children;
                    1 === x.length && SharingRegex.test(x[0].className) && A++
                }
                NegativeRegEx.test(y[d].className) && S++
            }
            return A / N >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList || S / N >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList
        }
        if ("object" === s) {
            var C = e.querySelector("embed[src]");
            let t = C ? urlFromString(C.src) : null;
            if (t && hostnameMatchesHostKnownToContainEmbeddableMedia(t.hostname))
                return !1;
            var D = e.getAttribute("data");
            return !(t = D ? urlFromString(D) : null) || !hostnameMatchesHostKnownToContainEmbeddableMedia(t.hostname)
        }
        if (1 === e.childElementCount) {
            var I = e.firstElementChild;
            if ("a" === normalizedElementTagName(I))
                return !1;
            if ("span" === normalizedElementTagName(I) && "converted-anchor" === I.className && nearestAncestorElementWithTagName(I, "table"))
                return !1
        }
        var L = e.getElementsByTagName("img"),
            M = L.length;
        if (M) {
            for (var R = 0, d = 0; d < M; ++d) {
                var F = L[d].originalElement;
                if (isElementVisible(F)) {
                    var w = cachedElementBoundingRect(F);
                    R += w.width / M * (w.height / M)
                }
            }
            if (R > o)
                return !1
        }
        if (!this.commaCountIsLessThan(e, 10))
            return !1;
        var _ = e.getElementsByTagName("p").length,
            P = e.getElementsByTagName("br").length,
            B = _ + Math.floor(P / 2);
        if (M > B && "table" !== s)
            return !0;
        if (!e.closest("table") && !e._originalElementDepthInCollapsedArea && !T) {
            if (e.getElementsByTagName("li").length > B && dominantFontFamilyAndSizeForElement(t.querySelector("li")) !== n)
                return !0;
            if (e.textContent.length < l && 1 !== M)
                return !0;
            let i = this.calculateLinkDensityForPruningElement(e, n);
            if (p >= 1 && i > r)
                return !0;
            if (p < 1 && i > a)
                return !0
        }
        if (e.getElementsByTagName("input").length / B > i)
            return !0;
        if (e.querySelector("embed"))
            return !0;
        if ("table" === s) {
            if (removeWhitespace(e.innerText).length <= .5 * removeWhitespace(t.innerText).length)
                return !0;
            if (T && t.classList.contains("toc"))
                return !0
        }
        return !1
    },
    wordCountIsLessThan: function(e, t) {
        for (var n = 0, i = e.textContent, r = -1; (r = i.indexOf(" ", r + 1)) >= 0 && n < t;)
            n++;
        return n < t
    },
    leadingMediaIsAppropriateWidth: function(e) {
        return !(!this.article || !e) && e.getBoundingClientRect().width >= this.article.element.getBoundingClientRect().width - ToleranceForLeadingMediaWidthToArticleWidthForFullWidthPresentation
    },
    newDivFromNode: function(e) {
        var t = this.contentDocument.createElement("div");
        return e && (t.innerHTML = e.innerHTML), t
    },
    headerElement: function() {
        if (!this.article)
            return null;
        var e = this.article.element.previousElementSibling;
        if (e && "header" === normalizedElementTagName(e))
            return e;
        var t = this._articleTitleElement;
        if (!t)
            return null;
        var n = t.parentElement;
        if (n && "header" === normalizedElementTagName(n) && !this.article.element.contains(n))
            for (var i = n.querySelectorAll("img"), r = i.length, a = 0; a < r; ++a) {
                var l = i[a],
                    o = cachedElementBoundingRect(l);
                if (o.width >= MainImageMinimumWidthAndHeight && o.height >= MainImageMinimumWidthAndHeight)
                    return n
            }
        return null
    },
    adoptableLeadingMedia: function() {
        if (!this.article || !this._leadingMediaElement || !this.leadingMediaIsAppropriateWidth(this._leadingMediaElement))
            return null;
        var e = this._leadingMediaElement.closest("figure");
        if (e)
            return this.cleanArticleNode(e, e.cloneNode(!0), CleaningType.LeadingMedia, !0);
        if ("img" !== normalizedElementTagName(this._leadingMediaElement))
            return this.cleanArticleNode(this._leadingMediaElement, this._leadingMediaElement.cloneNode(!0), CleaningType.LeadingMedia, !0);
        const t = 5,
            n = /credit/,
            i = /caption/,
            r = /src|alt/;
        var a = this._leadingMediaElement.parentNode,
            l = null,
            o = null,
            s = a.children.length;
        if ("div" === normalizedElementTagName(a) && s > 1 && s < t)
            for (var c = a.cloneNode(!0).querySelectorAll("p, div"), m = c.length, d = 0; d < m; ++d) {
                var h = c[d];
                n.test(h.className) ? l = h.cloneNode(!0) : i.test(h.className) && (o = h.cloneNode(!0))
            }
        var u = this._leadingMediaElement.cloneNode(!1),
            g = lazyLoadingImageURLForElement(u, u.className);
        g && u.setAttribute("src", g), !g && u.hasAttribute("src") || !u.hasAttribute("data-srcset") || u.setAttribute("srcset", u.getAttribute("data-srcset"));
        for (var f = attributesForElement(u), d = 0; d < f.length; ++d) {
            var p = f[d].nodeName;
            r.test(p) || (u.removeAttribute(p), d--)
        }
        var E = this.contentDocument.createElement("div");
        if (E.className = "leading-image", E.appendChild(u), l) {
            var v = this.newDivFromNode(l);
            v.className = "credit", E.appendChild(v)
        }
        if (o) {
            var T = this.newDivFromNode(o);
            T.className = "caption", E.appendChild(T)
        }
        return E
    },
    articleBoundingRect: function() {
        return this._articleBoundingRect ? this._articleBoundingRect : (this._articleBoundingRect = cachedElementBoundingRect(this.article.element), this._articleBoundingRect)
    },
    adoptableArticle: function(e) {
        if (this._adoptableArticle)
            return this._adoptableArticle.cloneNode(!0);
        clearCachedElementBoundingRects(), this.cacheWindowScrollPosition();
        var t = this.articleNode(e);
        if (this._adoptableArticle = t ? t.cloneNode(!0) : null, !this._adoptableArticle)
            return this._adoptableArticle;
        if (this._adoptableArticle = this.cleanArticleNode(t, this._adoptableArticle, CleaningType.MainArticleContent, !1), "p" === normalizedElementTagName(this._adoptableArticle)) {
            var n = document.createElement("div");
            n.appendChild(this._adoptableArticle), this._adoptableArticle = n
        }
        var i = this.extraArticleNode();
        if (i) {
            var r = this.cleanArticleNode(i, i.cloneNode(!0), CleaningType.MainArticleContent, !0);
            r ? this.extraArticle.isPrepended ? this._adoptableArticle.insertBefore(r, this._adoptableArticle.firstChild) : this._adoptableArticle.appendChild(r) : i = null;
            var a = cachedElementBoundingRect(this.article.element),
                l = cachedElementBoundingRect(this.extraArticle.element),
                o = {
                    top: Math.min(a.top, l.top),
                    right: Math.max(a.right, l.right),
                    bottom: Math.max(a.bottom, l.bottom),
                    left: Math.min(a.left, l.left)
                };
            o.width = o.right - o.left, o.height = o.bottom - o.top, this._articleBoundingRect = o
        }
        this._articleTextContent = this._adoptableArticle.innerText;
        var s = this.headerElement();
        if (this._leadingMediaElement && (!s || !s.contains(this._leadingMediaElement))) {
            var c = this.adoptableLeadingMedia();
            c && this._adoptableArticle.insertBefore(c, this._adoptableArticle.firstChild)
        }
        var m = !!s;
        if (m && i && (i === s && (m = !1), m)) {
            var d = i.compareDocumentPosition(s);
            (d & Node.DOCUMENT_POSITION_CONTAINS || d & Node.DOCUMENT_POSITION_CONTAINED_BY) && (m = !1)
        }
        if (m) {
            var h = this.cleanArticleNode(s, s.cloneNode(!0), CleaningType.MainArticleContent, !0);
            h && this._adoptableArticle.insertBefore(h, this._adoptableArticle.firstChild)
        }
        return this._adoptableArticle
    },
    elementPinToEdge: function(e) {
        const t = new Set(["area", "br", "canvas", "embed", "frame", "hr", "img", "input"]);
        if (window.scrollY < 120)
            return null;
        var n = cachedElementBoundingRect(e),
            i = e.ownerDocument.elementFromPoint((n.left + n.right) / 2, 0);
        i && t.has(normalizedElementTagName(i)) && (i = i.parentElement);
        for (var r = i; r && r !== e;)
            r = r.parentNode;
        return r ? i : null
    },
    dominantContentSelectorAndDepth: function(e) {
        const t = 2;
        var n = {},
            i = {};
        walkElementSubtree(e, t, function(e, t) {
            if (isElementVisible(e)) {
                var r = selectorForElement(e) + " | " + t;
                i[r] ? i[r] += 1 : (i[r] = 1, n[r] = e)
            }
        });
        var r,
            a = arrayOfKeysAndValuesOfObjectSortedByValueDescending(i);
        switch (a.length) {
        case 0:
            break;
        case 1:
            r = a[0].key;
            break;
        default:
            var l = a[0];
            l.value > a[1].value && (r = l.key)
        }
        if (!r)
            return null;
        var o = n[r];
        return {
            selector: selectorForElement(o),
            depth: depthOfElementWithinElement(o, e)
        }
    },
    functionToPreventPruningElementDueToInvisibility: function() {
        return functionToPreventPruningDueToInvisibilityInWhitelistForHostname(this.contentDocument.location.hostname) || function() {
                return !1
            }
    },
    cleanArticleNode: function(e, t, n, i) {
        function r(e) {
            v += e, T && (T += e), y && (y += e), N && (N += e), A && (A += e), S && (S += e)
        }
        function a() {
            1 === T && (T = 0), 1 === y && (y = 0), 1 === N && (N = 0), 1 === A && (A = 0), 1 === S && (S = 0)
        }
        function l() {
            const t = .8;
            var n = cachedElementBoundingRect(e);
            if (0 === n.width || 0 === n.height)
                return !0;
            var i,
                r = childrenWithParallelStructure(e),
                a = r.length;
            if (a) {
                i = [];
                for (var l = 0; l < a; ++l) {
                    var o = r[l];
                    if ("none" === getComputedStyle(o).float)
                        for (var s = o.children, c = s.length, m = 0; m < c; ++m)
                            i.push(s[m]);
                    else
                        i.push(o)
                }
            } else
                i = e.children;
            for (var d = i.length, h = 0, l = 0; l < d; ++l) {
                var u = i[l];
                "none" !== getComputedStyle(u).float && (h += u.innerText.length)
            }
            return h / e.innerText.length > t
        }
        function o(t) {
            return !(cachedElementBoundingRect(t).height > 50) && (!!new Set(["ul", "li", "nav"]).has(normalizedElementTagName(t)) || t.parentElement === e && !t.nextElementSibling)
        }
        function s(e, t) {
            return !(cachedElementBoundingRect(e).height > .9 * cachedElementBoundingRect(t).height)
        }
        function c(e, t) {
            t && j && !e.matches(HeaderElementsSelector) && ((t > 1.4 * j || G.test(b.className) && t > 1.1 * j) && !e.closest(".pullquote") && (e.classList.add("pullquote"), e.classList.contains("float") || (e.style.width = null, cleanStyleAndClassList(e))))
        }
        function m(e, t) {
            for (var n = e[t]; n; n = n[t])
                if (!isNodeWhitespace(n) && n.nodeType !== Node.COMMENT_NODE)
                    return !1;
            return !0
        }
        const d = new Set(["form", "script", "style", "link", "button", "embed"]),
            h = new Set(["div", "table", "object", "ul", "canvas", "p", "iframe", "aside", "section", "footer", "nav", "ol", "menu", "svg"]),
            u = new Set(["i", "em"]),
            g = new Set(["b", "strong", "h1", "h2", "h3", "h4", "h5", "h6"]),
            f = new Set(["i-amphtml-sizer"]),
            p = /lightbox/i;
        var E = [],
            v = 0,
            T = 0,
            y = 0,
            N = 0,
            A = 0,
            S = 0,
            b = e,
            x = b.ownerDocument.defaultView,
            C = t,
            D = this.articleTitle(),
            I = this._articleTitleElement,
            L = (this.articleSubhead(), this._articleSubheadElement),
            M = I && cachedElementBoundingRect(I).top > cachedElementBoundingRect(e).bottom,
            R = this.elementPinToEdge(e),
            F = null,
            w = isElementVisible(e),
            _ = new Set([I, L]),
            P = new Set;
        if (n === CleaningType.MainArticleContent) {
            this.updateArticleBylineAndDateElementsIfNecessary();
            var B = this.articleBylineElement();
            B && P.add(B);
            var O = this.articleDateElement();
            O && P.add(O)
        }
        var k = this.dominantContentSelectorAndDepth(e),
            q = l(),
            W = new Set;
        this.previouslyDiscoveredPageURLStrings.forEach(function(e) {
            W.add(e)
        });
        var z = this.nextPageURL();
        z && W.add(z);
        var H = null;
        this._articleTitleElement && (H = cachedElementBoundingRect(this._articleTitleElement));
        var U = this.functionToPreventPruningElementDueToInvisibility(),
            V = dominantFontFamilyAndSizeForElement(e),
            j = dominantFontSizeInPointsFromFontFamilyAndSizeString(V);
        const G = /pull(ed)?quote/i;
        for (var X = [], Y = [], K = [], J = [], Q = []; b;) {
            try {
                var $ = null,
                    Z = normalizedElementTagName(C),
                    ee = !1,
                    te = elementLooksLikeDropCap(b);
                if (C.originalElement = b, b === R && (F = C), !S && elementAppearsToBeCollapsed(b) && (S = 1), d.has(Z) ? $ = C : this.isAMPPage() && f.has(Z) && ($ = C), !$ && b !== e && _.has(b) ? $ = C : !$ && b !== e && P.has(b) ? (C.parentElementBeforePruning = C.parentElement, $ = C, X.push(C)) : elementIsAHeader(C) && previousLeafElementForElement(b) === I && C.classList.add("protected"), "twitter-widget" === Z && C.classList.add("protected"), !$ && ("h1" === Z || "h2" === Z)) {
                    if (b.offsetTop - e.offsetTop < HeaderMinimumDistanceFromArticleTop) {
                        var ne = trimmedInnerTextIgnoringTextTransform(b),
                            ie = ne.length * HeaderLevenshteinDistanceToLengthRatio;
                        levenshteinDistance(D, ne) <= ie && ($ = C)
                    }
                }
                if ($ || this.isMediaWikiPage() && /editsection|icon-edit|edit-page|mw-empty-elt/.test(b.className) && ($ = C), "video" === Z)
                    if (C.getAttribute("src")) {
                        C.classList.add("protected");
                        var re = cachedElementBoundingRect(b);
                        C.setAttribute("width", re.width), C.setAttribute("height", re.height), C.removeAttribute("style");
                        const e = b.hasAttribute("autoplay") && b.hasAttribute("muted") && b.hasAttribute("loop");
                        e ? C.setAttribute("data-reader-silent-looped-animation", "") : (C.setAttribute("controls", !0), C.removeAttribute("autoplay"), C.removeAttribute("preload"))
                    } else
                        $ = C;
                var ae;
                if ($ || (ae = getComputedStyle(b)), !$ && ("div" === Z || "span" === Z) && LazyLoadRegex.test(b.className) && (!b.innerText || b.previousElementSibling && "noscript" === normalizedElementTagName(b.previousElementSibling))) {
                    var le = lazyLoadingImageURLForElement(C, b.className);
                    if (le) {
                        var oe = this.contentDocument.createElement("img");
                        oe.setAttribute("src", le), C.parentNode.replaceChild(oe, C), C = oe, C.originalElement = b, Z = normalizedElementTagName(C), $ = C, C.classList.add("protected")
                    }
                }
                if (!$ && "div" === Z && C.parentNode) {
                    var se = b.querySelectorAll("a, blockquote, dl, div, img, ol, p, pre, table, ul"),
                        ce = T || "none" !== ae.float,
                        me = null;
                    if (ce || se.length ? elementIndicatesItIsASchemaDotOrgImageObject(b) && !C.querySelector("figure, .auxiliary") ? me = "figure" : te && (me = "span") : me = "p", me) {
                        for (var de = C.parentNode, he = this.contentDocument.createElement(me); C.firstChild;) {
                            var ue = C.firstChild;
                            he.appendChild(ue)
                        }
                        de.replaceChild(he, C), F === C && (F = he), C = he, C.originalElement = b, Z = normalizedElementTagName(C)
                    }
                }
                if (b.dataset && b.dataset.mathml && b.querySelector("math") && K.push(C), !$ && C.parentNode && h.has(Z) && (C._originalElementDepthInCollapsedArea = S, E.push(C)), $ || (isElementPositionedOffScreen(b) ? $ = C : b === e || T || "none" === ae.float || q || !(cachedElementBoundingRect(b).height >= FloatMinimumHeight || b.childElementCount > 1) || (T = 1)), !$) {
                    if (sanitizeElementByRemovingAttributes(C), n === CleaningType.MetadataContent)
                        if ("|" === C.innerText)
                            C.innerText = "", C.classList.add("delimiter");
                        else if ("time" === normalizedElementTagName(C)) {
                            var ge = C.previousElementSibling;
                            if (ge && "span" === normalizedElementTagName(ge) && !ge.classList.contains("delimiter")) {
                                var fe = this.contentDocument.createElement("span");
                                fe.classList.add("delimiter"), C.before(fe)
                            }
                        } else
                            "figure" === Z && ($ = C);
                    if ("both" === ae.clear && C.classList.add("clear"), "ul" === Z || "ol" === Z || "menu" === Z) {
                        if (H && !S && cachedElementBoundingRect(b).top < H.top)
                            $ = C;
                        else if ("none" === ae["list-style-type"] && "none" === ae["background-image"]) {
                            for (var pe = b.children, Ee = pe.length, ve = !0, Te = 0; Te < Ee; ++Te) {
                                var ye = pe[Te],
                                    Ne = getComputedStyle(ye);
                                if ("none" !== Ne["list-style-type"] || 0 !== parseInt(Ne["-webkit-padding-start"])) {
                                    ve = !1;
                                    break
                                }
                                var Ae = getComputedStyle(ye, ":before").content;
                                const e = /\u2022|\u25e6|\u2023|\u2219|counter/;
                                if (e.test(Ae)) {
                                    ve = !1;
                                    break
                                }
                            }
                            ve && C.classList.add("list-style-type-none")
                        }
                        if (b.querySelector("code")) {
                            const e = /monospace|menlo|courier/i;
                            var Se = dominantFontFamilyAndSizeForElement(b);
                            e.test(Se) && (C.classList.add("code-block"), C.classList.add("protected"))
                        }
                    }
                    if (N || "normal" === ae.fontStyle || (u.has(Z) || C.style && (C.style.fontStyle = ae.fontStyle), N = 1), !A && "normal" !== ae.fontWeight) {
                        if (!g.has(Z)) {
                            var be = parseInt(ae.fontWeight),
                                xe = null;
                            isNaN(be) ? xe = ae.fontWeight : be <= 400 || be >= 500 && (xe = "bold"), xe && C.style && (C.style.fontWeight = xe)
                        }
                        A = 1
                    }
                    if (T && "section" !== Z && s(b, e) || "aside" === Z) {
                        var Se = dominantFontFamilyAndSizeForElement(b),
                            Ce = dominantFontSizeInPointsFromFontFamilyAndSizeString(Se),
                            De = Se && Se === V;
                        if (1 !== T || te || (cachedElementBoundingRect(b).width <= MaximumFloatWidth ? C.setAttribute("class", "auxiliary float " + ae.float) : De || C.classList.add("auxiliary")), C.closest(".auxiliary") && b.style) {
                            var Ie = b.style.getPropertyValue("width");
                            if ("table" === ae.display && /%/.test(Ie) && parseInt(Ie) < 2)
                                C.style.width = ae.width;
                            else if (Ie)
                                C.style.width = Ie;
                            else {
                                var Le = x.getMatchedCSSRules(b, "", !0);
                                if (Le)
                                    for (var Me = Le.length, Te = Me - 1; Te >= 0; --Te) {
                                        Ie = Le[Te].style.getPropertyValue("width");
                                        var Re = parseInt(Ie);
                                        if (Ie && (isNaN(Re) || Re > 0)) {
                                            C.style.width = Ie;
                                            break
                                        }
                                    }
                            }
                            1 !== T || Ie || (C.style.width = cachedElementBoundingRect(b).width + "px")
                        }
                        te || c(C, Ce)
                    }
                    if ("table" === Z)
                        y || (y = 1);
                    else if ("img" === Z) {
                        var le = lazyLoadingImageURLForElement(C, b.className);
                        if (le) {
                            C.setAttribute("src", le);
                            var Fe = !!C.closest("figure");
                            if (!Fe)
                                for (var we = attributesForElement(b), _e = we.length, Te = 0; Te < _e; ++Te)
                                    if (p.test(we[Te].nodeName)) {
                                        Fe = !0;
                                        break
                                    }
                            Fe && C.classList.add("protected"), ee = !0
                        }
                        !le && C.hasAttribute("src") || !b.hasAttribute("data-srcset") || C.setAttribute("srcset", b.getAttribute("data-srcset")), C.removeAttribute("border"), C.removeAttribute("hspace"), C.removeAttribute("vspace");
                        var Pe = C.getAttribute("align");
                        if (C.removeAttribute("align"), "left" !== Pe && "right" !== Pe || (C.classList.add("float"), C.classList.add(Pe)), !T && !ee) {
                            var Be = cachedElementBoundingRect(b),
                                Oe = Be.width,
                                ke = Be.height;
                            hasClassMatchingRegexp(b, ProgressiveLoadingRegex) && b.nextElementSibling && "img" === normalizedElementTagName(b.nextElementSibling) ? $ = C : imageIsContainedByContainerWithImageAsBackgroundImage(b) ? C.classList.add("protected") : 1 === Oe && 1 === ke ? $ = C : H && ke < MinimumHeightForImagesAboveTheArticleTitle && Be.bottom < H.top ? $ = C : Oe < ImageSizeTiny && ke < ImageSizeTiny && C.setAttribute("class", "reader-image-tiny")
                        }
                        if (n === CleaningType.MetadataContent) {
                            var Be = cachedElementBoundingRect(b);
                            (Be.width > MaximumWidthOrHeightOfImageInMetadataSection || Be.height > MaximumWidthOrHeightOfImageInMetadataSection) && ($ = C)
                        }
                        if (b.classList.contains("emoji")) {
                            let e = urlFromString(C.src);
                            if (e && "s.w.org" === e.hostname && e.pathname.startsWith("/images/core/emoji/")) {
                                let e = this.replaceImageWithAltText(C);
                                e && (C = e, C.originalElement = b, Z = normalizedElementTagName(C), $ = C, C.classList.add("protected"))
                            }
                        }
                    } else if ("font" === Z)
                        C.removeAttribute("size"), C.removeAttribute("face"), C.removeAttribute("color");
                    else if ("a" === Z && C.parentNode) {
                        let e,
                            t;
                        C instanceof HTMLAnchorElement ? (e = C.getAttribute("href"), t = HTMLAnchorElement) : C instanceof SVGAElement && (e = C.getAttribute("xlink:href"), t = SVGAElement);
                        let i = urlStringIsJavaScriptURL(e);
                        if (t === HTMLAnchorElement && "author" === b.getAttribute("itemprop"))
                            C.classList.add("protected");
                        else if (e && e.length && ("#" === e[0] || i)) {
                            const e = new Set(["li", "sup"]);
                            if (!y && !C.childElementCount && 1 === C.parentElement.childElementCount && !e.has(normalizedElementTagName(C.parentElement))) {
                                var qe = this.contentDocument.evaluate("text()", C.parentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                                qe.snapshotLength || ($ = C)
                            }
                            if ($ || t !== SVGAElement) {
                                if (!$) {
                                    var he = this.contentDocument.createElement("span");
                                    if (1 === C.childElementCount && "img" === normalizedElementTagName(C.firstElementChild)) {
                                        var We = C.firstElementChild;
                                        We.width > AnchorImageMinimumWidth && We.height > AnchorImageMinimumHeight && he.setAttribute("class", "converted-image-anchor")
                                    }
                                    for (he.className || he.setAttribute("class", "converted-anchor"); C.firstChild;)
                                        he.appendChild(C.firstChild);
                                    C.parentNode.replaceChild(he, C), C = he, C.originalElement = b, F === C && (F = he)
                                }
                            } else
                                C.removeAttribute("xlink:href")
                        } else if (AdvertisementHostRegex.test(C.host) && !C.innerText)
                            $ = C;
                        else if (n !== CleaningType.MetadataContent && I && !M && I.compareDocumentPosition(b) & document.DOCUMENT_POSITION_PRECEDING && cachedElementBoundingRect(b).top < cachedElementBoundingRect(I).top)
                            Y.push(C);
                        else {
                            var ze = b.children;
                            1 === ze.length && "img" === normalizedElementTagName(ze[0]) && !b.innerText && anchorLooksLikeDownloadFlashLink(b) && ($ = C)
                        }
                    } else if ("aside" === Z || "blockquote" === Z || "q" === Z || "div" === Z && G.test(b.className)) {
                        var Se = dominantFontFamilyAndSizeForElement(b),
                            Ce = dominantFontSizeInPointsFromFontFamilyAndSizeString(Se);
                        te || c(C, Ce)
                    } else if ("cite" === Z) {
                        var He = pseudoElementContent(b, "after");
                        if (He) {
                            var Ue = document.createElement("span");
                            Ue.innerText = He, C.after(Ue)
                        }
                    } else
                        "pre" === Z ? C.style.whiteSpace = ae.whiteSpace : "source" === Z && b.hasAttribute("data-srcset") ? (C.setAttribute("srcset", b.getAttribute("data-srcset")), C.classList.add("protected")) : C instanceof SVGAnimateElement && "xlink:href" === C.attributes.attributeName.value && ($ = C)
                }
                if (ae && w && !ee) {
                    if (("none" === ae.display || "visible" !== ae.visibility || computedStyleIndicatesElementIsInvisibleDueToClipping(ae)) && !S) {
                        !!k && (v === k.depth && selectorForElement(b) === k.selector) || U(b, e) || ($ = C)
                    }
                }
                if (!$ && elementIsCommentBlock(b) && ($ = C), !$ && H && cachedElementBoundingRect(b).top < H.top && VeryLiberalCommentRegex.test(b.className) && C.parentElement && ($ = C), !$ && "a" === Z && W.has(b.href)) {
                    for (var Ve, je, Ge = b, Xe = C; (Ge = Ge.parentElement) && (Xe = Xe.parentElement);) {
                        const t = 10;
                        if (cachedElementBoundingRect(Ge).top - cachedElementBoundingRect(b).top > t)
                            break;
                        if (Ge === e)
                            break;
                        o(Ge) && (Ve = Ge, je = Xe)
                    }
                    Ve && ($ = je, b = Ve, C = je, C.originalElement = b, Z = normalizedElementTagName(C)), Ge = null, Xe = null, Ve = null, je = null
                }
            } catch (e) {
                console.error("ReaderArticleFinder cleanArticleNode error for element:"), console.error(b), console.error(e), $ = C
            }
            !$ || $.parentElement || i || ($ = null), "div" === Z ? J.push(C) : "aside" === Z && Q.push(C);
            var Ye = $ ? null : b.firstElementChild;
            if (Ye)
                b = Ye, C = C.firstElementChild, r(1);
            else {
                for (var Ke; b !== e && !(Ke = b.nextElementSibling);)
                    b = b.parentElement, C = C.parentElement, r(-1);
                if (b === e) {
                    if ($ && !elementIsProtected($))
                        if ($.parentElement)
                            $.remove();
                        else if (i)
                            return null;
                    break
                }
                b = Ke, C = C.nextElementSibling, a()
            }
            if ($ && !elementIsProtected($))
                if ($.parentElement)
                    $.remove();
                else if (i)
                    return null
        }
        for (let e of t.querySelectorAll("iframe")) {
            if (elementLooksLikeEmbeddedTweet(e.originalElement)) {
                var Je = this.adoptableSimpleTweetFromTwitterElement(e);
                Je && e.parentElement.replaceChild(Je, e)
            }
            e.classList.add("protected"), e.setAttribute("sandbox", "allow-scripts allow-same-origin")
        }
        for (let e of t.querySelectorAll("twitter-widget")) {
            if (elementLooksLikeEmbeddedTweet(e.originalElement)) {
                var Je = this.adoptableSimpleTweetFromTwitterElement(e);
                Je && e.parentElement.replaceChild(Je, e)
            }
            e.classList.add("protected")
        }
        for (var Te = E.length - 1; Te >= 0; --Te) {
            var Qe = E[Te];
            Qe.parentNode && this.shouldPruneElement(Qe, Qe.originalElement, V) && (F === Qe && ((F = Qe.nextElementSibling) || (F = Qe.parentElement)), Qe.remove()), delete Qe._originalElementDepthInCollapsedArea
        }
        for (var $e = Y.length, Te = 0; Te < $e; ++Te)
            Y[Te].remove();
        for (var Ze = t.querySelectorAll(".float"), Te = 0; Te < Ze.length; ++Te) {
            var et = !1,
                tt = Ze[Te];
            if (!et) {
                var nt = tt.querySelectorAll("a, span.converted-image-anchor"),
                    it = tt.querySelectorAll("span.converted-anchor");
                et = tt.parentNode && it.length > nt.length
            }
            if (!et) {
                var rt = tt.querySelectorAll("embed, object").length,
                    at = tt.originalElement.querySelectorAll("embed, object").length;
                !rt && at && (et = !0)
            }
            if (!et) {
                for (var lt = tt.originalElement.getElementsByTagName("img"), ot = lt.length, st = 0, ct = 0; ct < ot && (w && isElementVisible(lt[ct]) && st++, !(st > 1)); ++ct)
                    ;
                if (1 === st) {
                    tt.getElementsByTagName("img").length || (et = !0)
                }
            }
            if (!et) {
                const e = "img, video, embed, iframe, object, svg";
                /\S/.test(tt.innerText) || tt.matches(e) || tt.querySelector(e) || (et = !0)
            }
            et && (F === tt && ((F = tt.nextElementSibling) || (F = tt.parentElement)), elementIsProtected(tt) || tt.remove())
        }
        for (var mt = t.querySelectorAll("br"), dt = mt.length, Te = dt - 1; Te >= 0; --Te) {
            var ht = mt[Te];
            ht.originalElement && "block" === getComputedStyle(ht.originalElement.parentElement).display && (m(ht, "nextSibling") || m(ht, "previousSibling")) && ht.remove()
        }
        if (i && !removeWhitespace(t.innerText).length && (n !== CleaningType.LeadingMedia || !t.querySelector("video, iframe, img")))
            return null;
        if (F) {
            var ut = document.createElement("div"),
                gt = F.originalElement.getBoundingClientRect(),
                ft = gt.height > 0 ? 100 * gt.top / gt.height : 0;
            ut.style.position = "relative", ut.style.top = Math.round(-ft) + "%", ut.setAttribute("id", "safari-reader-element-marker"), F.insertBefore(ut, F.firstChild)
        }
        for (var pt = {}, nt = t.querySelectorAll("a"), Et = nt.length, Te = 0; Te < Et; ++Te) {
            var vt = nt[Te],
                Tt = vt.style.fontWeight;
            pt[Tt] || (pt[Tt] = []), pt[Tt].push(vt)
        }
        for (var Tt in pt) {
            var yt = pt[Tt],
                Nt = yt.length;
            const e = .7;
            if (Nt > e * Et)
                for (var Te = 0; Te < Nt; ++Te) {
                    var vt = yt[Te];
                    vt.style.fontWeight = null, vt.getAttribute("style") || vt.removeAttribute("style")
                }
        }
        for (var At = t.querySelectorAll(".protected"), St = At.length, Te = 0; Te < St; ++Te) {
            var Qe = At[Te];
            Qe.classList.remove("protected"), Qe.classList.length || Qe.removeAttribute("class")
        }
        for (var bt = t.querySelectorAll("p.auxiliary"), xt = bt.length, Te = 0; Te < xt; ++Te) {
            for (var Ct = bt[Te], Dt = [Ct], It = Ct.nextElementSibling; It && "p" === normalizedElementTagName(It) && It.classList.contains("auxiliary");)
                Dt.push(It), It = It.nextElementSibling;
            var Lt = Dt.length;
            if (Lt > 1) {
                for (var ct = 0; ct < Lt; ++ct) {
                    var Mt = Dt[ct];
                    Mt.classList.remove("auxiliary"), Mt.style && (Mt.style.width = null), cleanStyleAndClassList(Mt)
                }
                Te += Lt - 1
            }
        }
        for (var Rt = J.length, Te = Rt - 1; Te >= 0; --Te) {
            var Ft = J[Te];
            Ft !== t && elementWouldAppearBetterAsFigureOrAuxiliary(Ft.originalElement, Ft) && changeElementType(Ft, "figure")
        }
        for (var wt = Q.length, Te = wt - 1; Te >= 0; --Te) {
            var _t = Q[Te];
            _t !== t && elementWouldAppearBetterAsFigureOrAuxiliary(_t.originalElement, _t) && _t.classList.add("auxiliary")
        }
        const Pt = t.querySelectorAll("blockquote"),
            Bt = Pt.length;
        for (var Te = 0; Te < Bt; ++Te) {
            const e = Pt[Te],
                t = e.originalElement;
            t && this.convertBlockquoteTweetToSimpleTweetIfAppropriate(e, t)
        }
        for (var Ot = X.length, Te = 0; Te < Ot; ++Te) {
            var kt = X[Te],
                qt = kt.parentElementBeforePruning,
                Wt = null,
                zt = null;
            if (qt)
                var Wt = depthOfElementWithinElement(qt, t),
                    zt = selectorForElement(qt);
            var Ht = qt ? qt.closest("ul") : null;
            if (Ht)
                Ht.remove();
            else {
                const e = 40;
                qt && cachedElementBoundingRect(qt.originalElement).height < e && (!k || k.selector !== zt || k.depth !== Wt) ? qt.remove() : kt.remove()
            }
        }
        for (var Ut = K.length, Te = 0; Te < Ut; ++Te) {
            var Vt = K[Te],
                jt = this.contentDocument.createElement("div");
            jt.innerHTML = Vt.dataset ? Vt.dataset.mathml : "", Vt.parentNode.replaceChild(jt, Vt)
        }
        return t
    },
    convertBlockquoteTweetToSimpleTweetIfAppropriate: function(e, t) {
        const n = t.classList;
        if (n.contains("twitter-tweet") || n.contains("twitter-video")) {
            const n = t.getElementsByTagName("a"),
                i = n.length;
            if (!(i < 1)) {
                const t = n[i - 1];
                if ("twitter.com" === t.host) {
                    const n = lastPathComponentFromAnchor(t);
                    if (!isNaN(parseInt(n))) {
                        const t = this.contentDocument.createElement("div");
                        t.setAttribute("data-reader-tweet-id", n), t.classList.add("tweet-wrapper"), e.parentElement.replaceChild(t, e), e.classList.add("simple-tweet"), t.appendChild(e)
                    }
                }
            }
        }
    },
    adoptableSimpleTweetFromTwitterElement: function(e) {
        var t = function(e) {
            var t = this.contentDocument.createElement("div"),
                n = this.contentDocument.createTextNode(e);
            return t.appendChild(n), t.innerHTML
        }.bind(this);
        let n = null,
            i = e.originalElement;
        if ("iframe" === normalizedElementTagName(e) ? n = i.contentDocument ? i.contentDocument.documentElement : null : "twitter-widget" === normalizedElementTagName(e) && (n = i.shadowRoot), !n)
            return null;
        var r = n.querySelector("[data-tweet-id].expanded") || n.querySelector("[data-tweet-id]");
        if (!r)
            return null;
        var a = this.contentDocument.createElement("div");
        a.classList.add("tweet-wrapper");
        var l = this.contentDocument.createElement("blockquote");
        l.classList.add("simple-tweet"), a.appendChild(l);
        var o = r.getAttribute("data-tweet-id");
        a.setAttribute("data-reader-tweet-id", o);
        var s = r.querySelector(".dateline"),
            c = r.querySelector('[data-scribe="element:screen_name"]'),
            m = r.querySelector('[data-scribe="element:name"]'),
            d = r.querySelector(".e-entry-title");
        if (!(s && c && m && d))
            return a;
        var h = "&mdash; " + t(m.innerText) + " (" + t(c.innerText) + ")",
            u = this.contentDocument.createElement("p");
        u.innerHTML = d.innerHTML, l.appendChild(u), l.insertAdjacentHTML("beforeend", h);
        var g = this.contentDocument.createElement("span");
        g.innerHTML = s.innerHTML, l.appendChild(g);
        for (let e of l.querySelectorAll("img.twitter-emoji"))
            this.replaceImageWithAltText(e);
        for (var f = l.getElementsByTagName("*"), p = f.length, E = 0; E < p; ++E) {
            var e = f[E];
            "script" === normalizedElementTagName(e) ? e.remove() : sanitizeElementByRemovingAttributes(e)
        }
        return a
    },
    replaceImageWithAltText: function(e) {
        var t = e.getAttribute("alt");
        if (!t || t.length < 1)
            return null;
        let n = this.contentDocument.createElement("span");
        return n.innerText = t, e.parentNode.replaceChild(n, e), n
    },
    leadingVideoNode: function() {
        var e = this.leadingContentNodeWithSelector("video, iframe");
        return e && e.parentElement && !e.previousElementSibling && !e.nextElementSibling ? e.parentElement : null
    },
    leadingImageNode: function() {
        return this.leadingContentNodeWithSelector("figure img, img")
    },
    leadingContentNodeWithSelector: function(e) {
        const t = 250,
            n = .5,
            i = .9,
            r = 3;
        if (!this.article || !this.article.element)
            return null;
        for (var a = this.article.element, l = 0; l < r && a.parentNode; ++l) {
            a = a.parentNode;
            var o = a.querySelectorAll(e)[0];
            if (o && isElementVisible(o)) {
                var s = cachedElementBoundingRect(o);
                if (!(s.width >= window.innerWidth * i) && s.height < t)
                    continue;
                if (s.width < this._articleWidth * n)
                    continue;
                var c = this.article.element.compareDocumentPosition(o);
                if (!(c & Node.DOCUMENT_POSITION_PRECEDING) || c & Node.DOCUMENT_POSITION_CONTAINED_BY)
                    continue;
                var m = this.extraArticle ? this.extraArticle.element : null;
                if (m && this.article.element.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING && (c = m.compareDocumentPosition(o)) && (!(c & Node.DOCUMENT_POSITION_PRECEDING) || c & Node.DOCUMENT_POSITION_CONTAINED_BY))
                    continue;
                return o
            }
        }
        return null
    },
    pageImageURLFromMetadata: function(e) {
        var t = e["property:og:image"];
        if (t || (t = e["property:twitter:image"]), t || (t = e["property:twitter:image:src"]), t) {
            let e = urlFromString(t);
            if (e) {
                let n = e.href;
                n && urlIsHTTPFamilyProtocol(e) && (t = n)
            }
        }
        return t
    },
    mainImageNode: function() {
        var e = this.leadingImageNode();
        if (e)
            return e;
        if (this.article && this.article.element)
            for (var t = this.article.element.querySelectorAll("img"), n = t.length, i = 0; i < n; ++i) {
                var r = t[i],
                    a = r._cachedElementBoundingRect;
                if (a || (a = r.getBoundingClientRect()), a.width >= MainImageMinimumWidthAndHeight && a.height >= MainImageMinimumWidthAndHeight)
                    return r
            }
        return null
    },
    schemaDotOrgMetadataObjectForArticle: function() {
        if (this._schemaDotOrgMetadataObjectForArticle)
            return this._schemaDotOrgMetadataObjectForArticle;
        const e = new Set(["Article", "NewsArticle", "Report", "ScholarlyArticle", "SocialMediaPosting", "BlogPosting", "LiveBlogPosting", "DiscussionForumPosting", "TechArticle", "APIReference"]);
        var t = this.contentDocument.querySelectorAll("script[type='application/ld+json']"),
            n = t.length;
        try {
            for (var i = 0; i < n; ++i) {
                var r = t[i],
                    a = JSON.parse(r.textContent),
                    l = a["@context"];
                if ("https://schema.org" === l || "http://schema.org" === l) {
                    var o = a["@type"];
                    if (e.has(o))
                        return this._schemaDotOrgMetadataObjectForArticle = a, a
                }
            }
            return null
        } catch (e) {
            return null
        }
    },
    articleTitle: function() {
        var e = this.articleTitleInformation();
        return e ? e.titleText : ""
    },
    articleTitleInformation: function() {
        function e(e, t) {
            var n = e ? t.indexOf(e) : -1;
            return -1 !== n && (0 === n || n + e.length === t.length)
        }
        function t(e, t) {
            return e.host === t.host && e.pathname === t.pathname && e.hash === t.hash
        }
        function n(e) {
            return nearestAncestorElementWithTagName(e, "a") || e.querySelector("a")
        }
        if (this.articleNode()) {
            if (this._articleTitleInformation)
                return this._articleTitleInformation;
            const Ce = /((article|post).*title|headline|instapaper_title|inside-head)/i,
                De = 600,
                Ie = 20,
                Le = 8,
                Me = 1.1,
                Re = 1.25,
                Fe = /header|title|headline|instapaper_title/i,
                we = 1.5,
                _e = 1.8,
                Pe = 1.5,
                Be = .6,
                Oe = 3,
                ke = 1.5,
                qe = .8,
                We = .8,
                ze = 9,
                He = 1.5,
                Ue = /byline|author/i;
            var i = function(e, t) {
                    var n = this.contentFromUniqueMetadataSelector(e, t);
                    if (n) {
                        var i = this.articleTitleAndSiteNameFromTitleString(n);
                        i && (n = i.articleTitle)
                    }
                    return n
                }.bind(this),
                r = function() {
                    for (var e = this.articleNode(); e; e = e.parentElement)
                        if (elementIndicatesItIsASchemaDotOrgArticleContainer(e))
                            return e;
                    return null
                }.bind(this)(),
                a = r ? this.contentFromUniqueMetadataSelector(r, "meta[itemprop=headline]") : "",
                l = r ? this.contentFromUniqueMetadataSelector(r, "meta[itemprop=alternativeHeadline]") : "",
                o = this.contentDocument,
                s = o.location,
                c = o.title,
                m = i(o, "meta[property='og:title']"),
                d = this.contentFromUniqueMetadataSelector(o, "meta[property='og:site_name']"),
                h = i(o, "meta[name='twitter:title']"),
                u = i(o, "meta[name='sailthru.headline']"),
                g = this.schemaDotOrgMetadataObjectForArticle(),
                f = g ? g.headline : null,
                p = this.articleNode(),
                E = cachedElementBoundingRect(p);
            this.extraArticleNode() && this.extraArticle.isPrepended && (E = cachedElementBoundingRect(this.extraArticleNode()));
            var v = E.left + E.width / 2,
                T = E.top,
                y = T;
            if (this._articleWidth = E.width, this._leadingMediaElement = this.leadingImageNode(), this._leadingMediaElement || (this._leadingMediaElement = this.leadingVideoNode()), this._leadingMediaElement) {
                y = (cachedElementBoundingRect(this._leadingMediaElement).top + T) / 2
            }
            var N = "h1, h2, h3, h4, h5, a:not(svg a), p, div, span",
                A = normalizedElementTagName(this.article.element);
            "dl" !== A && "dd" !== A || (N += ", dt");
            for (var S = [], b = o.querySelectorAll(N), x = b.length, C = 0; C < x; ++C) {
                var D = b[C],
                    I = normalizedElementTagName(D);
                if ("a" === I)
                    D.innerText === m && t(D, s) && (D.previousElementSibling || D.nextElementSibling ? S.push(D) : S.push(D.parentElement));
                else if ("div" === I || "span" === I || "p" === I) {
                    if (hasClassMatchingRegexp(D, Ce) || Ce.test(D.getAttribute("id"))) {
                        var L = D.parentElement;
                        elementIsAHeader(L) || S.push(D)
                    }
                } else
                    S.push(D)
            }
            S = Array.prototype.slice.call(S, 0);
            const Ve = 2;
            for (var M = this.article.element, C = 0; C < Ve; ++C)
                M.parentElement && (M = M.parentElement);
            for (var R = M.querySelectorAll("a:not(svg a)"), C = 0, F = R.length; C < F; ++C) {
                var w = R[C];
                if (w.offsetTop > p.offsetTop + Ie)
                    break;
                if (t(w, s) && "#" !== w.getAttribute("href")) {
                    S.push(w);
                    break
                }
            }
            var _,
                P = S.map(trimmedInnerTextIgnoringTextTransform),
                B = S.length,
                O = 0,
                k = [],
                q = [],
                W = [],
                z = [],
                H = [],
                U = [],
                V = [];
            const je = {},
                Ge = e => {
                    const t = je[e];
                    if (t)
                        return t;
                    const n = stringSimilarity(c, e);
                    je[e] = n;
                    return n
                };
            for (var C = 0; C < B; ++C) {
                var j = S[C],
                    G = P[C];
                const e = {},
                    t = t => {
                        const n = e[t];
                        if (n)
                            return n;
                        const i = stringSimilarity(G, t);
                        e[t] = i;
                        return i
                    };
                let n = Ge(G);
                if (m) {
                    const e = t(m);
                    n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && q.push(j)
                }
                if (h) {
                    const e = t(h);
                    n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && W.push(j)
                }
                if (a) {
                    const e = t(a);
                    n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && z.push(j)
                }
                if (l) {
                    const e = t(l);
                    n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && H.push(j)
                }
                if (u) {
                    const e = t(u);
                    n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && U.push(j)
                }
                if (f) {
                    const e = t(f);
                    n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && V.push(j)
                }
                n === O ? k.push(j) : n > O && (O = n, k = [j])
            }
            if (1 === q.length ? (_ = q[0], _.headerText = trimmedInnerTextIgnoringTextTransform(_)) : 1 === W.length ? (_ = W[0], _.headerText = trimmedInnerTextIgnoringTextTransform(_)) : 1 === z.length ? (_ = z[0], _.headerText = trimmedInnerTextIgnoringTextTransform(_)) : 1 === U.length ? (_ = U[0], _.headerText = trimmedInnerTextIgnoringTextTransform(_)) : 1 === V.length && (_ = V[0], _.headerText = trimmedInnerTextIgnoringTextTransform(_)), !_)
                for (var C = 0; C < B; ++C) {
                    var j = S[C];
                    if (isElementVisible(j)) {
                        var X = cachedElementBoundingRect(j),
                            Y = X.left + X.width / 2,
                            K = X.top + X.height / 2,
                            J = Y - v,
                            Q = K - y,
                            $ = -1 !== q.indexOf(j),
                            Z = -1 !== W.indexOf(j),
                            ee = j.classList.contains("instapaper_title"),
                            te = /\bheadline\b/.test(j.getAttribute("itemprop")),
                            ne = -1 !== z.indexOf(j),
                            ie = -1 !== H.indexOf(j),
                            re = -1 !== U.indexOf(j),
                            ae = -1 !== V.indexOf(j),
                            le = $ || Z || ee || te || ne || ie || re || ae,
                            oe = Math.sqrt(J * J + Q * Q),
                            se = le ? De : Math.max(De - oe, 0),
                            G = P[C],
                            ce = j.getAttribute("property");
                        if (ce) {
                            var me = /dc.title/i.exec(ce);
                            if (me && me[0]) {
                                var de = this.contentDocument.querySelectorAll('*[property~="' + me[0] + '"]');
                                if (1 === de.length) {
                                    _ = j, _.headerText = G;
                                    break
                                }
                            }
                        }
                        if (!Ue.test(j.className)) {
                            if (!le) {
                                if (oe > De)
                                    continue;
                                if (Y < E.left || Y > E.right)
                                    continue
                            }
                            if (c && stringsAreNearlyIdentical(G, c))
                                se *= Oe;
                            else if (e(G, c))
                                se *= ke;
                            else if (G.length < Le)
                                continue;
                            if (G !== d || !m) {
                                var he = !1,
                                    ue = n(j);
                                if (ue) {
                                    if ("author" === ue.getAttribute("rel"))
                                        continue;
                                    var ge = ue.host === s.host,
                                        fe = ue.pathname === s.pathname;
                                    if (ge && fe)
                                        se *= Pe;
                                    else {
                                        if (ge && nearestAncestorElementWithTagName(j, "li"))
                                            continue;
                                        se *= Be, he = !0
                                    }
                                }
                                var pe = fontSizeFromComputedStyle(getComputedStyle(j));
                                he || (se *= pe / BaseFontSize), se *= 1 + TitleCandidateDepthScoreMultiplier * elementDepth(j);
                                var Ee = parseInt(this.contentTextStyle().fontSize);
                                parseInt(pe) > Ee * Me && (se *= Re), (Fe.test(j.className) || Fe.test(j.getAttribute("id"))) && (se *= we);
                                var ve = j.parentElement;
                                ve && (Fe.test(ve.className) || Fe.test(ve.getAttribute("id"))) && (se *= we), -1 !== k.indexOf(j) && (se *= _e);
                                for (var p = this.article.element, Te = j; Te && Te !== p; Te = Te.parentElement)
                                    if (SidebarRegex.test(Te.className)) {
                                        se *= qe;
                                        break
                                    }
                                j.closest("li") && (se *= We), (!_ || se > _.headerScore) && (_ = j, _.headerScore = se, _.headerText = G)
                            }
                        }
                    }
                }
            _ && domDistance(_, p, ze + 1) > ze && parseInt(getComputedStyle(_).fontSize) < He * Ee && (_ = null);
            var ye;
            if (_) {
                this._articleTitleElement = _;
                var Ne = _.headerText.trim();
                ye = m && e(m, Ne) ? m : c && e(c, Ne) ? c : Ne
            }
            ye || (ye = m && e(m, c) ? m : c);
            var Ae = null,
                Se = !1,
                be = !1;
            if (_) {
                var ue = n(_);
                ue && (Ae = ue.href, Se = "_blank" === ue.getAttribute("target"), be = ue.host !== s.host || ue.pathname !== s.pathname)
            }
            var xe = {
                titleText: ye,
                linkURL: Ae,
                linkIsTargetBlank: Se,
                linkIsForExternalPage: be
            };
            return this._articleTitleInformation = xe, xe
        }
    },
    contentFromUniqueMetadataSelector: function(e, t) {
        var n = e.querySelectorAll(t);
        if (1 !== n.length)
            return null;
        var i = n[0];
        return i ? this.elementAttributesContainImproperQuote(i) ? null : i.content : null
    },
    elementAttributesContainImproperQuote: function(e) {
        for (var t = attributesForElement(e), n = t.length, i = 0; i < n; ++i)
            if (/['"]/.test(t[i].name))
                return !0;
        return !1
    },
    articleSubhead: function() {
        function e(e) {
            return elementIsAHeader(e) ? parseInt(/h(\d)?/.exec(normalizedElementTagName(e))[1]) : NaN
        }
        function t(e) {
            if (!e)
                return null;
            var t = e.content;
            return t ? t.trim() : null
        }
        const n = /author|kicker/i,
            i = /sub(head|title)|description|dec?k|abstract/i;
        if (this._articleSubhead)
            return this._articleSubhead;
        var r = this.articleNode();
        if (r) {
            var a = this._articleTitleElement;
            if (a) {
                var l = this.contentDocument,
                    o = l.location,
                    s = e(a),
                    c = cachedElementBoundingRect(a),
                    m = new Set,
                    d = l.querySelector("meta[property='og:description']"),
                    h = t(d);
                h && m.add(h);
                var u = l.querySelector("meta[name=description]"),
                    g = t(u);
                g && m.add(g);
                var f = this.schemaDotOrgMetadataObjectForArticle();
                if (f) {
                    var p = f.description;
                    p && "string" == typeof p && m.add(p.trim())
                }
                var E,
                    v = this.contentFromUniqueMetadataSelector(l, "head meta.swiftype[name=dek]");
                v && (E = v);
                var T = [nextNonFloatingVisibleElementSibling(a), nextLeafElementForElement(a)];
                if (m.size)
                    for (var y = l.querySelectorAll(HeaderElementsSelector + ", *[itemprop=description]"), N = y.length, A = 0; A < N; ++A) {
                        var S = y[A];
                        m.has(S.innerText.trim()) && T.push(S)
                    }
                for (var b = T.length, A = 0; A < b; ++A) {
                    var x = T[A];
                    if (x && x !== r) {
                        var C = x.className;
                        if (!n.test(C)) {
                            var D = x.closest("a");
                            if (D) {
                                var I = D.host === o.host,
                                    L = D.pathname === o.pathname;
                                if (!I || !L)
                                    continue
                            }
                            var M = !1;
                            if (elementIsAHeader(x))
                                if (isNaN(s))
                                    M = !0;
                                else {
                                    var R = e(x);
                                    R - 1 === s && (M = !0)
                                }
                            if (!M && i.test(C) && (M = !0), !M) {
                                const e = x.getAttribute("itemprop");
                                /\bdescription\b/.test(e) && !/\barticleBody\b/.test(e) && (M = !0)
                            }
                            if (!M && m.has(x.innerText) && (M = !0), !M && E && E === x.innerText && (M = !0), M || "summary" !== x.getAttribute("itemprop") || (M = !0), M) {
                                var F;
                                if ("meta" === normalizedElementTagName(x)) {
                                    var w = x.getAttribute("content");
                                    F = w ? w.trim() : "";
                                    var _ = x.nextElementSibling;
                                    if (!_ || trimmedInnerTextIgnoringTextTransform(_) !== F)
                                        continue;
                                    x = _
                                } else {
                                    if (cachedElementBoundingRect(x).top < (c.bottom + c.top) / 2)
                                        continue;
                                    F = trimmedInnerTextIgnoringTextTransform(x).trim()
                                }
                                if (F.length) {
                                    this._articleSubheadElement = x, this._articleSubhead = F;
                                    break
                                }
                            }
                        }
                    }
                }
                return this._articleSubhead
            }
        }
    },
    adoptableMetadataBlock: function() {
        function e(e) {
            function t(e, i) {
                if (e.nodeType === Node.TEXT_NODE)
                    return void (i === n.Left ? e.textContent = e.textContent.trimLeft() : i === n.Right ? e.textContent = e.textContent.trimRight() : e.textContent = e.textContent.trim());
                if (e.nodeType === Node.ELEMENT_NODE) {
                    var r = e.childNodes,
                        a = r.length;
                    if (0 !== a) {
                        if (1 === a)
                            return void t(r[0], i);
                        i !== n.Right && t(r[0], n.Left), i !== n.Left && t(r[a - 1], n.Right)
                    }
                }
            }
            const n = {
                Left: 1,
                Right: 2,
                Both: 3
            };
            t(e)
        }
        this.updateArticleBylineAndDateElementsIfNecessary();
        var t = this.articleBylineElement(),
            n = this.articleDateElement();
        if (!t && !n)
            return null;
        if (t && n) {
            var i = t.compareDocumentPosition(n);
            i & Node.DOCUMENT_POSITION_CONTAINS && (t = null), i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = null), t === n && (n = null)
        }
        var r,
            a = this.contentDocument.createElement("div"),
            l = !1,
            o = !1;
        if (t) {
            var r = this.cleanArticleNode(t, t.cloneNode(!0), CleaningType.MetadataContent, !1);
            e(r), r.innerText.trim() && (l = !0, r.classList.add("byline"))
        }
        if (n) {
            var s = this.cleanArticleNode(n, n.cloneNode(!0), CleaningType.MetadataContent, !1);
            e(s), s.innerText.trim() && (o = !0, s.classList.add("date"))
        }
        if (l && a.appendChild(r), l && o) {
            var c = document.createElement("span");
            c.classList.add("delimiter"), a.appendChild(c)
        }
        return o && a.appendChild(s), a
    },
    articleBylineElement: function() {
        return this._articleBylineElement
    },
    findArticleBylineElement: function() {
        var e = this.findArticleBylineElementWithoutRejection();
        return e && ("footer" === normalizedElementTagName(e) || e.closest("figure")) ? null : e
    },
    findArticleBylineElementWithoutRejection: function() {
        function e(e) {
            if (!e.length)
                return null;
            e = e.filter(isElementVisible);
            for (var t = new Set, n = new Set, i = e.length, o = 0; o < i - 1; ++o) {
                var s = e[o],
                    c = e[o + 1];
                if (isElementVisible(s) && isElementVisible(c)) {
                    var m = s.parentElement;
                    m === c.parentElement && (m.contains(l) || (n.add(s.parentElement), t.add(s), t.add(c)))
                }
            }
            var d = new Set(e);
            n.forEach(function(e) {
                d.add(e)
            }), t.forEach(function(e) {
                d["delete"](e)
            }), e = [], d.forEach(function(t) {
                e.push(t)
            });
            var h,
                u = null;
            i = e.length;
            for (var o = 0; o < i; ++o) {
                var s = e[o];
                if (isElementVisible(s)) {
                    var g = cachedElementBoundingRect(s),
                        f = g.left + g.width / 2,
                        p = g.top + g.height / 2,
                        E = r - f,
                        v = a - p,
                        T = Math.sqrt(E * E + v * v);
                    (!u || T < h) && (u = s, h = T)
                }
            }
            return u
        }
        const t = "[itemprop~=author], a[rel='author']:not(svg a)",
            n = "#byline, .byline, .article-byline, .byline__author, .entry-meta, .author-name, .byline-dateline, .article-author, [itemprop~=author], a[rel='author']:not(svg a)";
        var i,
            r,
            a,
            l = this._articleSubheadElement || this._articleTitleElement;
        if (l)
            var i = l ? cachedElementBoundingRect(l) : null,
                r = i.left + i.width / 2,
                a = i.top + i.height / 2;
        var o = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[name=author]");
        if (o || (o = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[property=author]")), !o) {
            var s = this.schemaDotOrgMetadataObjectForArticle();
            if (s) {
                var c = s.author;
                c && "object" == typeof c && (o = c.name)
            }
        }
        var m = this.article.element,
            d = m.querySelectorAll(n);
        if (1 === d.length)
            return d[0];
        var h = l ? l.nextElementSibling : null;
        if (h) {
            if (h.matches(n) || h.innerText === o || (h = h.querySelector(n)), h) {
                if (h.querySelector("li")) {
                    var u = h.querySelector(n);
                    u && (h = u)
                }
            }
            if (h)
                return h
        }
        for (var g = this.contentDocument.getElementsByTagName("a"), f = 0, p = g.length; f < p; ++f) {
            var E = g[f];
            if (trimmedInnerTextIgnoringTextTransform(E) === o)
                return E
        }
        var v = m.closest("article");
        if (l && v) {
            var T = Array.from(v.querySelectorAll(t)),
                y = e(T);
            if (y)
                return y;
            if (T = Array.from(v.querySelectorAll(n)), y = e(T))
                return y
        }
        var N = m.previousElementSibling;
        if (N) {
            var T = Array.from(N.querySelectorAll(t)),
                y = e(T);
            if (y)
                return y;
            if (T = Array.from(N.querySelectorAll(n)), y = e(T))
                return y
        }
        return null
    },
    articleDateElement: function() {
        return this._articleDateElement
    },
    findArticleDateElement: function() {
        function e(e) {
            for (var t = e; t && t !== a; t = t.parentElement)
                if (elementIsCommentBlock(t))
                    return !0;
            return !1
        }
        function t(t) {
            for (var n, i = null, r = t.length, a = 0; a < r; ++a) {
                var l = t[a];
                if (isElementVisible(l) && !e(l)) {
                    var o = cachedElementBoundingRect(l),
                        m = o.left + o.width / 2,
                        d = o.top + o.height / 2,
                        h = s - m,
                        u = c - d,
                        g = Math.sqrt(h * h + u * u);
                    (!i || g < n) && (i = l, n = g)
                }
            }
            return i
        }
        const n = /date/i,
            i = "time, .dateline, .entry-date";
        var r = this._articleSubheadElement || this._articleTitleElement,
            a = this.article.element,
            l = r ? r.nextElementSibling : null;
        if (l && (m = l.querySelectorAll(i), 1 === m.length && (l = m[0])), !l || l.matches(i) || hasClassMatchingRegexp(l, n) || l.querySelector(i) || (l = null), l && l.contains(a) && (l = null), l)
            return l;
        var o,
            s,
            c;
        if (r)
            var o = r ? cachedElementBoundingRect(r) : null,
                s = o.left + o.width / 2,
                c = o.top + o.height / 2;
        var m = a.querySelectorAll(i);
        if (m.length)
            return t(m);
        if (a = a.closest("article")) {
            var m = a.querySelectorAll(i);
            if (m.length)
                return t(m)
        }
        return null
    },
    articleDateElementWithBylineElementHint: function(e) {
        function t(e) {
            return /date/.test(e.className) || /\bdatePublished\b/.test(e.getAttribute("itemprop"))
        }
        var n = e.nextElementSibling;
        if (n && t(n))
            return n;
        var i = nextLeafElementForElement(e);
        return i && t(i) ? i : null
    },
    updateArticleBylineAndDateElementsIfNecessary: function() {
        this._didArticleBylineAndDateElementDetection || (this.updateArticleBylineAndDateElements(), this._didArticleBylineAndDateElementDetection = !0)
    },
    updateArticleBylineAndDateElements: function() {
        var e = this.findArticleBylineElement(),
            t = this.findArticleDateElement();
        !t && e && (t = this.articleDateElementWithBylineElementHint(e)), this._articleDateElement = t, this._articleBylineElement = e
    },
    articleIsLTR: function() {
        if (!this._articleIsLTR) {
            var e = getComputedStyle(this.article.element);
            this._articleIsLTR = !e || "ltr" === e.direction
        }
        return this._articleIsLTR
    },
    findSuggestedCandidate: function() {
        var e = this.suggestedRouteToArticle;
        if (!e || !e.length)
            return null;
        var t,
            n;
        for (n = e.length - 1; n >= 0 && (!e[n].id || !(t = this.contentDocument.getElementById(e[n].id))); --n)
            ;
        for (n++, t || (t = this.contentDocument); n < e.length;) {
            for (var i = e[n], r = t.nodeType === Node.DOCUMENT_NODE ? t.documentElement : t.firstElementChild, a = 1; r && a < i.index; r = r.nextElementSibling)
                this.shouldIgnoreInRouteComputation(r) || a++;
            if (!r)
                return null;
            if (normalizedElementTagName(r) !== normalizedElementTagName(i))
                return null;
            if (i.className && r.className !== i.className)
                return null;
            t = r, n++
        }
        return isElementVisible(t) ? new CandidateElement(t, this.contentDocument) : null
    },
    findArticleBySearchingAllElements: function(e) {
        var t = this.findSuggestedCandidate(),
            n = this.findCandidateElements();
        if (!n || !n.length)
            return t;
        if (t && t.basicScore() >= ReaderMinimumScore)
            return t;
        for (var i = this.highestScoringCandidateFromCandidates(n), r = i.element; r !== this.contentDocument; r = r.parentNode)
            if ("blockquote" === normalizedElementTagName(r)) {
                for (var a = r.parentNode, l = n.length, o = 0; o < l; ++o) {
                    var s = n[o];
                    if (s.element === a) {
                        i = s;
                        break
                    }
                }
                break
            }
        if (t && i.finalScore() < ReaderMinimumScore)
            return t;
        if (!e) {
            if (i.shouldDisqualifyDueToScoreDensity())
                return null;
            if (i.shouldDisqualifyDueToHorizontalRuleDensity())
                return null;
            if (i.shouldDisqualifyDueToHeaderDensity())
                return null;
            if (i.shouldDisqualifyDueToSimilarElements(n))
                return null
        }
        return i
    },
    findExtraArticle: function() {
        if (!this.article)
            return null;
        for (var e = 0, t = this.article.element; e < 3 && t; ++e, t = t.parentNode) {
            var n = this.findExtraArticleCandidateElements(t);
            if (n && n.length)
                for (var i, r = this.sortCandidateElementsInDescendingScoreOrder(n), a = 0; a < r.length && ((i = r[a]) && i.basicScore()); a++)
                    if (!i.shouldDisqualifyDueToScoreDensity() && !i.shouldDisqualifyDueToHorizontalRuleDensity() && !(i.shouldDisqualifyDueToHeaderDensity() || cachedElementBoundingRect(i.element).height < PrependedArticleCandidateMinimumHeight && cachedElementBoundingRect(this.article.element).width !== cachedElementBoundingRect(i.element).width)) {
                        var l = contentTextStyleForNode(this.contentDocument, i.element);
                        if (l && l.fontFamily === this.contentTextStyle().fontFamily && l.fontSize === this.contentTextStyle().fontSize && i)
                            return i
                    }
        }
        return null
    },
    highestScoringCandidateFromCandidates: function(e) {
        for (var t = 0, n = null, i = e.length, r = 0; r < i; ++r) {
            var a = e[r],
                l = a.basicScore();
            l >= t && (t = l, n = a)
        }
        return n
    },
    sortCandidateElementsInDescendingScoreOrder: function(e) {
        function t(e, t) {
            return e.basicScore() !== t.basicScore() ? t.basicScore() - e.basicScore() : t.depth() - e.depth()
        }
        return e.sort(t)
    },
    findCandidateElements: function() {
        const e = 1e3;
        for (var t = Date.now() + e, n = this.contentDocument.getElementsByTagName("*"), i = n.length, r = [], a = 0; a < i; ++a) {
            var l = n[a];
            if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(l))) {
                var o = CandidateElement.candidateIfElementIsViable(l, this.contentDocument);
                if (o && r.push(o), Date.now() > t) {
                    r = [];
                    break
                }
            }
        }
        for (var s = r.length, a = 0; a < s; ++a)
            r[a].element.candidateElement = r[a];
        for (var a = 0; a < s; ++a) {
            var c = r[a];
            if ("blockquote" === normalizedElementTagName(c.element)) {
                var m = c.element.parentElement.candidateElement;
                m && m.addTextNodesFromCandidateElement(c)
            }
        }
        for (var a = 0; a < s; ++a)
            r[a].element.candidateElement = null;
        return r
    },
    findExtraArticleCandidateElements: function(e) {
        if (!this.article)
            return [];
        e || (e = this.article.element);
        for (var t = "preceding-sibling::*/descendant-or-self::*", n = this.contentDocument.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = n.snapshotLength, r = [], a = 0; a < i; ++a) {
            var l = n.snapshotItem(a);
            if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(l))) {
                var o = CandidateElement.extraArticleCandidateIfElementIsViable(l, this.article, this.contentDocument, !0);
                o && r.push(o)
            }
        }
        t = "following-sibling::*/descendant-or-self::*", n = this.contentDocument.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = n.snapshotLength;
        for (var a = 0; a < i; ++a) {
            var l = n.snapshotItem(a);
            if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(l))) {
                var o = CandidateElement.extraArticleCandidateIfElementIsViable(l, this.article, this.contentDocument, !1);
                o && r.push(o)
            }
        }
        return r
    },
    isGeneratedBy: function(e) {
        var t = this.contentDocument.head ? this.contentDocument.head.querySelector("meta[name=generator]") : null;
        if (!t)
            return !1;
        var n = t.content;
        return !!n && e.test(n)
    },
    isMediaWikiPage: function() {
        return this._isMediaWikiPage === undefined && (this._isMediaWikiPage = this.isGeneratedBy(/^MediaWiki /)), this._isMediaWikiPage
    },
    isWordPressSite: function() {
        return this.isGeneratedBy(/^WordPress/)
    },
    isAMPPage: function() {
        return this.contentDocument.documentElement.hasAttribute("amp-version")
    },
    nextPageURLString: function() {
        if (!this.article)
            return null;
        if (this.isMediaWikiPage())
            return null;
        var e,
            t = 0,
            n = this.article.element;
        n.parentNode && "inline" === getComputedStyle(n).display && (n = n.parentNode);
        for (var i = n, r = cachedElementBoundingRect(n).bottom + LinkMaxVerticalDistanceFromArticle; isElementNode(i) && cachedElementBoundingRect(i).bottom <= r;)
            i = i.parentNode;
        i === n || i !== this.contentDocument && !isElementNode(i) || (n = i);
        var a = this.contentDocument.evaluate(LinkCandidateXPathQuery, n, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
            l = a.snapshotLength;
        if (this.pageNumber <= 2 && !this.prefixWithDateForNextPageURL) {
            var o = this.contentDocument.location.pathname,
                s = o.match(LinkDateRegex);
            s && (s = s[0], this.prefixWithDateForNextPageURL = o.substring(0, o.indexOf(s) + s.length))
        }
        for (var c = 0; c < l; ++c) {
            var m = a.snapshotItem(c),
                d = this.scoreNextPageLinkCandidate(m);
            d > t && (e = m, t = d)
        }
        return e ? e.href : null
    },
    scoreNextPageLinkCandidate: function(e) {
        function t(e, t, n, i) {
            t.substring(0, e.length) === e && (t = t.substring(e.length), e = "");
            var r = t.lastInteger();
            if (isNaN(r))
                return !1;
            var a = e ? e.lastInteger() : NaN;
            return (isNaN(a) || a >= MaximumExactIntegralValue) && (a = i), r === a ? n.lastInteger() === a + 1 : r === a + 1
        }
        function n(e) {
            for (var t = {}, n = e.substring(1).split("&"), i = n.length, r = 0; r < i; ++r) {
                var a = n[r],
                    l = a.indexOf("=");
                -1 === l ? t[a] = null : t[a.substring(0, l)] = a.substring(l + 1)
            }
            return t
        }
        var i = this.contentDocument.location;
        if (e.host !== i.host)
            return 0;
        if (e.pathname === i.pathname && e.search === i.search)
            return 0;
        if (-1 !== e.toString().indexOf("#"))
            return 0;
        if (anchorLinksToAttachment(e) || anchorLinksToTagOrCategoryPage(e))
            return 0;
        if (!isElementVisible(e))
            return 0;
        var r = cachedElementBoundingRect(e),
            a = this.articleBoundingRect(),
            l = Math.max(0, Math.max(a.top - (r.top + r.height), r.top - (a.top + a.height)));
        if (r.top < a.top)
            return 0;
        if (l > LinkMaxVerticalDistanceFromArticle)
            return 0;
        if (Math.max(0, Math.max(a.left - (r.left + r.width), r.left - (a.left + a.width))) > 0)
            return 0;
        var o = i.pathname,
            s = e.pathname;
        if (this.prefixWithDateForNextPageURL) {
            if (-1 === e.pathname.indexOf(this.prefixWithDateForNextPageURL))
                return 0;
            o = o.substring(this.prefixWithDateForNextPageURL.length), s = s.substring(this.prefixWithDateForNextPageURL.length)
        }
        var c = s.substring(1).split("/");
        c[c.length - 1] || c.pop();
        var m = c.length,
            d = o.substring(1).split("/"),
            h = !1;
        d[d.length - 1] || (h = !0, d.pop());
        var u = d.length;
        if (m < u)
            return 0;
        for (var g = 0, f = 0, p = e.textContent, E = 0; E < m; ++E) {
            var v = c[E],
                T = E < u ? d[E] : "";
            if (T !== v) {
                if (E < u - 2)
                    return 0;
                if (v.length >= T.length) {
                    for (var y = 0; v[v.length - 1 - y] === T[T.length - 1 - y];)
                        y++;
                    y && (v = v.substring(0, v.length - y), T = T.substring(0, T.length - y));
                    var N = v.indexOf(T);
                    -1 !== N && (v = v.substring(N))
                }
                t(T, v, p, this.pageNumber) ? f = Math.pow(LinkNextOrdinalValueBase, E - m + 1) : g++
            }
            if (g > 1)
                return 0
        }
        var A = !1;
        if (e.search) {
            linkParameters = n(e.search), referenceParameters = n(i.search);
            for (var S in linkParameters) {
                var b = linkParameters[S],
                    x = S in referenceParameters ? referenceParameters[S] : null;
                if (x !== b)
                    if (null === x && (x = ""), null === b && (b = ""), b.length < x.length)
                        g++;
                    else if (t(x, b, p, this.pageNumber)) {
                        if (LinkURLSearchParameterKeyMatchRegex.test(S)) {
                            if (o.toLowerCase() !== s.toLowerCase())
                                return 0;
                            if (this.isWordPressSite() && h)
                                return 0;
                            A = !0
                        }
                        if (LinkURLBadSearchParameterKeyMatchRegex.test(S)) {
                            g++;
                            continue
                        }
                        f = Math.max(f, 1 / LinkNextOrdinalValueBase)
                    } else
                        g++
            }
        }
        if (!f)
            return 0;
        if ((LinkURLPageSlashNumberMatchRegex.test(e.href) || LinkURLSlashDigitEndMatchRegex.test(e.href)) && (A = !0), !A && m === u && stringSimilarity(o, s) < LinkMinimumURLSimilarityRatio)
            return 0;
        if (LinkURLArchiveSlashDigitEndMatchRegex.test(e))
            return 0;
        var C = LinkMatchWeight * (Math.pow(LinkMismatchValueBase, -g) + f) + LinkVerticalDistanceFromArticleWeight * l / LinkMaxVerticalDistanceFromArticle;
        A && (C += LinkURLSemanticMatchBonus), "li" === normalizedElementTagName(e.parentNode) && (C += LinkListItemBonus);
        var p = e.innerText;
        return LinkNextMatchRegEx.test(p) && (C += LinkNextMatchBonus), LinkPageMatchRegEx.test(p) && (C += LinkPageMatchBonus), LinkContinueMatchRegEx.test(p) && (C += LinkContinueMatchBonus), C
    },
    elementContainsEnoughTextOfSameStyle: function(e, t, n) {
        const i = 110;
        var r = "body" === normalizedElementTagName(e),
            a = r ? 2 : 3,
            l = getVisibleNonWhitespaceTextNodes(e, a, i, r, t);
        const o = .2,
            s = clamp(scoreMultiplierForElementTagNameAndAttributes(e), o, Infinity),
            c = n / s / languageScoreMultiplierForTextNodes(l);
        for (var m = {}, d = l.length, h = 0; h < d; ++h) {
            var u = l[h],
                g = u.length,
                f = u.parentElement,
                p = window.getComputedStyle(f),
                E = p.fontFamily + "|" + p.fontSize,
                v = Math.pow(g, TextNodeLengthPower);
            if (m[E]) {
                if ((m[E] += v) > c)
                    break
            } else
                m[E] = v
        }
        for (var E in m)
            if (m[E] > c)
                return !0;
        return !1
    },
    openGraphMetadataClaimsPageTypeIsArticle: function() {
        if (!this._openGraphMetadataClaimsPageTypeIsArticle) {
            var e = this.contentDocument.querySelector("head meta[property='og:type']");
            this._openGraphMetadataClaimsPageTypeIsArticle = e && "article" === e.content
        }
        return this._openGraphMetadataClaimsPageTypeIsArticle
    },
    prismGenreClaimsPageIsHomepage: function() {
        return "homePage" === this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[name='prism.genre']")
    },
    pointsToUseForHitTesting: function() {
        const e = window.innerWidth,
            t = e / 4,
            n = e / 2,
            i = 128,
            r = 320;
        var a = [[n, 800], [n, 600], [t, 800], [n, 400], [n - i, 1100], [r, 700], [3 * t, 800], [e - r, 700]];
        return this.openGraphMetadataClaimsPageTypeIsArticle() && a.push([n - i, 1400]), a
    },
    findArticleByVisualExamination: function() {
        for (var e = new Set, t = this.pointsToUseForHitTesting(), n = t.length, i = AppleDotComAndSubdomainsRegex.test(this.contentDocument.location.hostname.toLowerCase()) ? 7200 : 1800, r = this.candidateElementFilter, a = 0; a < n; a++)
            for (var l = t[a][0], o = t[a][1], s = elementAtPoint(l, o), c = s; c && !e.has(c); c = c.parentElement) {
                if (VeryPositiveClassNameRegEx.test(c.className))
                    return new CandidateElement(c, this.contentDocument);
                if (!SetOfCandidateTagNamesToIgnore.has(normalizedElementTagName(c))) {
                    var m = c.offsetWidth,
                        d = c.offsetHeight;
                    if (!m && !d) {
                        var h = cachedElementBoundingRect(c);
                        m = h.width, d = h.height
                    }
                    if (!(m < r.minimumWidth || d < r.minimumHeight || m * d < r.minimumArea)) {
                        var u = this.elementContainsEnoughTextOfSameStyle(c, e, i);
                        if (e.add(c), u && !(CandidateElement.candidateElementAdjustedHeight(c) < r.minimumHeight)) {
                            var g = new CandidateElement(c, this.contentDocument);
                            if (!g.shouldDisqualifyDueToSimilarElements()) {
                                if (g.shouldDisqualifyDueToHorizontalRuleDensity())
                                    return null;
                                if (g.shouldDisqualifyDueToHeaderDensity())
                                    return null;
                                if (!g.shouldDisqualifyForDeepLinking())
                                    return g
                            }
                        }
                    }
                }
            }
        return null
    },
    findArticleFromMetadata: function(e) {
        var t = this.contentDocument.querySelectorAll(SchemaDotOrgArticleContainerSelector);
        if (1 === t.length) {
            var n = t[0];
            if (n.matches("article, *[itemprop=articleBody]")) {
                var i = CandidateElement.candidateIfElementIsViable(n, this.contentDocument, !0);
                if (i)
                    return e === FindArticleMode.ExistenceOfElement || i
            }
            var r = n.querySelectorAll("article, *[itemprop=articleBody]"),
                a = elementWithLargestAreaFromElements(r);
            if (a) {
                var i = CandidateElement.candidateIfElementIsViable(a, this.contentDocument, !0);
                if (i)
                    return e === FindArticleMode.ExistenceOfElement || i
            }
            return new CandidateElement(n, this.contentDocument)
        }
        if (this.openGraphMetadataClaimsPageTypeIsArticle() && !this.prismGenreClaimsPageIsHomepage()) {
            var l = this.contentDocument.querySelectorAll("main article"),
                o = elementWithLargestAreaFromElements(l);
            if (o) {
                var i = CandidateElement.candidateIfElementIsViable(o, this.contentDocument, !0);
                if (i)
                    return e === FindArticleMode.ExistenceOfElement || i
            }
            var s = this.contentDocument.querySelectorAll("article");
            if (1 === s.length) {
                var i = CandidateElement.candidateIfElementIsViable(s[0], this.contentDocument, !0);
                if (i)
                    return e === FindArticleMode.ExistenceOfElement || i
            }
        }
        return null
    },
    articleTextContent: function() {
        return this._articleTextContent || this.adoptableArticle(), this._articleTextContent
    },
    unformattedArticleTextContentIncludingMetadata: function(e) {
        var t = this.articleNode();
        if (t) {
            if (!e)
                return t.innerText;
            var n = "",
                i = this.articleTitle();
            i && (n += i + "\n");
            var r = this.articleSubhead();
            r && (n += r + "\n");
            var a = this.adoptableMetadataBlock();
            return a && (n += this.plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements(a) + "\n"), n + t.innerText
        }
    },
    plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements: function(e) {
        var t = this.contentDocument.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null),
            n = "";
        for (t.currentNode = e; t.nextNode();) {
            var i = t.currentNode;
            if (i.nodeType !== Node.TEXT_NODE) {
                var r = normalizedElementTagName(i);
                "p" !== r && "div" !== r || (n += "\n")
            } else
                n += i.textContent
        }
        return n
    },
    pageDescription: function() {
        for (var e = this.contentDocument.querySelectorAll("head meta[name]"), t = e.length, n = 0; n < t; ++n) {
            var i = e[n];
            if ("description" === i.getAttribute("name").toLowerCase()) {
                var r = i.getAttribute("content");
                if (r)
                    return r.trim()
            }
        }
        return null
    },
    articleTitleAndSiteNameFromTitleString: function(e) {
        const t = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
            n = t.length,
            i = .6;
        for (var r, a, l = this.contentDocument.location.host, o = l.replace(/^(www|m)\./, ""), s = o.replace(/\.(com|info|net|org|edu)$/, "").toLowerCase(), c = 0; c < n; ++c) {
            var m = e.split(t[c]);
            if (2 === m.length) {
                var d = m[0].trim(),
                    h = m[1].trim(),
                    u = d.toLowerCase(),
                    g = h.toLowerCase(),
                    f = Math.max(stringSimilarity(u, o), stringSimilarity(u, s)),
                    p = Math.max(stringSimilarity(g, o), stringSimilarity(g, s)),
                    E = Math.max(f, p);
                (!a || E > a) && (a = E, r = f > p ? {
                    siteName: d,
                    articleTitle: h
                } : {
                    siteName: h,
                    articleTitle: d
                })
            }
        }
        return r && a >= i ? r : null
    },
    pageInformation: function(e, t) {
        var n,
            i = this.pageDescription(),
            r = !1;
        this.adoptableArticle() ? (n = this.articleTitle(), i = i || this.articleTextContent(), r = !0) : (n = this.contentDocument.title, this.contentDocument.body && (i = i || this.contentDocument.body.innerText));
        var a = "",
            l = this.buildMapOfMetaTags(),
            o = this.pageImageURLFromMetadata(l);
        if (o)
            a = o;
        else {
            var s = this.mainImageNode();
            s && (a = s.src)
        }
        n || (n = userVisibleURLString(this.contentDocument.location.href)), n = n.trim(), e && (n = n.substring(0, e));
        var c = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[property='og:site_name']");
        if (!c) {
            var m = this.articleTitleAndSiteNameFromTitleString(this.contentDocument.title);
            m && m.articleTitle === n && (c = m.siteName)
        }
        return c || (c = ""), i = i ? i.trim() : "", t && (i = i.substring(0, t)), i = i.replace(/[\s]+/g, " "), {
            title: n,
            previewText: i,
            siteName: c,
            mainImageURL: a,
            isReaderAvailable: r
        }
    },
    readingListItemInformation: function() {
        return this.pageInformation(220, 220)
    },
    buildMapOfMetaTags: function() {
        var e = {};
        const t = this.contentDocument.head.getElementsByTagName("meta"),
            n = t.length;
        for (var i = 0; i < n; ++i) {
            const n = t[i],
                r = n.content;
            if (r && !this.elementAttributesContainImproperQuote(n)) {
                n.name && (e["name:" + n.name.toLowerCase()] = r);
                const t = n.getAttribute("property");
                t && (e["property:" + t.toLowerCase()] = r)
            }
        }
        return e
    },
    longestPageMetadataDescriptionForTextAnalysis: function(e) {
        var t = [];
        const n = e["name:description"];
        n && n.length && t.push(n);
        const i = e["property:og:description"];
        i && i.length && t.push(i);
        const r = e["name:twitter:description"];
        return r && r.length && t.push(r), t.length ? t.reduce(function(e, t) {
            return e.length > t.length ? e : t
        }) : null
    },
    pageTypeForTextAnalysis: function(e) {
        const t = this.contentDocument.documentElement.getAttribute("itemtype");
        if ("http://schema.org/SearchResultsPage" === t || "https://schema.org/SearchResultsPage" === t)
            return PageType.searchResults;
        const n = e["name:section"];
        if (n && "homepage" === n.toLowerCase())
            return PageType.homepage;
        const i = e["property:og:type"];
        if (i) {
            const e = i.toLowerCase();
            if ("homepage" === e)
                return PageType.homepage;
            if ("article" === e)
                return PageType.article
        }
        const r = e["property:analytics-s-channel"];
        return r && "homepage" === r.toLowerCase() ? PageType.homepage : null
    },
    pageTitleForTextAnalysis: function(e) {
        const t = this.contentDocument;
        var n = e["property:og:title"];
        return n || (n = e["name:twitter:title"]), n || (n = e["name:sailthru.headline"]), n || (n = t.title), n
    },
    pageKeywordsForTextAnalysis: function(e) {
        return e["name:keywords"]
    },
    pageAuthorForTextAnalysis: function(e) {
        return e["name:author"] || e["property:author"]
    },
    pageMetadataForTextAnalysis: function() {
        var e = {};
        const t = this.buildMapOfMetaTags(),
            n = this.pageTypeForTextAnalysis(t);
        n && (e.type = n);
        const i = this.longestPageMetadataDescriptionForTextAnalysis(t);
        i && (e.description = i);
        const r = this.pageTitleForTextAnalysis(t);
        r && (e.title = r);
        const a = this.pageKeywordsForTextAnalysis(t);
        a && (e.keywords = a);
        const l = this.pageAuthorForTextAnalysis(t);
        l && (e.author = l);
        const o = this.pageImageURLFromMetadata(t);
        return o && (e.imageURL = o), e
    }
};
var ReaderArticleFinderJS = new ReaderArticleFinder(document);
