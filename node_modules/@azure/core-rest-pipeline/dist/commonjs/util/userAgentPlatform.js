"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlatformSpecificData = exports.getHeaderName = void 0;
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("node:os"));
const process = tslib_1.__importStar(require("node:process"));
/**
 * @internal
 */
function getHeaderName() {
    return "User-Agent";
}
exports.getHeaderName = getHeaderName;
/**
 * @internal
 */
function setPlatformSpecificData(map) {
    const versions = process.versions;
    if (versions.bun) {
        map.set("Bun", versions.bun);
    }
    else if (versions.deno) {
        map.set("Deno", versions.deno);
    }
    else if (versions.node) {
        map.set("Node", versions.node);
    }
    map.set("OS", `(${os.arch()}-${os.type()}-${os.release()})`);
}
exports.setPlatformSpecificData = setPlatformSpecificData;
//# sourceMappingURL=userAgentPlatform.js.map