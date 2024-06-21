// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Types from '../types/types.js';
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
const sessionIdEvents = [];
const workerIdByThread = new Map();
const workerURLById = new Map();
export function initialize() {
    if (handlerState !== 1 /* HandlerState.UNINITIALIZED */) {
        throw new Error('Workers Handler was not reset');
    }
    handlerState = 2 /* HandlerState.INITIALIZED */;
}
export function reset() {
    sessionIdEvents.length = 0;
    workerIdByThread.clear();
    workerURLById.clear();
    handlerState = 1 /* HandlerState.UNINITIALIZED */;
}
export function handleEvent(event) {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('Workers Handler is not initialized');
    }
    if (Types.TraceEvents.isTraceEventTracingSessionIdForWorker(event)) {
        sessionIdEvents.push(event);
    }
}
export async function finalize() {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('Handler is not initialized');
    }
    for (const sessionIdEvent of sessionIdEvents) {
        if (!sessionIdEvent.args.data) {
            continue;
        }
        workerIdByThread.set(sessionIdEvent.args.data.workerThreadId, sessionIdEvent.args.data.workerId);
        workerURLById.set(sessionIdEvent.args.data.workerId, sessionIdEvent.args.data.url);
    }
    handlerState = 3 /* HandlerState.FINALIZED */;
}
export function data() {
    if (handlerState !== 3 /* HandlerState.FINALIZED */) {
        throw new Error('Workers Handler is not finalized');
    }
    return {
        workerSessionIdEvents: sessionIdEvents,
        workerIdByThread,
        workerURLById,
    };
}
//# sourceMappingURL=WorkersHandler.js.map