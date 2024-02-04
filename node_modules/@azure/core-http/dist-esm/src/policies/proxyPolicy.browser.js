// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { BaseRequestPolicy, } from "./requestPolicy";
const errorMessage = "ProxyPolicy is not supported in browser environment";
export function getDefaultProxySettings(_proxyUrl) {
    return undefined;
}
export function proxyPolicy(_proxySettings) {
    return {
        create: (_nextPolicy, _options) => {
            throw new Error(errorMessage);
        },
    };
}
export class ProxyPolicy extends BaseRequestPolicy {
    constructor(nextPolicy, options) {
        super(nextPolicy, options);
        throw new Error(errorMessage);
    }
    sendRequest(_request) {
        throw new Error(errorMessage);
    }
}
//# sourceMappingURL=proxyPolicy.browser.js.map