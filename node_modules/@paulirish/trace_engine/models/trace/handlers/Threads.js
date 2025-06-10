function getThreadTypeForRendererThread(pid, thread, auctionWorkletsData) {
    let threadType = "OTHER" /* ThreadType.OTHER */;
    if (thread.name === 'CrRendererMain') {
        threadType = "MAIN_THREAD" /* ThreadType.MAIN_THREAD */;
    }
    else if (thread.name === 'DedicatedWorker thread') {
        threadType = "WORKER" /* ThreadType.WORKER */;
    }
    else if (thread.name?.startsWith('CompositorTileWorker')) {
        threadType = "RASTERIZER" /* ThreadType.RASTERIZER */;
    }
    else if (auctionWorkletsData.worklets.has(pid)) {
        threadType = "AUCTION_WORKLET" /* ThreadType.AUCTION_WORKLET */;
    }
    else if (thread.name?.startsWith('ThreadPool')) {
        // TODO(paulirish): perhaps exclude ThreadPoolServiceThread entirely
        threadType = "THREAD_POOL" /* ThreadType.THREAD_POOL */;
    }
    return threadType;
}
export function threadsInRenderer(rendererData, auctionWorkletsData) {
    const foundThreads = [];
    // If we have Renderer threads, we prefer to use those. In the event that a
    // trace is a CPU Profile trace, we will never have Renderer threads, so we
    // know if there are no Renderer threads that we can fallback to using the
    // data from the SamplesHandler.
    if (rendererData.processes.size) {
        for (const [pid, process] of rendererData.processes) {
            for (const [tid, thread] of process.threads) {
                if (!thread.tree) {
                    // Drop threads where we could not create the tree; this indicates
                    // unexpected data and we won't be able to support all the UI
                    // filtering we need.
                    continue;
                }
                const threadType = getThreadTypeForRendererThread(pid, thread, auctionWorkletsData);
                foundThreads.push({
                    name: thread.name,
                    pid,
                    tid,
                    processIsOnMainFrame: process.isOnMainFrame,
                    entries: thread.entries,
                    tree: thread.tree,
                    type: threadType,
                    entryToNode: rendererData.entryToNode,
                });
            }
        }
    }
    return foundThreads;
}
const threadsInTraceCache = new WeakMap();
/**
 * Given trace parsed data, this helper will return a high level array of
 * ThreadData. This is useful because it allows you to get a list of threads
 * regardless of if the trace is a CPU Profile or a Tracing profile. Thus you
 * can use this helper to iterate over threads in confidence that it will work
 * for both trace types.
 * The resulting data is cached per-trace, so you can safely call this multiple times.
 */
export function threadsInTrace(parsedTrace) {
    const cached = threadsInTraceCache.get(parsedTrace);
    if (cached) {
        return cached;
    }
    // If we have Renderer threads, we prefer to use those.
    const threadsFromRenderer = threadsInRenderer(parsedTrace.Renderer, parsedTrace.AuctionWorklets);
    if (threadsFromRenderer.length) {
        threadsInTraceCache.set(parsedTrace, threadsFromRenderer);
        return threadsFromRenderer;
    }
    // If it's a CPU Profile trace, there will be no Renderer threads.
    // We can fallback to using the data from the SamplesHandler.
    const foundThreads = [];
    if (parsedTrace.Samples.profilesInProcess.size) {
        for (const [pid, process] of parsedTrace.Samples.profilesInProcess) {
            for (const [tid, thread] of process) {
                if (!thread.profileTree) {
                    // Drop threads where we could not create the tree; this indicates
                    // unexpected data and we won't be able to support all the UI
                    // filtering we need.
                    continue;
                }
                foundThreads.push({
                    pid,
                    tid,
                    // CPU Profile threads do not have a name.
                    name: null,
                    entries: thread.profileCalls,
                    // There is no concept of a "Main Frame" in a CPU profile.
                    processIsOnMainFrame: false,
                    tree: thread.profileTree,
                    type: "CPU_PROFILE" /* ThreadType.CPU_PROFILE */,
                    entryToNode: parsedTrace.Samples.entryToNode,
                });
            }
        }
    }
    threadsInTraceCache.set(parsedTrace, foundThreads);
    return foundThreads;
}
//# sourceMappingURL=Threads.js.map