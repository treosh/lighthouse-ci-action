/**
 * @param {Trace.Types.Events.Event[]} traceEvents
 * @return {Promise<{parsedTrace: Trace.Handlers.Types.ParsedTrace, insights: Trace.Insights.Types.TraceInsightSets, model: Trace.TraceModel.Model}>}
 */
export function analyzeEvents(traceEvents: Trace.Types.Events.Event[]): Promise<{
    parsedTrace: Trace.Handlers.Types.ParsedTrace;
    insights: Trace.Insights.Types.TraceInsightSets;
    model: Trace.TraceModel.Model;
}>;
/**
 * @param {string} filename
 * @returns {ReturnType<analyzeEvents>}
 */
export function analyzeTrace(filename: string): ReturnType<typeof analyzeEvents>;
export function polyfillDOMRect(): void;
export type Trace = typeof Trace;
import * as Trace from './models/trace/trace.js';
//# sourceMappingURL=analyze-trace.d.mts.map