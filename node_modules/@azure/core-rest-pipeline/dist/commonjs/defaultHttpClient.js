"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultHttpClient = void 0;
const nodeHttpClient_js_1 = require("./nodeHttpClient.js");
/**
 * Create the correct HttpClient for the current environment.
 */
function createDefaultHttpClient() {
    return (0, nodeHttpClient_js_1.createNodeHttpClient)();
}
exports.createDefaultHttpClient = createDefaultHttpClient;
//# sourceMappingURL=defaultHttpClient.js.map