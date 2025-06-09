// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Platform from '../../../core/platform/platform.js';
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
import * as HandlerHelpers from './helpers.js';
import { data as metaHandlerData } from './MetaHandler.js';
const MILLISECONDS_TO_MICROSECONDS = 1000;
const SECONDS_TO_MICROSECONDS = 1000000;
const webSocketData = new Map();
const linkPreconnectEvents = [];
const requestMap = new Map();
const requestsById = new Map();
const requestsByOrigin = new Map();
const requestsByTime = [];
const networkRequestEventByInitiatorUrl = new Map();
const eventToInitiatorMap = new Map();
/**
 * These are to store ThirdParty data relationships between entities and events. To reduce iterating through data
 * more than we have to, here we start building the caches. After this, the RendererHandler will update
 * the relationships. When handling ThirdParty references, use the one in the RendererHandler instead.
 */
const entityMappings = {
    eventsByEntity: new Map(),
    entityByEvent: new Map(),
    createdEntityCache: new Map(),
};
function storeTraceEventWithRequestId(requestId, key, value) {
    if (!requestMap.has(requestId)) {
        requestMap.set(requestId, {});
    }
    const traceEvents = requestMap.get(requestId);
    if (!traceEvents) {
        throw new Error(`Unable to locate trace events for request ID ${requestId}`);
    }
    if (Array.isArray(traceEvents[key])) {
        const target = traceEvents[key];
        const values = value;
        target.push(...values);
    }
    else {
        traceEvents[key] = value;
    }
}
function firstPositiveValueInList(entries) {
    for (const entry of entries) {
        if (entry && entry > 0) {
            return entry;
        }
    }
    // In the event we don't find a positive value, we return 0 so as to
    // be a mathematical noop. It's typically not correct to return – say –
    // a -1 here because it would affect the calculation of stats below.
    return 0;
}
export function reset() {
    requestsById.clear();
    requestsByOrigin.clear();
    requestMap.clear();
    requestsByTime.length = 0;
    networkRequestEventByInitiatorUrl.clear();
    eventToInitiatorMap.clear();
    webSocketData.clear();
    entityMappings.eventsByEntity.clear();
    entityMappings.entityByEvent.clear();
    entityMappings.createdEntityCache.clear();
    linkPreconnectEvents.length = 0;
}
export function handleEvent(event) {
    if (Types.Events.isResourceChangePriority(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'changePriority', event);
        return;
    }
    if (Types.Events.isResourceWillSendRequest(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'willSendRequests', [event]);
        return;
    }
    if (Types.Events.isResourceSendRequest(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'sendRequests', [event]);
        return;
    }
    if (Types.Events.isResourceReceiveResponse(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'receiveResponse', event);
        return;
    }
    if (Types.Events.isResourceReceivedData(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'receivedData', [event]);
        return;
    }
    if (Types.Events.isResourceFinish(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'resourceFinish', event);
        return;
    }
    if (Types.Events.isResourceMarkAsCached(event)) {
        storeTraceEventWithRequestId(event.args.data.requestId, 'resourceMarkAsCached', event);
        return;
    }
    if (Types.Events.isWebSocketCreate(event) || Types.Events.isWebSocketInfo(event) ||
        Types.Events.isWebSocketTransfer(event)) {
        const identifier = event.args.data.identifier;
        if (!webSocketData.has(identifier)) {
            if (event.args.data.frame) {
                webSocketData.set(identifier, {
                    frame: event.args.data.frame,
                    webSocketIdentifier: identifier,
                    events: [],
                    syntheticConnection: null,
                });
            }
            else if (event.args.data.workerId) {
                webSocketData.set(identifier, {
                    workerId: event.args.data.workerId,
                    webSocketIdentifier: identifier,
                    events: [],
                    syntheticConnection: null,
                });
            }
        }
        webSocketData.get(identifier)?.events.push(event);
    }
    if (Types.Events.isLinkPreconnect(event)) {
        linkPreconnectEvents.push(event);
        return;
    }
}
export async function finalize() {
    const { rendererProcessesByFrame } = metaHandlerData();
    for (const [requestId, request] of requestMap.entries()) {
        // If we have an incomplete set of events here, we choose to drop the network
        // request rather than attempt to synthesize the missing data.
        if (!request.sendRequests) {
            continue;
        }
        // In the data we may get multiple willSendRequests and sendRequests, which
        // will indicate that there are redirects for a given (sub)resource. In the
        // case of a navigation, e.g., example.com/ we will get willSendRequests,
        // and we should use these to calculate time spent in redirects.
        // In the case of sub-resources, however, e.g., example.com/foo.js we will
        // *only* get sendRequests, and we use these instead of willSendRequests
        // to detect the time in redirects. We always use the sendRequest for the
        // url, priority etc since it contains those values, but we use the
        // willSendRequest (if it exists) to calculate the timestamp and durations
        // of redirects.
        const redirects = [];
        for (let i = 0; i < request.sendRequests.length - 1; i++) {
            const sendRequest = request.sendRequests[i];
            const nextSendRequest = request.sendRequests[i + 1];
            // Use the willSendRequests as the source for redirects if possible.
            // We default to those of the sendRequests, however, since willSendRequest
            // is not guaranteed to be present in the data for every request.
            let ts = sendRequest.ts;
            let dur = Types.Timing.Micro(nextSendRequest.ts - sendRequest.ts);
            if (request.willSendRequests?.[i] && request.willSendRequests[i + 1]) {
                const willSendRequest = request.willSendRequests[i];
                const nextWillSendRequest = request.willSendRequests[i + 1];
                ts = willSendRequest.ts;
                dur = Types.Timing.Micro(nextWillSendRequest.ts - willSendRequest.ts);
            }
            redirects.push({
                url: sendRequest.args.data.url,
                priority: sendRequest.args.data.priority,
                requestMethod: sendRequest.args.data.requestMethod,
                ts,
                dur,
            });
        }
        const firstSendRequest = request.sendRequests[0];
        const finalSendRequest = request.sendRequests[request.sendRequests.length - 1];
        // We currently do not want to include data URI requests. We may revisit this in the future.
        if (finalSendRequest.args.data.url.startsWith('data:')) {
            continue;
        }
        // If a ResourceFinish event with an encoded data length is received,
        // then the resource was not cached; it was fetched before it was
        // requested, e.g. because it was pushed in this navigation.
        const isPushedResource = request.resourceFinish?.args.data.encodedDataLength !== 0;
        // This works around crbug.com/998397, which reports pushed resources, and resources served by a service worker as disk cached.
        const isDiskCached = !!request.receiveResponse && request.receiveResponse.args.data.fromCache &&
            !request.receiveResponse.args.data.fromServiceWorker && !isPushedResource;
        // If the request contains a resourceMarkAsCached event, it was served from memory cache.
        // The timing data returned is from the original (uncached) request, which
        // means that if we leave the above network record data as-is when the
        // request came from either the disk cache or memory cache, our calculations
        // will be incorrect.
        //
        // So we use this flag so when we calculate the timestamps of the various
        // events, we can overwrite them.
        // These timestamps may not be perfect (indeed they don't always match
        // the Network CDP domain exactly, which is likely an artifact of the way
        // the data is routed on the backend), but they're the closest we have.
        const isMemoryCached = request.resourceMarkAsCached !== undefined;
        // If a request has `resourceMarkAsCached` field, the `timing` field is not correct.
        // So let's discard it and override to 0 (which will be handled in later logic if timing field is undefined).
        const timing = isMemoryCached ? undefined : request.receiveResponse?.args.data.timing;
        // If a non-cached response has no |timing|, we ignore it. An example of this is chrome://new-page / about:blank.
        if (request.receiveResponse && !timing && !isMemoryCached) {
            continue;
        }
        const initialPriority = finalSendRequest.args.data.priority;
        let finalPriority = initialPriority;
        if (request.changePriority) {
            finalPriority = request.changePriority.args.data.priority;
        }
        // Network timings are complicated.
        // https://raw.githubusercontent.com/GoogleChrome/lighthouse/main/docs/Network-Timings.svg is generally correct, but.. less so for navigations/redirects/etc.
        // Start time
        // =======================
        // The time where the request started, which is either the first willSendRequest
        // event if there is one, or, if there is not, the sendRequest.
        const startTime = (request.willSendRequests?.length) ? Types.Timing.Micro(request.willSendRequests[0].ts) :
            Types.Timing.Micro(firstSendRequest.ts);
        // End redirect time
        // =======================
        // It's possible that when we start requesting data we will receive redirections.
        // Here we note the time of the *last* willSendRequest / sendRequest event,
        // which is used later on in the calculations for time queueing etc.
        const endRedirectTime = (request.willSendRequests?.length) ?
            Types.Timing.Micro(request.willSendRequests[request.willSendRequests.length - 1].ts) :
            Types.Timing.Micro(finalSendRequest.ts);
        // Finish time and end time
        // =======================
        // The finish time and the end time are subtly different.
        //  - Finish time: records the point at which the network stack stopped receiving the data
        //  - End time: the timestamp of the finish event itself (if one exists)
        //
        // The end time, then, will be slightly after the finish time.
        const endTime = request.resourceFinish ? request.resourceFinish.ts : endRedirectTime;
        const finishTime = request.resourceFinish?.args.data.finishTime ?
            Types.Timing.Micro(request.resourceFinish.args.data.finishTime * SECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(endTime);
        // Network duration
        // =======================
        // Time spent on the network.
        const networkDuration = Types.Timing.Micro(timing ? (finishTime || endRedirectTime) - endRedirectTime : 0);
        // Processing duration
        // =======================
        // Time spent from start to end.
        const processingDuration = Types.Timing.Micro(endTime - (finishTime || endTime));
        // Redirection duration
        // =======================
        // Time between the first willSendRequest / sendRequest and last. This we place in *front* of the
        // queueing, since the queueing time that we know about from the trace data is only the last request,
        // i.e., the one that occurs after all the redirects.
        const redirectionDuration = Types.Timing.Micro(endRedirectTime - startTime);
        // Queueing
        // =======================
        // The amount of time queueing is the time between the request's start time to the requestTime
        // arg recorded in the receiveResponse event. In the cases where the recorded start time is larger
        // that the requestTime we set queueing time to zero.
        const queueingFromTraceData = timing ? timing.requestTime * SECONDS_TO_MICROSECONDS - endRedirectTime : 0;
        const queueing = Types.Timing.Micro(Platform.NumberUtilities.clamp(queueingFromTraceData, 0, Number.MAX_VALUE));
        // Stalled
        // =======================
        // If the request is cached, the amount of time stalled is the time between the start time and
        // receiving a response.
        // Otherwise it is whichever positive number comes first from the following timing info:
        // DNS start, Connection start, Send Start, or the time duration between our start time and
        // receiving a response.
        const stalled = timing ?
            Types.Timing.Micro(firstPositiveValueInList([
                timing.dnsStart * MILLISECONDS_TO_MICROSECONDS,
                timing.connectStart * MILLISECONDS_TO_MICROSECONDS,
                timing.sendStart * MILLISECONDS_TO_MICROSECONDS,
                request.receiveResponse ? (request.receiveResponse.ts - endRedirectTime) : null,
            ])) :
            (request.receiveResponse ? Types.Timing.Micro(request.receiveResponse.ts - startTime) : Types.Timing.Micro(0));
        // Sending HTTP request
        // =======================
        // Time when the HTTP request is sent.
        const sendStartTime = timing ?
            Types.Timing.Micro(timing.requestTime * SECONDS_TO_MICROSECONDS + timing.sendStart * MILLISECONDS_TO_MICROSECONDS) :
            startTime;
        // Waiting
        // =======================
        // Time from when the send finished going to when the headers were received.
        const waiting = timing ?
            Types.Timing.Micro((timing.receiveHeadersEnd - timing.sendEnd) * MILLISECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(0);
        // Download
        // =======================
        // Time from receipt of headers to the finish time.
        const downloadStart = timing ?
            Types.Timing.Micro(timing.requestTime * SECONDS_TO_MICROSECONDS + timing.receiveHeadersEnd * MILLISECONDS_TO_MICROSECONDS) :
            startTime;
        const download = timing ? Types.Timing.Micro(((finishTime || downloadStart) - downloadStart)) :
            request.receiveResponse ? Types.Timing.Micro(endTime - request.receiveResponse.ts) :
                Types.Timing.Micro(0);
        const totalTime = Types.Timing.Micro(networkDuration + processingDuration);
        // Collect a few values from the timing info.
        // If the Network request is cached, these fields will be zero, so the minus will zero out them.
        const dnsLookup = timing ? Types.Timing.Micro((timing.dnsEnd - timing.dnsStart) * MILLISECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(0);
        const ssl = timing ? Types.Timing.Micro((timing.sslEnd - timing.sslStart) * MILLISECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(0);
        const proxyNegotiation = timing ?
            Types.Timing.Micro((timing.proxyEnd - timing.proxyStart) * MILLISECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(0);
        const requestSent = timing ?
            Types.Timing.Micro((timing.sendEnd - timing.sendStart) * MILLISECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(0);
        const initialConnection = timing ?
            Types.Timing.Micro((timing.connectEnd - timing.connectStart) * MILLISECONDS_TO_MICROSECONDS) :
            Types.Timing.Micro(0);
        // Finally get some of the general data from the trace events.
        const { frame, url, renderBlocking } = finalSendRequest.args.data;
        const { encodedDataLength, decodedBodyLength } = request.resourceFinish ? request.resourceFinish.args.data : { encodedDataLength: 0, decodedBodyLength: 0 };
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const requestingFrameUrl = Helpers.Trace.activeURLForFrameAtTime(frame, finalSendRequest.ts, rendererProcessesByFrame) || '';
        // Construct a synthetic trace event for this network request.
        const networkEvent = Helpers.SyntheticEvents.SyntheticEventsManager.registerSyntheticEvent({
            rawSourceEvent: finalSendRequest,
            args: {
                data: {
                    // All data we create from trace events should be added to |syntheticData|.
                    syntheticData: {
                        dnsLookup,
                        download,
                        downloadStart,
                        finishTime,
                        initialConnection,
                        isDiskCached,
                        isHttps,
                        isMemoryCached,
                        isPushedResource,
                        networkDuration,
                        processingDuration,
                        proxyNegotiation,
                        queueing,
                        redirectionDuration,
                        requestSent,
                        sendStartTime,
                        ssl,
                        stalled,
                        totalTime,
                        waiting,
                    },
                    // All fields below are from TraceEventsForNetworkRequest.
                    decodedBodyLength,
                    encodedDataLength,
                    frame,
                    fromServiceWorker: request.receiveResponse?.args.data.fromServiceWorker,
                    isLinkPreload: finalSendRequest.args.data.isLinkPreload || false,
                    mimeType: request.receiveResponse?.args.data.mimeType ?? '',
                    priority: finalPriority,
                    initialPriority,
                    protocol: request.receiveResponse?.args.data.protocol ?? 'unknown',
                    redirects,
                    // In the event the property isn't set, assume non-blocking.
                    renderBlocking: renderBlocking ?? 'non_blocking',
                    requestId,
                    requestingFrameUrl,
                    requestMethod: finalSendRequest.args.data.requestMethod,
                    resourceType: finalSendRequest.args.data.resourceType ?? "Other" /* Protocol.Network.ResourceType.Other */,
                    statusCode: request.receiveResponse?.args.data.statusCode ?? 0,
                    responseHeaders: request.receiveResponse?.args.data.headers ?? null,
                    fetchPriorityHint: finalSendRequest.args.data.fetchPriorityHint ?? 'auto',
                    initiator: finalSendRequest.args.data.initiator,
                    stackTrace: finalSendRequest.args.data.stackTrace,
                    timing,
                    url,
                    failed: request.resourceFinish?.args.data.didFail ?? false,
                    finished: Boolean(request.resourceFinish),
                    hasResponse: Boolean(request.receiveResponse),
                    connectionId: request.receiveResponse?.args.data.connectionId,
                    connectionReused: request.receiveResponse?.args.data.connectionReused,
                },
            },
            cat: 'loading',
            name: "SyntheticNetworkRequest" /* Types.Events.Name.SYNTHETIC_NETWORK_REQUEST */,
            ph: "X" /* Types.Events.Phase.COMPLETE */,
            dur: Types.Timing.Micro(endTime - startTime),
            tdur: Types.Timing.Micro(endTime - startTime),
            ts: Types.Timing.Micro(startTime),
            tts: Types.Timing.Micro(startTime),
            pid: finalSendRequest.pid,
            tid: finalSendRequest.tid,
        });
        const requests = Platform.MapUtilities.getWithDefault(requestsByOrigin, parsedUrl.host, () => {
            return {
                renderBlocking: [],
                nonRenderBlocking: [],
                all: [],
            };
        });
        // For ease of rendering we sometimes want to differentiate between
        // render-blocking and non-render-blocking, so we divide the data here.
        if (!Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(networkEvent)) {
            requests.nonRenderBlocking.push(networkEvent);
        }
        else {
            requests.renderBlocking.push(networkEvent);
        }
        // However, there are also times where we just want to loop through all
        // the captured requests, so here we store all of them together.
        requests.all.push(networkEvent);
        requestsByTime.push(networkEvent);
        requestsById.set(networkEvent.args.data.requestId, networkEvent);
        // Update entity relationships for network events
        HandlerHelpers.addNetworkRequestToEntityMapping(networkEvent, entityMappings, request);
        // Establish initiator relationships
        const initiatorUrl = networkEvent.args.data.initiator?.url ||
            Helpers.Trace.getZeroIndexedStackTraceInEventPayload(networkEvent)?.at(0)?.url;
        if (initiatorUrl) {
            const events = networkRequestEventByInitiatorUrl.get(initiatorUrl) ?? [];
            events.push(networkEvent);
            networkRequestEventByInitiatorUrl.set(initiatorUrl, events);
        }
    }
    for (const request of requestsByTime) {
        const initiatedEvents = networkRequestEventByInitiatorUrl.get(request.args.data.url);
        if (initiatedEvents) {
            for (const initiatedEvent of initiatedEvents) {
                eventToInitiatorMap.set(initiatedEvent, request);
            }
        }
    }
    finalizeWebSocketData();
}
export function data() {
    return {
        byId: requestsById,
        byOrigin: requestsByOrigin,
        byTime: requestsByTime,
        eventToInitiator: eventToInitiatorMap,
        webSocket: [...webSocketData.values()],
        entityMappings: {
            entityByEvent: new Map(entityMappings.entityByEvent),
            eventsByEntity: new Map(entityMappings.eventsByEntity),
            createdEntityCache: new Map(entityMappings.createdEntityCache),
        },
        linkPreconnectEvents,
    };
}
export function deps() {
    return ['Meta'];
}
function finalizeWebSocketData() {
    // for each WebSocketTraceData in webSocketData map, we create a synthetic event
    // to represent the entire WebSocket connection. This is done by finding the start and end event
    // if they exist, and if they don't, we use the first event in the list for start, and the traceBounds.max
    // for the end. So each WebSocketTraceData will have
    // {
    //    events:  the list of WebSocket events
    //    syntheticConnection:  the synthetic event representing the entire WebSocket connection
    // }
    webSocketData.forEach(data => {
        let startEvent = null;
        let endEvent = null;
        for (const event of data.events) {
            if (Types.Events.isWebSocketCreate(event)) {
                startEvent = event;
            }
            if (Types.Events.isWebSocketDestroy(event)) {
                endEvent = event;
            }
        }
        data.syntheticConnection = createSyntheticWebSocketConnection(startEvent, endEvent, data.events[0]);
    });
}
function createSyntheticWebSocketConnection(startEvent, endEvent, firstRecordedEvent) {
    const { traceBounds } = metaHandlerData();
    const startTs = startEvent ? startEvent.ts : traceBounds.min;
    const endTs = endEvent ? endEvent.ts : traceBounds.max;
    const duration = endTs - startTs;
    const mainEvent = startEvent || endEvent || firstRecordedEvent;
    return {
        name: 'SyntheticWebSocketConnection',
        cat: mainEvent.cat,
        ph: "X" /* Types.Events.Phase.COMPLETE */,
        ts: startTs,
        dur: duration,
        pid: mainEvent.pid,
        tid: mainEvent.tid,
        s: mainEvent.s,
        rawSourceEvent: mainEvent,
        _tag: 'SyntheticEntryTag',
        args: {
            data: {
                identifier: mainEvent.args.data.identifier,
                priority: "Low" /* Protocol.Network.ResourcePriority.Low */,
                url: mainEvent.args.data.url || '',
            },
        },
    };
}
//# sourceMappingURL=NetworkRequestsHandler.js.map