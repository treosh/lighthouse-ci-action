import { Integrations as Integrations$1 } from '@sentry/core';
export { Hub, SDK_VERSION, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, Scope, addBreadcrumb, addEventProcessor, addGlobalEventProcessor, addIntegration, captureCheckIn, captureEvent, captureException, captureMessage, captureSession, close, configureScope, continueTrace, createTransport, endSession, extractTraceparentData, flush, functionToStringIntegration, getActiveSpan, getActiveTransaction, getClient, getCurrentHub, getCurrentScope, getGlobalScope, getHubFromCarrier, getIsolationScope, getSpanStatusFromHttpCode, inboundFiltersIntegration, isInitialized, lastEventId, linkedErrorsIntegration, makeMain, metrics, parameterize, requestDataIntegration, runWithAsyncContext, setContext, setCurrentClient, setExtra, setExtras, setHttpStatus, setMeasurement, setTag, setTags, setUser, spanStatusfromHttpCode, startActiveSpan, startInactiveSpan, startSession, startSpan, startSpanManual, startTransaction, trace, withActiveSpan, withIsolationScope, withMonitor, withScope } from '@sentry/core';
export { autoDiscoverNodePerformanceMonitoringIntegrations } from './tracing/index.js';
export { NodeClient } from './client.js';
export { makeNodeTransport } from './transports/http.js';
export { defaultIntegrations, defaultStackParser, getDefaultIntegrations, getSentryRelease, init } from './sdk.js';
export { DEFAULT_USER_INCLUDES, addRequestDataToEvent, extractRequestData } from '@sentry/utils';
export { deepReadDirSync } from './utils.js';
import { createGetModuleFromFilename } from './module.js';
export { createGetModuleFromFilename } from './module.js';
export { enableAnrDetection } from './integrations/anr/legacy.js';
import * as handlers from './handlers.js';
export { handlers as Handlers };
import * as index from './integrations/index.js';
import * as integrations from './tracing/integrations.js';
export { captureConsoleIntegration, debugIntegration, dedupeIntegration, extraErrorDataIntegration, httpClientIntegration, reportingObserverIntegration, rewriteFramesIntegration, sessionTimingIntegration } from '@sentry/integrations';
export { consoleIntegration } from './integrations/console.js';
export { onUncaughtExceptionIntegration } from './integrations/onuncaughtexception.js';
export { onUnhandledRejectionIntegration } from './integrations/onunhandledrejection.js';
export { modulesIntegration } from './integrations/modules.js';
export { contextLinesIntegration } from './integrations/contextlines.js';
export { nodeContextIntegration } from './integrations/context.js';
export { localVariablesIntegration } from './integrations/local-variables/index.js';
export { spotlightIntegration } from './integrations/spotlight.js';
export { anrIntegration } from './integrations/anr/index.js';
export { hapiErrorPlugin, hapiIntegration } from './integrations/hapi/index.js';
export { Undici, nativeNodeFetchintegration } from './integrations/undici/index.js';
export { Http, httpIntegration } from './integrations/http.js';
export { trpcMiddleware } from './trpc.js';
import { instrumentCron } from './cron/cron.js';
import { instrumentNodeCron } from './cron/node-cron.js';
import { instrumentNodeSchedule } from './cron/node-schedule.js';

/**
 * @deprecated use `createGetModuleFromFilename` instead.
 */
const getModuleFromFilename = createGetModuleFromFilename();

// TODO: Deprecate this once we migrated tracing integrations
const Integrations = {
  // eslint-disable-next-line deprecation/deprecation
  ...Integrations$1,
  ...index,
  ...integrations,
};

/** Methods to instrument cron libraries for Sentry check-ins */
const cron = {
  instrumentCron,
  instrumentNodeCron,
  instrumentNodeSchedule,
};

export { Integrations, cron, getModuleFromFilename };
//# sourceMappingURL=index.js.map
