// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/*
 * NOTE: When moving this file, please update "browser" section in package.json.
 */
/**
 * @internal
 */
export function getHeaderName() {
    return "x-ms-useragent";
}
/**
 * @internal
 */
export function setPlatformSpecificData(map) {
    var _a, _b, _c;
    const localNavigator = globalThis.navigator;
    map.set("OS", ((_c = (_b = (_a = localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) !== null && _b !== void 0 ? _b : localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.platform) !== null && _c !== void 0 ? _c : "unknown").replace(" ", ""));
}
//# sourceMappingURL=userAgentPlatform-browser.mjs.map