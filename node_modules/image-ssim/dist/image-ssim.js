(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ImageSSIM = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * ssim.ts - part of Image Quantization Library
 */
/**
 * - Original TypeScript implementation:
 *   https://github.com/igor-bezkrovny/image-quantization/blob/9f62764ac047c3e53accdf1d7e4e424b0ef2fb60/src/quality/ssim.ts
 * - Based on Java implementation: https://github.com/rhys-e/structural-similarity
 * - For more information see: http://en.wikipedia.org/wiki/Structural_similarity
 */
var ImageSSIM;
(function (ImageSSIM) {
    'use strict';
    /**
     * Grey = 1, GreyAlpha = 2, RGB = 3, RGBAlpha = 4
     */
    (function (Channels) {
        Channels[Channels["Grey"] = 1] = "Grey";
        Channels[Channels["GreyAlpha"] = 2] = "GreyAlpha";
        Channels[Channels["RGB"] = 3] = "RGB";
        Channels[Channels["RGBAlpha"] = 4] = "RGBAlpha";
    })(ImageSSIM.Channels || (ImageSSIM.Channels = {}));
    var Channels = ImageSSIM.Channels;
    /**
     * Entry point.
     * @throws new Error('Images have different sizes!')
     */
    function compare(image1, image2, windowSize, K1, K2, luminance, bitsPerComponent) {
        if (windowSize === void 0) { windowSize = 8; }
        if (K1 === void 0) { K1 = 0.01; }
        if (K2 === void 0) { K2 = 0.03; }
        if (luminance === void 0) { luminance = true; }
        if (bitsPerComponent === void 0) { bitsPerComponent = 8; }
        if (image1.width !== image2.width || image1.height !== image2.height) {
            throw new Error('Images have different sizes!');
        }
        /* tslint:disable:no-bitwise */
        var L = (1 << bitsPerComponent) - 1;
        /* tslint:enable:no-bitwise */
        var c1 = Math.pow((K1 * L), 2), c2 = Math.pow((K2 * L), 2), numWindows = 0, mssim = 0.0;
        var mcs = 0.0;
        function iteration(lumaValues1, lumaValues2, averageLumaValue1, averageLumaValue2) {
            // calculate variance and covariance
            var sigxy, sigsqx, sigsqy;
            sigxy = sigsqx = sigsqy = 0.0;
            for (var i = 0; i < lumaValues1.length; i++) {
                sigsqx += Math.pow((lumaValues1[i] - averageLumaValue1), 2);
                sigsqy += Math.pow((lumaValues2[i] - averageLumaValue2), 2);
                sigxy += (lumaValues1[i] - averageLumaValue1) * (lumaValues2[i] - averageLumaValue2);
            }
            var numPixelsInWin = lumaValues1.length - 1;
            sigsqx /= numPixelsInWin;
            sigsqy /= numPixelsInWin;
            sigxy /= numPixelsInWin;
            // perform ssim calculation on window
            var numerator = (2 * averageLumaValue1 * averageLumaValue2 + c1) * (2 * sigxy + c2);
            var denominator = (Math.pow(averageLumaValue1, 2) + Math.pow(averageLumaValue2, 2) + c1) * (sigsqx + sigsqy + c2);
            mssim += numerator / denominator;
            mcs += (2 * sigxy + c2) / (sigsqx + sigsqy + c2);
            numWindows++;
        }
        // calculate SSIM for each window
        Internals._iterate(image1, image2, windowSize, luminance, iteration);
        return { ssim: mssim / numWindows, mcs: mcs / numWindows };
    }
    ImageSSIM.compare = compare;
    /**
     * Internal functions.
     */
    var Internals;
    (function (Internals) {
        function _iterate(image1, image2, windowSize, luminance, callback) {
            var width = image1.width, height = image1.height;
            for (var y = 0; y < height; y += windowSize) {
                for (var x = 0; x < width; x += windowSize) {
                    // avoid out-of-width/height
                    var windowWidth = Math.min(windowSize, width - x), windowHeight = Math.min(windowSize, height - y);
                    var lumaValues1 = _lumaValuesForWindow(image1, x, y, windowWidth, windowHeight, luminance), lumaValues2 = _lumaValuesForWindow(image2, x, y, windowWidth, windowHeight, luminance), averageLuma1 = _averageLuma(lumaValues1), averageLuma2 = _averageLuma(lumaValues2);
                    callback(lumaValues1, lumaValues2, averageLuma1, averageLuma2);
                }
            }
        }
        Internals._iterate = _iterate;
        function _lumaValuesForWindow(image, x, y, width, height, luminance) {
            var array = image.data, lumaValues = new Float32Array(new ArrayBuffer(width * height * 4)), counter = 0;
            var maxj = y + height;
            for (var j = y; j < maxj; j++) {
                var offset = j * image.width;
                var i = (offset + x) * image.channels;
                var maxi = (offset + x + width) * image.channels;
                switch (image.channels) {
                    case 1 /* Grey */:
                        while (i < maxi) {
                            // (0.212655 +  0.715158 + 0.072187) === 1
                            lumaValues[counter++] = array[i++];
                        }
                        break;
                    case 2 /* GreyAlpha */:
                        while (i < maxi) {
                            lumaValues[counter++] = array[i++] * (array[i++] / 255);
                        }
                        break;
                    case 3 /* RGB */:
                        if (luminance) {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] * 0.212655 + array[i++] * 0.715158 + array[i++] * 0.072187);
                            }
                        }
                        else {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] + array[i++] + array[i++]);
                            }
                        }
                        break;
                    case 4 /* RGBAlpha */:
                        if (luminance) {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] * 0.212655 + array[i++] * 0.715158 + array[i++] * 0.072187) * (array[i++] / 255);
                            }
                        }
                        else {
                            while (i < maxi) {
                                lumaValues[counter++] = (array[i++] + array[i++] + array[i++]) * (array[i++] / 255);
                            }
                        }
                        break;
                }
            }
            return lumaValues;
        }
        function _averageLuma(lumaValues) {
            var sumLuma = 0.0;
            for (var i = 0; i < lumaValues.length; i++) {
                sumLuma += lumaValues[i];
            }
            return sumLuma / lumaValues.length;
        }
    })(Internals || (Internals = {}));
})(ImageSSIM || (ImageSSIM = {}));
module.exports = ImageSSIM;

},{}]},{},[1])(1)
});