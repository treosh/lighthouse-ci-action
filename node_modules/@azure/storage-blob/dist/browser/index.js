// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { RestError } from "@azure/core-rest-pipeline";
export * from "./BlobServiceClient.js";
export * from "./Clients.js";
export * from "./ContainerClient.js";
export * from "./BlobLeaseClient.js";
export * from "./BlobBatch.js";
export * from "./BlobBatchClient.js";
export * from "./BatchResponse.js";
export { BlockBlobTier, PremiumPageBlobTier, } from "./models.js";
export { Pipeline, isPipelineLike, newPipeline, StorageOAuthScopes, } from "./Pipeline.js";
export * from "./generatedModels.js";
export { RestError };
export { logger } from "./log.js";
// Re-export from @azure/storage-common for backward compatibility
export { BaseRequestPolicy, AnonymousCredential, Credential, StorageBrowserPolicyFactory, StorageRetryPolicyFactory, StorageRetryPolicyType, AnonymousCredentialPolicy, CredentialPolicy, StorageBrowserPolicy, StorageRetryPolicy, storageBrowserPolicy, storageRetryPolicy, storageCorrectContentLengthPolicy, } from "@azure/storage-common";
//# sourceMappingURL=index-browser.mjs.map