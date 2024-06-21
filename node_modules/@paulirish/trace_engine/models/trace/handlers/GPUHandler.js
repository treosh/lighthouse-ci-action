// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { data as metaHandlerData } from './MetaHandler.js';
import * as Types from '../types/types.js';
import * as Helpers from '../helpers/helpers.js';
let handlerState = 1 /* HandlerState.UNINITIALIZED */;
// Each thread contains events. Events indicate the thread and process IDs, which are
// used to store the event in the correct process thread entry below.
const eventsInProcessThread = new Map();
let mainGPUThreadTasks = [];
export function reset() {
    eventsInProcessThread.clear();
    mainGPUThreadTasks = [];
    handlerState = 1 /* HandlerState.UNINITIALIZED */;
}
export function initialize() {
    if (handlerState !== 1 /* HandlerState.UNINITIALIZED */) {
        throw new Error('GPU Handler was not reset before being initialized');
    }
    handlerState = 2 /* HandlerState.INITIALIZED */;
}
export function handleEvent(event) {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('GPU Handler is not initialized');
    }
    if (!Types.TraceEvents.isTraceEventGPUTask(event)) {
        return;
    }
    Helpers.Trace.addEventToProcessThread(event, eventsInProcessThread);
}
export async function finalize() {
    if (handlerState !== 2 /* HandlerState.INITIALIZED */) {
        throw new Error('GPU Handler is not initialized');
    }
    const { gpuProcessId, gpuThreadId } = metaHandlerData();
    const gpuThreadsForProcess = eventsInProcessThread.get(gpuProcessId);
    if (gpuThreadsForProcess && gpuThreadId) {
        mainGPUThreadTasks = gpuThreadsForProcess.get(gpuThreadId) || [];
    }
    handlerState = 3 /* HandlerState.FINALIZED */;
}
export function data() {
    if (handlerState !== 3 /* HandlerState.FINALIZED */) {
        throw new Error('GPU Handler is not finalized');
    }
    return {
        mainGPUThreadTasks,
    };
}
export function deps() {
    return ['Meta'];
}
//# sourceMappingURL=GPUHandler.js.map