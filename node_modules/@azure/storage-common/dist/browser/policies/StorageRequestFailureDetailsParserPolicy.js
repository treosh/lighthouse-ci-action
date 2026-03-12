// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * The programmatic identifier of the StorageRequestFailureDetailsParserPolicy.
 */
export const storageRequestFailureDetailsParserPolicyName = "storageRequestFailureDetailsParserPolicy";
/**
 * StorageRequestFailureDetailsParserPolicy
 */
export function storageRequestFailureDetailsParserPolicy() {
    return {
        name: storageRequestFailureDetailsParserPolicyName,
        async sendRequest(request, next) {
            try {
                const response = await next(request);
                return response;
            }
            catch (err) {
                if (typeof err === "object" &&
                    err !== null &&
                    err.response &&
                    err.response.parsedBody) {
                    if (err.response.parsedBody.code === "InvalidHeaderValue" &&
                        err.response.parsedBody.HeaderName === "x-ms-version") {
                        err.message =
                            "The provided service version is not enabled on this storage account. Please see https://learn.microsoft.com/rest/api/storageservices/versioning-for-the-azure-storage-services for additional information.\n";
                    }
                }
                throw err;
            }
        },
    };
}
//# sourceMappingURL=StorageRequestFailureDetailsParserPolicy.js.map