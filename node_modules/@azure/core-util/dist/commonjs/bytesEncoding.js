"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToUint8Array = exports.uint8ArrayToString = void 0;
/**
 * The helper that transforms bytes with specific character encoding into string
 * @param bytes - the uint8array bytes
 * @param format - the format we use to encode the byte
 * @returns a string of the encoded string
 */
function uint8ArrayToString(bytes, format) {
    return Buffer.from(bytes).toString(format);
}
exports.uint8ArrayToString = uint8ArrayToString;
/**
 * The helper that transforms string to specific character encoded bytes array.
 * @param value - the string to be converted
 * @param format - the format we use to decode the value
 * @returns a uint8array
 */
function stringToUint8Array(value, format) {
    return Buffer.from(value, format);
}
exports.stringToUint8Array = stringToUint8Array;
//# sourceMappingURL=bytesEncoding.js.map