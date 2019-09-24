exports.getRenderingDataFromViewport = function (viewportProperties, uaDeviceWidth, uaDeviceHeight, uaMaxZoom, uaMinZoom) {

    var vw = uaDeviceWidth / 100;
    var vh = uaDeviceHeight / 100;

    // Following http://dev.w3.org/csswg/css-device-adapt/#translation-into-atviewport-descriptors
    // 'auto' is mapped to null by convention
    var maxZoom = null;
    var minZoom = null;
    var zoom = null;
    var minWidth = null;
    var minHeight = null;
    var maxWidth = null;
    var maxHeight = null;
    var width = null, height = null;
    var initialWidth = uaDeviceWidth;
    var initialHeight = uaDeviceHeight;
    var userZoom = "zoom";

    if (viewportProperties["maximum-scale"] !== undefined) {
        maxZoom = translateZoomProperty(viewportProperties["maximum-scale"]);
    }
    if (viewportProperties["minimum-scale"] !== undefined) {
        minZoom = translateZoomProperty(viewportProperties["minimum-scale"]);
    }
    if (viewportProperties["initial-scale"] !== undefined) {
        zoom = translateZoomProperty(viewportProperties["initial-scale"]);
    }


    /* For a viewport META element that translates into an @viewport rule
       with no ‘max-zoom’ declaration and a non-‘auto’ ‘min-zoom’ value
       that is larger than the ‘max-zoom’ value of the UA stylesheet,
       the ‘min-zoom’ declaration value is clamped to the UA stylesheet
       ‘max-zoom’ value.  */
    if (minZoom !== null && maxZoom === null) {
        minZoom = min(uaMaxZoom, translateZoomProperty(viewportProperties["minimum-scale"]));
    }

    if (viewportProperties["width"] !== undefined) {
        minWidth = "extend-to-zoom";
        maxWidth = translateLengthProperty(viewportProperties["width"], vw, vh);
    }

    if (viewportProperties["height"] !== undefined) {
        minHeight = "extend-to-zoom";
        maxHeight = translateLengthProperty(viewportProperties["height"], vw, vh);
    }

    // Following http://dev.w3.org/csswg/css-device-adapt/#user-scalable0
    if (viewportProperties["user-scalable"] !== undefined) {
        userZoom = viewportProperties["user-scalable"];
        if (typeof userZoom === "number") {
            if (userZoom >=1 || userZoom <= -1) {
                userZoom = "zoom";
            } else {
                userZoom = "fixed";
            }
        } else {
            switch(userZoom) {
            case "yes":
            case "device-width":
            case "device-height":
                userZoom = "zoom";
                break;
            case "no":
            default:
                userZoom = "fixed";
                break;
            }
        }
    }

    /* For a viewport META element that translates into an @viewport rule
       with a non-‘auto’ ‘zoom’ declaration and no ‘width’ declaration: */
    if (zoom !== null &&
        (viewportProperties["width"] === undefined || width === undefined)) {
        if (viewportProperties["height"] !== undefined) {
            // If it adds a ‘height’ descriptor, add: width: auto;
            minWidth = null;
            maxWidth = null;
        } else {
            // Otherwise, add: width: extend-to-zoom;
            minWidth = "extend-to-zoom";
            maxWidth = "extend-to-zoom";
        }
    }


    // Following http://dev.w3.org/csswg/css-device-adapt/#constraining-procedure

    // If min-zoom is not ‘auto’ and max-zoom is not ‘auto’,
    // set max-zoom = MAX(min-zoom, max-zoom)
    if (minZoom !== null && maxZoom !== null) {
        maxZoom = max(minZoom, maxZoom);
    }

    // If zoom is not ‘auto’, set zoom = MAX(min-zoom, MIN(max-zoom, zoom))
    if (zoom !== null) {
        zoom = clamp(zoom, minZoom, maxZoom);
    }

    // from "Resolving ‘extend-to-zoom’"
    var extendZoom = (zoom === null && maxZoom === null ? null : min(zoom, maxZoom));
    var extendWidth, extendHeight;
    if (extendZoom === null) {
        if (maxWidth === "extend-to-zoom") {
            maxWidth = null;
        }
        if (maxHeight === "extend-to-zoom") {
            maxHeight = null;
        }
        if (minWidth === "extend-to-zoom") {
            minWidth = maxWidth;
        }
        if (minHeight === "extend-to-zoom") {
            minHeight = maxHeight;
        }
    } else {
        extendWidth = initialWidth / extendZoom;
        extendHeight = initialHeight / extendZoom;

        if (maxWidth === "extend-to-zoom") {
            maxWidth = extendWidth;
        }
        if (maxHeight === "extend-to-zoom") {
            maxHeight = extendHeight;
        }
        if (minWidth === "extend-to-zoom") {
            minWidth = max(extendWidth, maxWidth);
        }
        if (minHeight === "extend-to-zoom") {
            minHeight = max(extendHeight, maxHeight);
        }
    }

    // Resolve initial width and height from min/max descriptors
    if (minWidth !== null || maxWidth !== null) {
        width = max(minWidth, min(maxWidth, initialWidth));
    }
    if (minHeight !== null || maxHeight !== null) {
        height = max(minHeight, min(maxHeight, initialHeight));
    }

    // Resolve width value
    if (width === null) {
        if (height === null) {
            width = initialWidth;
        } else {
            if (initialHeight !== 0) {
                width = Math.round(height * (initialWidth / initialHeight));
            } else {
                width = initialWidth;
            }
        }
    }
    if (height === null) {
        if (initialWidth !== 0) {
            height = Math.round(width * (initialHeight / initialWidth));
        } else {
            height = initialHeight;
        }
    }

    return { zoom: zoom, width: width, height: height, userZoom: userZoom};
};

function min(a, b) {
    if (a === null) return b;
    if (b === null) return a;
    return Math.min(a,b);
}

function max(a, b) {
    if (a === null) return b;
    if (b === null) return a;
    return Math.max(a,b);
}


function translateLengthProperty(prop, vw, vh) {
    // based on http://dev.w3.org/csswg/css-device-adapt/#width2
    if (typeof prop === "number") {
        if (prop >= 0) {
            // Non-negative number values are translated to pixel lengths, clamped to the range: [1px, 10000px]
            return clamp(prop, 1, 10000);
        } else {
            return undefined;
        }
    }
    if (prop === "device-width") {
        return 100*vw;
    }
    if (prop === "device-height") {
        return 100*vh;
    }
    return 1;
}

function translateZoomProperty(prop) {
    // based on http://dev.w3.org/csswg/css-device-adapt/#initial-scale0
    if (typeof prop === "number") {
        if (prop >= 0) {
            // Non-negative number values are translated to <number> values, clamped to the range [0.1, 10]
            return clamp(prop, 0.1, 10);
        } else {
            return undefined;
        }
    }
    if (prop === "yes") {
        return 1;
    }
    if (prop === "device-width" || prop === "device-height") {
        return 10;
    }
    if (prop === "no" || prop === null) {
        return 0.1;
    }
}

// return value if min <= value <= max, or the closest from min or max
function clamp(value, minv, maxv) {
    return max(min(value, maxv), minv);
}

/*
from http://dev.w3.org/csswg/css-device-adapt/#viewport-meta
 Parse-Content(S)
i ← 1
while i ≤ length[S]
    do while i ≤ length[S] and S[i] in [whitespace, separator, '=']
        do i ← i + 1
    if i ≤ length[S]
        then i ← Parse-Property(S, i)

Parse-Property(S, i)
start ← i
while i ≤ length[S] and S[i] not in [whitespace, separator, '=']
    do i ← i + 1
if i > length[S] or S[i] in [separator]
    then return i
property-name ← S[start .. (i - 1)]
while i ≤ length[S] and S[i] not in [separator, '=']
    do i ← i + 1
if i > length[S] or S[i] in [separator]
    then return i
while i ≤ length[S] and S[i] in [whitespace, '=']
    do i ← i + 1
if i > length[S] or S[i] in [separator]
    then return i
start ← i
while i ≤ length[S] and S[i] not in [whitespace, separator, '=']
    do i ← i + 1
property-value ← S[start .. (i - 1)]
Set-Property(property-name, property-value)
return i */
exports.parseMetaViewPortContent = function (S) {
    var parsedContent = {
        validProperties : {},
        unknownProperties: {},
        invalidValues : {}
    };
    var i = 1;
    while (i <= S.length) {
        while (i <= S.length && RegExp(' |\x0A|\x09|\0d|,|;|=').test(S[i-1])) {
            i++;
        }
        if (i <= S.length) {
            i = parseProperty(parsedContent, S, i);
        }
    }
    return parsedContent;
};

var propertyNames = ["width", "height", "initial-scale", "minimum-scale", "maximum-scale", "user-scalable", "shrink-to-fit", "viewport-fit"];

function parseProperty(parsedContent, S, i) {
    var start = i;
    while (i <= S.length && !RegExp(' |\x0A|\x09|\0d|,|;|=').test(S[i-1])) {
        i++;
    }
    if (i > S.length || RegExp(',|;').test(S[i-1])) {
        return i;
    }
    var propertyName = S.slice(start - 1, i-1);
    while (i <= S.length && !RegExp(',|;|=').test(S[i-1])) {
        i++;
    }
    if (i > S.length || RegExp(',|;').test(S[i-1])) {
        return i;
    }
    while (i <= S.length && RegExp(' |\x0A|\x09|\0d|=').test(S[i-1])) {
        i++;
    }
    if (i > S.length || RegExp(',|;').test(S[i-1])) {
        return i;
    }
    start = i;
    while (i <= S.length && !RegExp(' |\x0A|\x09|\0d|,|;|=').test(S[i-1])) {
        i++;
    }
    var propertyValue = S.slice(start - 1, i-1);
    setProperty(parsedContent, propertyName, propertyValue);
    return i;
}

function setProperty(parsedContent, name, value) {
    if (propertyNames.indexOf(name) >= 0) {
        var number = parseFloat(value);
        if (!isNaN(number)) {
            parsedContent.validProperties[name] = number;
            return;
        }
        var string = value.toLowerCase();

        if (string === "yes" || string === "no" || string === "device-width" || string === "device-height" ||

           // https://webkit.org/blog/7929/designing-websites-for-iphone-x/
           (name.toLowerCase() === 'viewport-fit' && (string === 'auto' || string === 'cover'))) {

            parsedContent.validProperties[name] = string;
            return;
        }

        parsedContent.validProperties[name] = null;
        parsedContent.invalidValues[name] = value;
    } else {
        parsedContent.unknownProperties[name] = value;
    }
}

exports.expectedValues = {
    "width": ["device-width", "device-height", "a positive number"],
    "height": ["device-width", "device-height", "a positive number"],
    "initial-scale": ["a positive number"],
    "minimum-scale": ["a positive number"],
    "maximum-scale": ["a positive number"],
    "user-scalable": ["yes", "no", "0", "1"],
    "shrink-to-fit": ["yes", "no"],
    "viewport-fit": ["auto", "cover"]
};
