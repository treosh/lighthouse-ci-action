"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskSecretUrls = exports.maskSigUrl = exports.getBackendIdsFromToken = void 0;
const core = __importStar(require("@actions/core"));
const config_1 = require("./config");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const core_1 = require("@actions/core");
const InvalidJwtError = new Error('Failed to get backend IDs: The provided JWT token is invalid and/or missing claims');
// uses the JWT token claims to get the
// workflow run and workflow job run backend ids
function getBackendIdsFromToken() {
    const token = (0, config_1.getRuntimeToken)();
    const decoded = (0, jwt_decode_1.default)(token);
    if (!decoded.scp) {
        throw InvalidJwtError;
    }
    /*
     * example decoded:
     * {
     *   scp: "Actions.ExampleScope Actions.Results:ce7f54c7-61c7-4aae-887f-30da475f5f1a:ca395085-040a-526b-2ce8-bdc85f692774"
     * }
     */
    const scpParts = decoded.scp.split(' ');
    if (scpParts.length === 0) {
        throw InvalidJwtError;
    }
    /*
     * example scpParts:
     * ["Actions.ExampleScope", "Actions.Results:ce7f54c7-61c7-4aae-887f-30da475f5f1a:ca395085-040a-526b-2ce8-bdc85f692774"]
     */
    for (const scopes of scpParts) {
        const scopeParts = scopes.split(':');
        if ((scopeParts === null || scopeParts === void 0 ? void 0 : scopeParts[0]) !== 'Actions.Results') {
            // not the Actions.Results scope
            continue;
        }
        /*
         * example scopeParts:
         * ["Actions.Results", "ce7f54c7-61c7-4aae-887f-30da475f5f1a", "ca395085-040a-526b-2ce8-bdc85f692774"]
         */
        if (scopeParts.length !== 3) {
            // missing expected number of claims
            throw InvalidJwtError;
        }
        const ids = {
            workflowRunBackendId: scopeParts[1],
            workflowJobRunBackendId: scopeParts[2]
        };
        core.debug(`Workflow Run Backend ID: ${ids.workflowRunBackendId}`);
        core.debug(`Workflow Job Run Backend ID: ${ids.workflowJobRunBackendId}`);
        return ids;
    }
    throw InvalidJwtError;
}
exports.getBackendIdsFromToken = getBackendIdsFromToken;
/**
 * Masks the `sig` parameter in a URL and sets it as a secret.
 *
 * @param url - The URL containing the signature parameter to mask
 * @remarks
 * This function attempts to parse the provided URL and identify the 'sig' query parameter.
 * If found, it registers both the raw and URL-encoded signature values as secrets using
 * the Actions `setSecret` API, which prevents them from being displayed in logs.
 *
 * The function handles errors gracefully if URL parsing fails, logging them as debug messages.
 *
 * @example
 * ```typescript
 * // Mask a signature in an Azure SAS token URL
 * maskSigUrl('https://example.blob.core.windows.net/container/file.txt?sig=abc123&se=2023-01-01');
 * ```
 */
function maskSigUrl(url) {
    if (!url)
        return;
    try {
        const parsedUrl = new URL(url);
        const signature = parsedUrl.searchParams.get('sig');
        if (signature) {
            (0, core_1.setSecret)(signature);
            (0, core_1.setSecret)(encodeURIComponent(signature));
        }
    }
    catch (error) {
        (0, core_1.debug)(`Failed to parse URL: ${url} ${error instanceof Error ? error.message : String(error)}`);
    }
}
exports.maskSigUrl = maskSigUrl;
/**
 * Masks sensitive information in URLs containing signature parameters.
 * Currently supports masking 'sig' parameters in the 'signed_upload_url'
 * and 'signed_download_url' properties of the provided object.
 *
 * @param body - The object should contain a signature
 * @remarks
 * This function extracts URLs from the object properties and calls maskSigUrl
 * on each one to redact sensitive signature information. The function doesn't
 * modify the original object; it only marks the signatures as secrets for
 * logging purposes.
 *
 * @example
 * ```typescript
 * const responseBody = {
 *   signed_upload_url: 'https://example.com?sig=abc123',
 *   signed_download_url: 'https://example.com?sig=def456'
 * };
 * maskSecretUrls(responseBody);
 * ```
 */
function maskSecretUrls(body) {
    if (typeof body !== 'object' || body === null) {
        (0, core_1.debug)('body is not an object or is null');
        return;
    }
    if ('signed_upload_url' in body &&
        typeof body.signed_upload_url === 'string') {
        maskSigUrl(body.signed_upload_url);
    }
    if ('signed_url' in body && typeof body.signed_url === 'string') {
        maskSigUrl(body.signed_url);
    }
}
exports.maskSecretUrls = maskSecretUrls;
//# sourceMappingURL=util.js.map