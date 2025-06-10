Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const index = require('./tracing/index.js');
const client = require('./client.js');
const http = require('./transports/http.js');
const sdk = require('./sdk.js');
const utils = require('@sentry/utils');
const utils$1 = require('./utils.js');
const module$1 = require('./module.js');
const legacy = require('./integrations/anr/legacy.js');
const handlers = require('./handlers.js');
const index$5 = require('./integrations/index.js');
const integrations$1 = require('./tracing/integrations.js');
const integrations = require('@sentry/integrations');
const console = require('./integrations/console.js');
const onuncaughtexception = require('./integrations/onuncaughtexception.js');
const onunhandledrejection = require('./integrations/onunhandledrejection.js');
const modules = require('./integrations/modules.js');
const contextlines = require('./integrations/contextlines.js');
const context = require('./integrations/context.js');
const index$1 = require('./integrations/local-variables/index.js');
const spotlight = require('./integrations/spotlight.js');
const index$2 = require('./integrations/anr/index.js');
const index$3 = require('./integrations/hapi/index.js');
const index$4 = require('./integrations/undici/index.js');
const http$1 = require('./integrations/http.js');
const trpc = require('./trpc.js');
const cron$1 = require('./cron/cron.js');
const nodeCron = require('./cron/node-cron.js');
const nodeSchedule = require('./cron/node-schedule.js');

/**
 * @deprecated use `createGetModuleFromFilename` instead.
 */
const getModuleFromFilename = module$1.createGetModuleFromFilename();

// TODO: Deprecate this once we migrated tracing integrations
const Integrations = {
  // eslint-disable-next-line deprecation/deprecation
  ...core.Integrations,
  ...index$5,
  ...integrations$1,
};

/** Methods to instrument cron libraries for Sentry check-ins */
const cron = {
  instrumentCron: cron$1.instrumentCron,
  instrumentNodeCron: nodeCron.instrumentNodeCron,
  instrumentNodeSchedule: nodeSchedule.instrumentNodeSchedule,
};

exports.Hub = core.Hub;
exports.SDK_VERSION = core.SDK_VERSION;
exports.SEMANTIC_ATTRIBUTE_SENTRY_OP = core.SEMANTIC_ATTRIBUTE_SENTRY_OP;
exports.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = core.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
exports.Scope = core.Scope;
exports.addBreadcrumb = core.addBreadcrumb;
exports.addEventProcessor = core.addEventProcessor;
exports.addGlobalEventProcessor = core.addGlobalEventProcessor;
exports.addIntegration = core.addIntegration;
exports.captureCheckIn = core.captureCheckIn;
exports.captureEvent = core.captureEvent;
exports.captureException = core.captureException;
exports.captureMessage = core.captureMessage;
exports.captureSession = core.captureSession;
exports.close = core.close;
exports.configureScope = core.configureScope;
exports.continueTrace = core.continueTrace;
exports.createTransport = core.createTransport;
exports.endSession = core.endSession;
exports.extractTraceparentData = core.extractTraceparentData;
exports.flush = core.flush;
exports.functionToStringIntegration = core.functionToStringIntegration;
exports.getActiveSpan = core.getActiveSpan;
exports.getActiveTransaction = core.getActiveTransaction;
exports.getClient = core.getClient;
exports.getCurrentHub = core.getCurrentHub;
exports.getCurrentScope = core.getCurrentScope;
exports.getGlobalScope = core.getGlobalScope;
exports.getHubFromCarrier = core.getHubFromCarrier;
exports.getIsolationScope = core.getIsolationScope;
exports.getSpanStatusFromHttpCode = core.getSpanStatusFromHttpCode;
exports.inboundFiltersIntegration = core.inboundFiltersIntegration;
exports.isInitialized = core.isInitialized;
exports.lastEventId = core.lastEventId;
exports.linkedErrorsIntegration = core.linkedErrorsIntegration;
exports.makeMain = core.makeMain;
exports.metrics = core.metrics;
exports.parameterize = core.parameterize;
exports.requestDataIntegration = core.requestDataIntegration;
exports.runWithAsyncContext = core.runWithAsyncContext;
exports.setContext = core.setContext;
exports.setCurrentClient = core.setCurrentClient;
exports.setExtra = core.setExtra;
exports.setExtras = core.setExtras;
exports.setHttpStatus = core.setHttpStatus;
exports.setMeasurement = core.setMeasurement;
exports.setTag = core.setTag;
exports.setTags = core.setTags;
exports.setUser = core.setUser;
exports.spanStatusfromHttpCode = core.spanStatusfromHttpCode;
exports.startActiveSpan = core.startActiveSpan;
exports.startInactiveSpan = core.startInactiveSpan;
exports.startSession = core.startSession;
exports.startSpan = core.startSpan;
exports.startSpanManual = core.startSpanManual;
exports.startTransaction = core.startTransaction;
exports.trace = core.trace;
exports.withActiveSpan = core.withActiveSpan;
exports.withIsolationScope = core.withIsolationScope;
exports.withMonitor = core.withMonitor;
exports.withScope = core.withScope;
exports.autoDiscoverNodePerformanceMonitoringIntegrations = index.autoDiscoverNodePerformanceMonitoringIntegrations;
exports.NodeClient = client.NodeClient;
exports.makeNodeTransport = http.makeNodeTransport;
exports.defaultIntegrations = sdk.defaultIntegrations;
exports.defaultStackParser = sdk.defaultStackParser;
exports.getDefaultIntegrations = sdk.getDefaultIntegrations;
exports.getSentryRelease = sdk.getSentryRelease;
exports.init = sdk.init;
exports.DEFAULT_USER_INCLUDES = utils.DEFAULT_USER_INCLUDES;
exports.addRequestDataToEvent = utils.addRequestDataToEvent;
exports.extractRequestData = utils.extractRequestData;
exports.deepReadDirSync = utils$1.deepReadDirSync;
exports.createGetModuleFromFilename = module$1.createGetModuleFromFilename;
exports.enableAnrDetection = legacy.enableAnrDetection;
exports.Handlers = handlers;
exports.captureConsoleIntegration = integrations.captureConsoleIntegration;
exports.debugIntegration = integrations.debugIntegration;
exports.dedupeIntegration = integrations.dedupeIntegration;
exports.extraErrorDataIntegration = integrations.extraErrorDataIntegration;
exports.httpClientIntegration = integrations.httpClientIntegration;
exports.reportingObserverIntegration = integrations.reportingObserverIntegration;
exports.rewriteFramesIntegration = integrations.rewriteFramesIntegration;
exports.sessionTimingIntegration = integrations.sessionTimingIntegration;
exports.consoleIntegration = console.consoleIntegration;
exports.onUncaughtExceptionIntegration = onuncaughtexception.onUncaughtExceptionIntegration;
exports.onUnhandledRejectionIntegration = onunhandledrejection.onUnhandledRejectionIntegration;
exports.modulesIntegration = modules.modulesIntegration;
exports.contextLinesIntegration = contextlines.contextLinesIntegration;
exports.nodeContextIntegration = context.nodeContextIntegration;
exports.localVariablesIntegration = index$1.localVariablesIntegration;
exports.spotlightIntegration = spotlight.spotlightIntegration;
exports.anrIntegration = index$2.anrIntegration;
exports.hapiErrorPlugin = index$3.hapiErrorPlugin;
exports.hapiIntegration = index$3.hapiIntegration;
exports.Undici = index$4.Undici;
exports.nativeNodeFetchintegration = index$4.nativeNodeFetchintegration;
exports.Http = http$1.Http;
exports.httpIntegration = http$1.httpIntegration;
exports.trpcMiddleware = trpc.trpcMiddleware;
exports.Integrations = Integrations;
exports.cron = cron;
exports.getModuleFromFilename = getModuleFromFilename;
//# sourceMappingURL=index.js.map
