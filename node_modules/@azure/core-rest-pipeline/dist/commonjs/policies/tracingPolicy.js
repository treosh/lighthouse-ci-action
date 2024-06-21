"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracingPolicy = exports.tracingPolicyName = void 0;
const core_tracing_1 = require("@azure/core-tracing");
const constants_js_1 = require("../constants.js");
const userAgent_js_1 = require("../util/userAgent.js");
const log_js_1 = require("../log.js");
const core_util_1 = require("@azure/core-util");
const restError_js_1 = require("../restError.js");
/**
 * The programmatic identifier of the tracingPolicy.
 */
exports.tracingPolicyName = "tracingPolicy";
/**
 * A simple policy to create OpenTelemetry Spans for each request made by the pipeline
 * that has SpanOptions with a parent.
 * Requests made without a parent Span will not be recorded.
 * @param options - Options to configure the telemetry logged by the tracing policy.
 */
function tracingPolicy(options = {}) {
    const userAgent = (0, userAgent_js_1.getUserAgentValue)(options.userAgentPrefix);
    const tracingClient = tryCreateTracingClient();
    return {
        name: exports.tracingPolicyName,
        async sendRequest(request, next) {
            var _a, _b;
            if (!tracingClient || !((_a = request.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext)) {
                return next(request);
            }
            const { span, tracingContext } = (_b = tryCreateSpan(tracingClient, request, userAgent)) !== null && _b !== void 0 ? _b : {};
            if (!span || !tracingContext) {
                return next(request);
            }
            try {
                const response = await tracingClient.withContext(tracingContext, next, request);
                tryProcessResponse(span, response);
                return response;
            }
            catch (err) {
                tryProcessError(span, err);
                throw err;
            }
        },
    };
}
exports.tracingPolicy = tracingPolicy;
function tryCreateTracingClient() {
    try {
        return (0, core_tracing_1.createTracingClient)({
            namespace: "",
            packageName: "@azure/core-rest-pipeline",
            packageVersion: constants_js_1.SDK_VERSION,
        });
    }
    catch (e) {
        log_js_1.logger.warning(`Error when creating the TracingClient: ${(0, core_util_1.getErrorMessage)(e)}`);
        return undefined;
    }
}
function tryCreateSpan(tracingClient, request, userAgent) {
    try {
        // As per spec, we do not need to differentiate between HTTP and HTTPS in span name.
        const { span, updatedOptions } = tracingClient.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
            spanKind: "client",
            spanAttributes: {
                "http.method": request.method,
                "http.url": request.url,
                requestId: request.requestId,
            },
        });
        // If the span is not recording, don't do any more work.
        if (!span.isRecording()) {
            span.end();
            return undefined;
        }
        if (userAgent) {
            span.setAttribute("http.user_agent", userAgent);
        }
        // set headers
        const headers = tracingClient.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
        for (const [key, value] of Object.entries(headers)) {
            request.headers.set(key, value);
        }
        return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
    }
    catch (e) {
        log_js_1.logger.warning(`Skipping creating a tracing span due to an error: ${(0, core_util_1.getErrorMessage)(e)}`);
        return undefined;
    }
}
function tryProcessError(span, error) {
    try {
        span.setStatus({
            status: "error",
            error: (0, core_util_1.isError)(error) ? error : undefined,
        });
        if ((0, restError_js_1.isRestError)(error) && error.statusCode) {
            span.setAttribute("http.status_code", error.statusCode);
        }
        span.end();
    }
    catch (e) {
        log_js_1.logger.warning(`Skipping tracing span processing due to an error: ${(0, core_util_1.getErrorMessage)(e)}`);
    }
}
function tryProcessResponse(span, response) {
    try {
        span.setAttribute("http.status_code", response.status);
        const serviceRequestId = response.headers.get("x-ms-request-id");
        if (serviceRequestId) {
            span.setAttribute("serviceRequestId", serviceRequestId);
        }
        span.setStatus({
            status: "success",
        });
        span.end();
    }
    catch (e) {
        log_js_1.logger.warning(`Skipping tracing span processing due to an error: ${(0, core_util_1.getErrorMessage)(e)}`);
    }
}
//# sourceMappingURL=tracingPolicy.js.map