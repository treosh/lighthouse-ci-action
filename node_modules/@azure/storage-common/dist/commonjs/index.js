"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRequestPolicy = exports.getCachedDefaultHttpClient = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./BufferScheduler.js"), exports);
var cache_js_1 = require("./cache.js");
Object.defineProperty(exports, "getCachedDefaultHttpClient", { enumerable: true, get: function () { return cache_js_1.getCachedDefaultHttpClient; } });
tslib_1.__exportStar(require("./interfaces.js"), exports);
tslib_1.__exportStar(require("./StorageBrowserPolicyFactory.js"), exports);
tslib_1.__exportStar(require("./credentials/AnonymousCredential.js"), exports);
tslib_1.__exportStar(require("./credentials/Credential.js"), exports);
tslib_1.__exportStar(require("./credentials/StorageSharedKeyCredential.js"), exports);
tslib_1.__exportStar(require("./StorageRetryPolicyFactory.js"), exports);
var RequestPolicy_js_1 = require("./policies/RequestPolicy.js");
Object.defineProperty(exports, "BaseRequestPolicy", { enumerable: true, get: function () { return RequestPolicy_js_1.BaseRequestPolicy; } });
tslib_1.__exportStar(require("./policies/AnonymousCredentialPolicy.js"), exports);
tslib_1.__exportStar(require("./policies/CredentialPolicy.js"), exports);
tslib_1.__exportStar(require("./policies/StorageBrowserPolicyV2.js"), exports);
tslib_1.__exportStar(require("./policies/StorageCorrectContentLengthPolicy.js"), exports);
tslib_1.__exportStar(require("./policies/StorageRetryPolicyV2.js"), exports);
tslib_1.__exportStar(require("./policies/StorageSharedKeyCredentialPolicy.js"), exports);
tslib_1.__exportStar(require("./policies/StorageSharedKeyCredentialPolicyV2.js"), exports);
tslib_1.__exportStar(require("./policies/StorageRequestFailureDetailsParserPolicy.js"), exports);
tslib_1.__exportStar(require("./credentials/UserDelegationKeyCredential.js"), exports);
//# sourceMappingURL=index.js.map