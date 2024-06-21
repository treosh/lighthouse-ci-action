// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export function isNestableAsyncPhase(phase) {
    return phase === "b" /* Phase.ASYNC_NESTABLE_START */ || phase === "e" /* Phase.ASYNC_NESTABLE_END */ ||
        phase === "n" /* Phase.ASYNC_NESTABLE_INSTANT */;
}
export function isAsyncPhase(phase) {
    return isNestableAsyncPhase(phase) || phase === "S" /* Phase.ASYNC_BEGIN */ || phase === "T" /* Phase.ASYNC_STEP_INTO */ ||
        phase === "F" /* Phase.ASYNC_END */ || phase === "p" /* Phase.ASYNC_STEP_PAST */;
}
export function isFlowPhase(phase) {
    return phase === "s" /* Phase.FLOW_START */ || phase === "t" /* Phase.FLOW_STEP */ || phase === "f" /* Phase.FLOW_END */;
}
export function objectIsTraceEventCallFrame(object) {
    return ('functionName' in object && typeof object.functionName === 'string') &&
        ('scriptId' in object && (typeof object.scriptId === 'string' || typeof object.scriptId === 'number')) &&
        ('columnNumber' in object && typeof object.columnNumber === 'number') &&
        ('lineNumber' in object && typeof object.lineNumber === 'number') &&
        ('url' in object && typeof object.url === 'string');
}
export function isTraceEventRunTask(event) {
    return event.name === "RunTask" /* KnownEventName.RunTask */;
}
export function isTraceEventAuctionWorkletRunningInProcess(event) {
    return event.name === 'AuctionWorkletRunningInProcess';
}
export function isTraceEventAuctionWorkletDoneWithProcess(event) {
    return event.name === 'AuctionWorkletDoneWithProcess';
}
export function isTraceEventScreenshot(event) {
    return event.name === "Screenshot" /* KnownEventName.Screenshot */;
}
const markerTypeGuards = [
    isTraceEventMarkDOMContent,
    isTraceEventMarkLoad,
    isTraceEventFirstPaint,
    isTraceEventFirstContentfulPaint,
    isTraceEventLargestContentfulPaintCandidate,
    isTraceEventNavigationStart,
];
export const MarkerName = ['MarkDOMContent', 'MarkLoad', 'firstPaint', 'firstContentfulPaint', 'largestContentfulPaint::Candidate'];
export function isTraceEventMarkerEvent(event) {
    return markerTypeGuards.some(fn => fn(event));
}
const pageLoadEventTypeGuards = [
    ...markerTypeGuards,
    isTraceEventInteractiveTime,
];
export function eventIsPageLoadEvent(event) {
    return pageLoadEventTypeGuards.some(fn => fn(event));
}
export function isTraceEventTracingSessionIdForWorker(event) {
    return event.name === 'TracingSessionIdForWorker';
}
export function isTraceEventScheduleStyleInvalidationTracking(event) {
    return event.name === "ScheduleStyleInvalidationTracking" /* KnownEventName.ScheduleStyleInvalidationTracking */;
}
export function isTraceEventStyleRecalcInvalidationTracking(event) {
    return event.name === "StyleRecalcInvalidationTracking" /* KnownEventName.StyleRecalcInvalidationTracking */;
}
export function isTraceEventStyleInvalidatorInvalidationTracking(event) {
    return event.name === "StyleInvalidatorInvalidationTracking" /* KnownEventName.StyleInvalidatorInvalidationTracking */;
}
export function isTraceEventBeginCommitCompositorFrame(event) {
    return event.name === "BeginCommitCompositorFrame" /* KnownEventName.BeginCommitCompositorFrame */;
}
export function isTraceEventScheduleStyleRecalculation(event) {
    return event.name === "ScheduleStyleRecalculation" /* KnownEventName.ScheduleStyleRecalculation */;
}
export function isTraceEventPipelineReporter(event) {
    return event.name === "PipelineReporter" /* KnownEventName.PipelineReporter */;
}
export function isSyntheticEvent(event) {
    return 'rawSourceEvent' in event;
}
export function isSyntheticInteractionEvent(event) {
    return Boolean('interactionId' in event && event.args?.data && 'beginEvent' in event.args.data && 'endEvent' in event.args.data);
}
export function isSyntheticTraceEntry(event) {
    return isTraceEventRendererEvent(event) || isProfileCall(event);
}
export function isTraceEventDrawFrame(event) {
    // The extra check for INSTANT here is because in the past DrawFrame events had an ASYNC_NESTABLE_START and ASYNC_NESTABLE_END pair. We don't want to support those old events, so we have to check we are dealing with an instant event.
    return event.name === "DrawFrame" /* KnownEventName.DrawFrame */ && event.ph === "I" /* Phase.INSTANT */;
}
export function isLegacyTraceEventDrawFrameBegin(event) {
    return event.name === "DrawFrame" /* KnownEventName.DrawFrame */ && event.ph === "b" /* Phase.ASYNC_NESTABLE_START */;
}
export function isTraceEventBeginFrame(event) {
    // Old traces did not have frameSeqId; but we do not want to support these.
    return Boolean(event.name === "BeginFrame" /* KnownEventName.BeginFrame */ && event.args && 'frameSeqId' in event.args);
}
export function isTraceEventDroppedFrame(event) {
    // Old traces did not have frameSeqId; but we do not want to support these.
    return Boolean(event.name === "DroppedFrame" /* KnownEventName.DroppedFrame */ && event.args && 'frameSeqId' in event.args);
}
export function isTraceEventRequestMainThreadFrame(event) {
    return event.name === "RequestMainThreadFrame" /* KnownEventName.RequestMainThreadFrame */;
}
export function isTraceEventBeginMainThreadFrame(event) {
    return event.name === "BeginMainThreadFrame" /* KnownEventName.BeginMainThreadFrame */;
}
export function isTraceEventNeedsBeginFrameChanged(event) {
    return event.name === "NeedsBeginFrameChanged" /* KnownEventName.NeedsBeginFrameChanged */;
}
export function isTraceEventCommit(event) {
    // Old traces did not have frameSeqId; but we do not want to support these.
    return Boolean(event.name === "Commit" /* KnownEventName.Commit */ && event.args && 'frameSeqId' in event.args);
}
export function isTraceEventRasterTask(event) {
    return event.name === "RasterTask" /* KnownEventName.RasterTask */;
}
export function isTraceEventCompositeLayers(event) {
    return event.name === "CompositeLayers" /* KnownEventName.CompositeLayers */;
}
export function isTraceEventActivateLayerTree(event) {
    return event.name === "ActivateLayerTree" /* KnownEventName.ActivateLayerTree */;
}
export function isSyntheticInvalidation(event) {
    return event.name === 'SyntheticInvalidation';
}
export function isTraceEventDrawLazyPixelRef(event) {
    return event.name === "Draw LazyPixelRef" /* KnownEventName.DrawLazyPixelRef */;
}
export function isTraceEventDecodeLazyPixelRef(event) {
    return event.name === "Decode LazyPixelRef" /* KnownEventName.DecodeLazyPixelRef */;
}
export function isTraceEventDecodeImage(event) {
    return event.name === "Decode Image" /* KnownEventName.DecodeImage */;
}
export function isTraceEventSelectorStats(event) {
    return event.name === "SelectorStats" /* KnownEventName.SelectorStats */;
}
export function isTraceEventUpdateLayoutTree(event) {
    return event.name === "UpdateLayoutTree" /* KnownEventName.UpdateLayoutTree */;
}
export function isTraceEventLayout(event) {
    return event.name === "Layout" /* KnownEventName.Layout */;
}
export function isTraceEventInvalidateLayout(event) {
    return event.name === "InvalidateLayout" /* KnownEventName.InvalidateLayout */;
}
class ProfileIdTag {
    #profileIdTag;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ProfileID(value) {
    return value;
}
class CallFrameIdTag {
    #callFrameIdTag;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function CallFrameID(value) {
    return value;
}
class ProcessIdTag {
    #processIdTag;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ProcessID(value) {
    return value;
}
class ThreadIdTag {
    #threadIdTag;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ThreadID(value) {
    return value;
}
class WorkerIdTag {
    #workerIdTag;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function WorkerId(value) {
    return value;
}
export function isTraceEventComplete(event) {
    return event.ph === "X" /* Phase.COMPLETE */;
}
export function isTraceEventBegin(event) {
    return event.ph === "B" /* Phase.BEGIN */;
}
export function isTraceEventEnd(event) {
    return event.ph === "E" /* Phase.END */;
}
export function isTraceEventDispatch(event) {
    return event.name === 'EventDispatch';
}
export function isTraceEventInstant(event) {
    return event.ph === "I" /* Phase.INSTANT */;
}
export function isTraceEventRendererEvent(event) {
    return isTraceEventInstant(event) || isTraceEventComplete(event);
}
export function isTraceEventFireIdleCallback(event) {
    return event.name === 'FireIdleCallback';
}
export function isTraceEventSchedulePostMessage(event) {
    return event.name === "SchedulePostMessage" /* KnownEventName.SchedulePostMessage */;
}
export function isTraceEventHandlePostMessage(event) {
    return event.name === "HandlePostMessage" /* KnownEventName.HandlePostMessage */;
}
export function isTraceEventUpdateCounters(event) {
    return event.name === 'UpdateCounters';
}
export function isThreadName(traceEventData) {
    return traceEventData.name === "thread_name" /* KnownEventName.ThreadName */;
}
export function isProcessName(traceEventData) {
    return traceEventData.name === 'process_name';
}
export function isTraceEventTracingStartedInBrowser(traceEventData) {
    return traceEventData.name === "TracingStartedInBrowser" /* KnownEventName.TracingStartedInBrowser */;
}
export function isTraceEventFrameCommittedInBrowser(traceEventData) {
    return traceEventData.name === 'FrameCommittedInBrowser';
}
export function isTraceEventCommitLoad(traceEventData) {
    return traceEventData.name === 'CommitLoad';
}
export function isTraceEventNavigationStart(traceEventData) {
    return traceEventData.name === 'navigationStart';
}
export function isTraceEventAnimation(traceEventData) {
    // We've found some rare traces with an Animtation trace event from a different category: https://crbug.com/1472375#comment7
    return traceEventData.name === 'Animation' && traceEventData.cat.includes('devtools.timeline');
}
export function isTraceEventLayoutShift(traceEventData) {
    return traceEventData.name === 'LayoutShift';
}
export function isTraceEventLayoutInvalidationTracking(traceEventData) {
    return traceEventData.name === "LayoutInvalidationTracking" /* KnownEventName.LayoutInvalidationTracking */;
}
export function isTraceEventFirstContentfulPaint(traceEventData) {
    return traceEventData.name === 'firstContentfulPaint';
}
export function isTraceEventLargestContentfulPaintCandidate(traceEventData) {
    return traceEventData.name === "largestContentfulPaint::Candidate" /* KnownEventName.MarkLCPCandidate */;
}
export function isTraceEventLargestImagePaintCandidate(traceEventData) {
    return traceEventData.name === 'LargestImagePaint::Candidate';
}
export function isTraceEventLargestTextPaintCandidate(traceEventData) {
    return traceEventData.name === 'LargestTextPaint::Candidate';
}
export function isTraceEventMarkLoad(traceEventData) {
    return traceEventData.name === 'MarkLoad';
}
export function isTraceEventFirstPaint(traceEventData) {
    return traceEventData.name === 'firstPaint';
}
export function isTraceEventMarkDOMContent(traceEventData) {
    return traceEventData.name === 'MarkDOMContent';
}
export function isTraceEventInteractiveTime(traceEventData) {
    return traceEventData.name === 'InteractiveTime';
}
export function isTraceEventEventTiming(traceEventData) {
    return traceEventData.name === "EventTiming" /* KnownEventName.EventTiming */;
}
export function isTraceEventEventTimingEnd(traceEventData) {
    return isTraceEventEventTiming(traceEventData) && traceEventData.ph === "e" /* Phase.ASYNC_NESTABLE_END */;
}
export function isTraceEventEventTimingStart(traceEventData) {
    return isTraceEventEventTiming(traceEventData) && traceEventData.ph === "b" /* Phase.ASYNC_NESTABLE_START */;
}
export function isTraceEventGPUTask(traceEventData) {
    return traceEventData.name === 'GPUTask';
}
export function isTraceEventProfile(traceEventData) {
    return traceEventData.name === 'Profile';
}
export function isSyntheticCpuProfile(traceEventData) {
    return traceEventData.name === 'CpuProfile';
}
export function isTraceEventProfileChunk(traceEventData) {
    return traceEventData.name === 'ProfileChunk';
}
export function isTraceEventResourceChangePriority(traceEventData) {
    return traceEventData.name === 'ResourceChangePriority';
}
export function isTraceEventResourceSendRequest(traceEventData) {
    return traceEventData.name === 'ResourceSendRequest';
}
export function isTraceEventResourceReceiveResponse(traceEventData) {
    return traceEventData.name === 'ResourceReceiveResponse';
}
export function isTraceEventResourceMarkAsCached(traceEventData) {
    return traceEventData.name === 'ResourceMarkAsCached';
}
export function isTraceEventResourceFinish(traceEventData) {
    return traceEventData.name === 'ResourceFinish';
}
export function isTraceEventResourceWillSendRequest(traceEventData) {
    return traceEventData.name === 'ResourceWillSendRequest';
}
export function isTraceEventResourceReceivedData(traceEventData) {
    return traceEventData.name === 'ResourceReceivedData';
}
export function isSyntheticNetworkRequestDetailsEvent(traceEventData) {
    return traceEventData.name === 'SyntheticNetworkRequest';
}
export function isTraceEventPrePaint(traceEventData) {
    return traceEventData.name === 'PrePaint';
}
export function isTraceEventNavigationStartWithURL(event) {
    return Boolean(isTraceEventNavigationStart(event) && event.args.data && event.args.data.documentLoaderURL !== '');
}
export function isTraceEventMainFrameViewport(traceEventData) {
    return traceEventData.name === 'PaintTimingVisualizer::Viewport';
}
export function isSyntheticUserTiming(traceEventData) {
    if (traceEventData.cat !== 'blink.user_timing') {
        return false;
    }
    const data = traceEventData.args?.data;
    if (!data) {
        return false;
    }
    return 'beginEvent' in data && 'endEvent' in data;
}
export function isSyntheticConsoleTiming(traceEventData) {
    if (traceEventData.cat !== 'blink.console') {
        return false;
    }
    const data = traceEventData.args?.data;
    if (!data) {
        return false;
    }
    return 'beginEvent' in data && 'endEvent' in data;
}
export function isTraceEventPerformanceMeasure(traceEventData) {
    return traceEventData.cat === 'blink.user_timing' && isTraceEventAsyncPhase(traceEventData);
}
export function isTraceEventPerformanceMark(traceEventData) {
    return traceEventData.cat === 'blink.user_timing' &&
        (traceEventData.ph === "R" /* Phase.MARK */ || traceEventData.ph === "I" /* Phase.INSTANT */);
}
export function isTraceEventConsoleTime(traceEventData) {
    return traceEventData.cat === 'blink.console' && isTraceEventAsyncPhase(traceEventData);
}
export function isTraceEventTimeStamp(traceEventData) {
    return traceEventData.ph === "I" /* Phase.INSTANT */ && traceEventData.name === 'TimeStamp';
}
export function isTraceEventParseHTML(traceEventData) {
    return traceEventData.name === 'ParseHTML';
}
const asyncPhases = new Set([
    "b" /* Phase.ASYNC_NESTABLE_START */,
    "n" /* Phase.ASYNC_NESTABLE_INSTANT */,
    "e" /* Phase.ASYNC_NESTABLE_END */,
    "T" /* Phase.ASYNC_STEP_INTO */,
    "S" /* Phase.ASYNC_BEGIN */,
    "F" /* Phase.ASYNC_END */,
    "p" /* Phase.ASYNC_STEP_PAST */,
]);
export function isTraceEventAsyncPhase(traceEventData) {
    return asyncPhases.has(traceEventData.ph);
}
export function isSyntheticLayoutShift(traceEventData) {
    if (!isTraceEventLayoutShift(traceEventData) || !traceEventData.args.data) {
        return false;
    }
    return 'rawEvent' in traceEventData.args.data;
}
export function isProfileCall(event) {
    return 'callFrame' in event;
}
export function isTraceEventPaint(event) {
    return event.name === "Paint" /* KnownEventName.Paint */;
}
export function isTraceEventPaintImage(event) {
    return event.name === "PaintImage" /* KnownEventName.PaintImage */;
}
export function isTraceEventScrollLayer(event) {
    return event.name === "ScrollLayer" /* KnownEventName.ScrollLayer */;
}
export function isTraceEventSetLayerId(event) {
    return event.name === "SetLayerTreeId" /* KnownEventName.SetLayerTreeId */;
}
export function isTraceEventUpdateLayer(event) {
    return event.name === "UpdateLayer" /* KnownEventName.UpdateLayer */;
}
export function isTraceEventDisplayListItemListSnapshot(event) {
    return event.name === "cc::DisplayItemList" /* KnownEventName.DisplayItemListSnapshot */;
}
export function isTraceEventLayerTreeHostImplSnapshot(event) {
    return event.name === "cc::LayerTreeHostImpl" /* KnownEventName.LayerTreeHostImplSnapshot */;
}
export function isTraceEventFireAnimationFrame(event) {
    return event.name === "FireAnimationFrame" /* KnownEventName.FireAnimationFrame */;
}
export function isTraceEventRequestAnimationFrame(event) {
    return event.name === "RequestAnimationFrame" /* KnownEventName.RequestAnimationFrame */;
}
export function isTraceEventTimerInstall(event) {
    return event.name === "TimerInstall" /* KnownEventName.TimerInstall */;
}
export function isTraceEventTimerFire(event) {
    return event.name === "TimerFire" /* KnownEventName.TimerFire */;
}
export function isTraceEventRequestIdleCallback(event) {
    return event.name === "RequestIdleCallback" /* KnownEventName.RequestIdleCallback */;
}
export function isTraceEventWebSocketCreate(event) {
    return event.name === "WebSocketCreate" /* KnownEventName.WebSocketCreate */;
}
export function isTraceEventWebSocketSendHandshakeRequest(event) {
    return event.name === "WebSocketSendHandshakeRequest" /* KnownEventName.WebSocketSendHandshakeRequest */;
}
export function isTraceEventWebSocketReceiveHandshakeResponse(event) {
    return event.name === "WebSocketReceiveHandshakeResponse" /* KnownEventName.WebSocketReceiveHandshakeResponse */;
}
export function isTraceEventWebSocketDestroy(event) {
    return event.name === "WebSocketDestroy" /* KnownEventName.WebSocketDestroy */;
}
export function isWebSocketTraceEvent(event) {
    return isTraceEventWebSocketCreate(event) || isTraceEventWebSocketDestroy(event) ||
        isTraceEventWebSocketReceiveHandshakeResponse(event) || isTraceEventWebSocketSendHandshakeRequest(event);
}
export function isTraceEventV8Compile(event) {
    return event.name === "v8.compile" /* KnownEventName.Compile */;
}
export function isTraceEventFunctionCall(event) {
    return event.name === "FunctionCall" /* KnownEventName.FunctionCall */;
}
/**
 * Generally, before JS is executed, a trace event is dispatched that
 * parents the JS calls. These we call "invocation" events. This
 * function determines if an event is one of such.
 */
export function isJSInvocationEvent(event) {
    switch (event.name) {
        case "RunMicrotasks" /* KnownEventName.RunMicrotasks */:
        case "FunctionCall" /* KnownEventName.FunctionCall */:
        case "EvaluateScript" /* KnownEventName.EvaluateScript */:
        case "v8.evaluateModule" /* KnownEventName.EvaluateModule */:
        case "EventDispatch" /* KnownEventName.EventDispatch */:
        case "V8.Execute" /* KnownEventName.V8Execute */:
            return true;
    }
    // Also consider any new v8 trace events. (eg 'V8.RunMicrotasks' and 'v8.run')
    if (event.name.startsWith('v8') || event.name.startsWith('V8')) {
        return true;
    }
    return false;
}
// NOT AN EXHAUSTIVE LIST: just some categories we use and refer
// to in multiple places.
export const Categories = {
    Console: 'blink.console',
    UserTiming: 'blink.user_timing',
    Loading: 'loading',
};
//# sourceMappingURL=TraceEvents.js.map