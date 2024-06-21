"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelablePromiseRace = void 0;
/**
 * promise.race() wrapper that aborts rest of promises as soon as the first promise settles.
 */
async function cancelablePromiseRace(abortablePromiseBuilders, options) {
    var _a, _b;
    const aborter = new AbortController();
    function abortHandler() {
        aborter.abort();
    }
    (_a = options === null || options === void 0 ? void 0 : options.abortSignal) === null || _a === void 0 ? void 0 : _a.addEventListener("abort", abortHandler);
    try {
        return await Promise.race(abortablePromiseBuilders.map((p) => p({ abortSignal: aborter.signal })));
    }
    finally {
        aborter.abort();
        (_b = options === null || options === void 0 ? void 0 : options.abortSignal) === null || _b === void 0 ? void 0 : _b.removeEventListener("abort", abortHandler);
    }
}
exports.cancelablePromiseRace = cancelablePromiseRace;
//# sourceMappingURL=aborterUtils.js.map