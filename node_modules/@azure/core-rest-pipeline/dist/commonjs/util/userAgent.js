"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgentValue = exports.getUserAgentHeaderName = void 0;
const userAgentPlatform_js_1 = require("./userAgentPlatform.js");
const constants_js_1 = require("../constants.js");
function getUserAgentString(telemetryInfo) {
    const parts = [];
    for (const [key, value] of telemetryInfo) {
        const token = value ? `${key}/${value}` : key;
        parts.push(token);
    }
    return parts.join(" ");
}
/**
 * @internal
 */
function getUserAgentHeaderName() {
    return (0, userAgentPlatform_js_1.getHeaderName)();
}
exports.getUserAgentHeaderName = getUserAgentHeaderName;
/**
 * @internal
 */
function getUserAgentValue(prefix) {
    const runtimeInfo = new Map();
    runtimeInfo.set("core-rest-pipeline", constants_js_1.SDK_VERSION);
    (0, userAgentPlatform_js_1.setPlatformSpecificData)(runtimeInfo);
    const defaultAgent = getUserAgentString(runtimeInfo);
    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
    return userAgentValue;
}
exports.getUserAgentValue = getUserAgentValue;
//# sourceMappingURL=userAgent.js.map