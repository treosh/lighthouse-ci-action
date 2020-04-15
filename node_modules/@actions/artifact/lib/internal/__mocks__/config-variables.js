"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Mocks default limits for easier testing
 */
function getUploadFileConcurrency() {
    return 1;
}
exports.getUploadFileConcurrency = getUploadFileConcurrency;
function getUploadChunkConcurrency() {
    return 1;
}
exports.getUploadChunkConcurrency = getUploadChunkConcurrency;
function getUploadChunkSize() {
    return 4 * 1024 * 1024; // 4 MB Chunks
}
exports.getUploadChunkSize = getUploadChunkSize;
function getRetryLimit() {
    return 2;
}
exports.getRetryLimit = getRetryLimit;
function getRetryMultiplier() {
    return 1.5;
}
exports.getRetryMultiplier = getRetryMultiplier;
function getInitialRetryIntervalInMilliseconds() {
    return 10;
}
exports.getInitialRetryIntervalInMilliseconds = getInitialRetryIntervalInMilliseconds;
function getDownloadFileConcurrency() {
    return 1;
}
exports.getDownloadFileConcurrency = getDownloadFileConcurrency;
/**
 * Mocks the 'ACTIONS_RUNTIME_TOKEN', 'ACTIONS_RUNTIME_URL' and 'GITHUB_RUN_ID' env variables
 * that are only available from a node context on the runner. This allows for tests to run
 * locally without the env variables actually being set
 */
function getRuntimeToken() {
    return 'totally-valid-token';
}
exports.getRuntimeToken = getRuntimeToken;
function getRuntimeUrl() {
    return 'https://www.example.com/';
}
exports.getRuntimeUrl = getRuntimeUrl;
function getWorkFlowRunId() {
    return '15';
}
exports.getWorkFlowRunId = getWorkFlowRunId;
//# sourceMappingURL=config-variables.js.map