"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobLeaseClient = void 0;
const core_util_1 = require("@azure/core-util");
const constants_js_1 = require("./utils/constants.js");
const tracing_js_1 = require("./utils/tracing.js");
const utils_common_js_1 = require("./utils/utils.common.js");
/**
 * A client that manages leases for a {@link ContainerClient} or a {@link BlobClient}.
 */
class BlobLeaseClient {
    _leaseId;
    _url;
    _containerOrBlobOperation;
    _isContainer;
    /**
     * Gets the lease Id.
     *
     * @readonly
     */
    get leaseId() {
        return this._leaseId;
    }
    /**
     * Gets the url.
     *
     * @readonly
     */
    get url() {
        return this._url;
    }
    /**
     * Creates an instance of BlobLeaseClient.
     * @param client - The client to make the lease operation requests.
     * @param leaseId - Initial proposed lease id.
     */
    constructor(client, leaseId) {
        const clientContext = client.storageClientContext;
        this._url = client.url;
        if (client.name === undefined) {
            this._isContainer = true;
            this._containerOrBlobOperation = clientContext.container;
        }
        else {
            this._isContainer = false;
            this._containerOrBlobOperation = clientContext.blob;
        }
        if (!leaseId) {
            leaseId = (0, core_util_1.randomUUID)();
        }
        this._leaseId = leaseId;
    }
    /**
     * Establishes and manages a lock on a container for delete operations, or on a blob
     * for write and delete operations.
     * The lock duration can be 15 to 60 seconds, or can be infinite.
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-container
     * and
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-blob
     *
     * @param duration - Must be between 15 to 60 seconds, or infinite (-1)
     * @param options - option to configure lease management operations.
     * @returns Response data for acquire lease operation.
     */
    async acquireLease(duration, options = {}) {
        if (this._isContainer &&
            ((options.conditions?.ifMatch && options.conditions?.ifMatch !== constants_js_1.ETagNone) ||
                (options.conditions?.ifNoneMatch && options.conditions?.ifNoneMatch !== constants_js_1.ETagNone) ||
                options.conditions?.tagConditions)) {
            throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
        }
        return tracing_js_1.tracingClient.withSpan("BlobLeaseClient-acquireLease", options, async (updatedOptions) => {
            return (0, utils_common_js_1.assertResponse)(await this._containerOrBlobOperation.acquireLease({
                abortSignal: options.abortSignal,
                duration,
                modifiedAccessConditions: {
                    ...options.conditions,
                    ifTags: options.conditions?.tagConditions,
                },
                proposedLeaseId: this._leaseId,
                tracingOptions: updatedOptions.tracingOptions,
            }));
        });
    }
    /**
     * To change the ID of the lease.
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-container
     * and
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-blob
     *
     * @param proposedLeaseId - the proposed new lease Id.
     * @param options - option to configure lease management operations.
     * @returns Response data for change lease operation.
     */
    async changeLease(proposedLeaseId, options = {}) {
        if (this._isContainer &&
            ((options.conditions?.ifMatch && options.conditions?.ifMatch !== constants_js_1.ETagNone) ||
                (options.conditions?.ifNoneMatch && options.conditions?.ifNoneMatch !== constants_js_1.ETagNone) ||
                options.conditions?.tagConditions)) {
            throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
        }
        return tracing_js_1.tracingClient.withSpan("BlobLeaseClient-changeLease", options, async (updatedOptions) => {
            const response = (0, utils_common_js_1.assertResponse)(await this._containerOrBlobOperation.changeLease(this._leaseId, proposedLeaseId, {
                abortSignal: options.abortSignal,
                modifiedAccessConditions: {
                    ...options.conditions,
                    ifTags: options.conditions?.tagConditions,
                },
                tracingOptions: updatedOptions.tracingOptions,
            }));
            this._leaseId = proposedLeaseId;
            return response;
        });
    }
    /**
     * To free the lease if it is no longer needed so that another client may
     * immediately acquire a lease against the container or the blob.
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-container
     * and
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-blob
     *
     * @param options - option to configure lease management operations.
     * @returns Response data for release lease operation.
     */
    async releaseLease(options = {}) {
        if (this._isContainer &&
            ((options.conditions?.ifMatch && options.conditions?.ifMatch !== constants_js_1.ETagNone) ||
                (options.conditions?.ifNoneMatch && options.conditions?.ifNoneMatch !== constants_js_1.ETagNone) ||
                options.conditions?.tagConditions)) {
            throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
        }
        return tracing_js_1.tracingClient.withSpan("BlobLeaseClient-releaseLease", options, async (updatedOptions) => {
            return (0, utils_common_js_1.assertResponse)(await this._containerOrBlobOperation.releaseLease(this._leaseId, {
                abortSignal: options.abortSignal,
                modifiedAccessConditions: {
                    ...options.conditions,
                    ifTags: options.conditions?.tagConditions,
                },
                tracingOptions: updatedOptions.tracingOptions,
            }));
        });
    }
    /**
     * To renew the lease.
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-container
     * and
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-blob
     *
     * @param options - Optional option to configure lease management operations.
     * @returns Response data for renew lease operation.
     */
    async renewLease(options = {}) {
        if (this._isContainer &&
            ((options.conditions?.ifMatch && options.conditions?.ifMatch !== constants_js_1.ETagNone) ||
                (options.conditions?.ifNoneMatch && options.conditions?.ifNoneMatch !== constants_js_1.ETagNone) ||
                options.conditions?.tagConditions)) {
            throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
        }
        return tracing_js_1.tracingClient.withSpan("BlobLeaseClient-renewLease", options, async (updatedOptions) => {
            return this._containerOrBlobOperation.renewLease(this._leaseId, {
                abortSignal: options.abortSignal,
                modifiedAccessConditions: {
                    ...options.conditions,
                    ifTags: options.conditions?.tagConditions,
                },
                tracingOptions: updatedOptions.tracingOptions,
            });
        });
    }
    /**
     * To end the lease but ensure that another client cannot acquire a new lease
     * until the current lease period has expired.
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-container
     * and
     * @see https://learn.microsoft.com/rest/api/storageservices/lease-blob
     *
     * @param breakPeriod - Break period
     * @param options - Optional options to configure lease management operations.
     * @returns Response data for break lease operation.
     */
    async breakLease(breakPeriod, options = {}) {
        if (this._isContainer &&
            ((options.conditions?.ifMatch && options.conditions?.ifMatch !== constants_js_1.ETagNone) ||
                (options.conditions?.ifNoneMatch && options.conditions?.ifNoneMatch !== constants_js_1.ETagNone) ||
                options.conditions?.tagConditions)) {
            throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
        }
        return tracing_js_1.tracingClient.withSpan("BlobLeaseClient-breakLease", options, async (updatedOptions) => {
            const operationOptions = {
                abortSignal: options.abortSignal,
                breakPeriod,
                modifiedAccessConditions: {
                    ...options.conditions,
                    ifTags: options.conditions?.tagConditions,
                },
                tracingOptions: updatedOptions.tracingOptions,
            };
            return (0, utils_common_js_1.assertResponse)(await this._containerOrBlobOperation.breakLease(operationOptions));
        });
    }
}
exports.BlobLeaseClient = BlobLeaseClient;
//# sourceMappingURL=BlobLeaseClient.js.map