"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlob = exports.isReadableStream = exports.isWebReadableStream = exports.isNodeReadableStream = void 0;
function isNodeReadableStream(x) {
    return Boolean(x && typeof x["pipe"] === "function");
}
exports.isNodeReadableStream = isNodeReadableStream;
function isWebReadableStream(x) {
    return Boolean(x &&
        typeof x.getReader === "function" &&
        typeof x.tee === "function");
}
exports.isWebReadableStream = isWebReadableStream;
function isReadableStream(x) {
    return isNodeReadableStream(x) || isWebReadableStream(x);
}
exports.isReadableStream = isReadableStream;
function isBlob(x) {
    return typeof x.stream === "function";
}
exports.isBlob = isBlob;
//# sourceMappingURL=typeGuards.js.map