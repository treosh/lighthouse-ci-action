var {
  _optionalChain
} = require('@sentry/utils');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const utils = require('@sentry/utils');
const index$2 = require('./async/index.js');
const client = require('./client.js');
const console = require('./integrations/console.js');
const context = require('./integrations/context.js');
const contextlines = require('./integrations/contextlines.js');
const http = require('./integrations/http.js');
const index$1 = require('./integrations/local-variables/index.js');
const modules = require('./integrations/modules.js');
const onuncaughtexception = require('./integrations/onuncaughtexception.js');
const onunhandledrejection = require('./integrations/onunhandledrejection.js');
const spotlight = require('./integrations/spotlight.js');
const index = require('./integrations/undici/index.js');
const module$1 = require('./module.js');
const http$1 = require('./transports/http.js');

/* eslint-disable max-lines */

/** @deprecated Use `getDefaultIntegrations(options)` instead. */
const defaultIntegrations = [
  // Common
  core.inboundFiltersIntegration(),
  core.functionToStringIntegration(),
  core.linkedErrorsIntegration(),
  core.requestDataIntegration(),
  // Native Wrappers
  console.consoleIntegration(),
  http.httpIntegration(),
  index.nativeNodeFetchintegration(),
  // Global Handlers
  onuncaughtexception.onUncaughtExceptionIntegration(),
  onunhandledrejection.onUnhandledRejectionIntegration(),
  // Event Info
  contextlines.contextLinesIntegration(),
  index$1.localVariablesIntegration(),
  context.nodeContextIntegration(),
  modules.modulesIntegration(),
];

/** Get the default integrations for the Node SDK. */
function getDefaultIntegrations(_options) {
  const carrier = core.getMainCarrier();

  const autoloadedIntegrations = _optionalChain([carrier, 'access', _ => _.__SENTRY__, 'optionalAccess', _2 => _2.integrations]) || [];

  return [
    // eslint-disable-next-line deprecation/deprecation
    ...defaultIntegrations,
    ...autoloadedIntegrations,
  ];
}

/**
 * The Sentry Node SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible in the
 * main entry module. To set context information or send manual events, use the
 * provided methods.
 *
 * @example
 * ```
 *
 * const { init } = require('@sentry/node');
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { configureScope } = require('@sentry/node');
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { addBreadcrumb } = require('@sentry/node');
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const Sentry = require('@sentry/node');
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link NodeOptions} for documentation on configuration options.
 */
// eslint-disable-next-line complexity
function init(options = {}) {
  index$2.setNodeAsyncContextStrategy();

  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = getDefaultIntegrations();
  }

  if (options.dsn === undefined && process.env.SENTRY_DSN) {
    options.dsn = process.env.SENTRY_DSN;
  }

  const sentryTracesSampleRate = process.env.SENTRY_TRACES_SAMPLE_RATE;
  if (options.tracesSampleRate === undefined && sentryTracesSampleRate) {
    const tracesSampleRate = parseFloat(sentryTracesSampleRate);
    if (isFinite(tracesSampleRate)) {
      options.tracesSampleRate = tracesSampleRate;
    }
  }

  if (options.release === undefined) {
    const detectedRelease = getSentryRelease();
    if (detectedRelease !== undefined) {
      options.release = detectedRelease;
    } else {
      // If release is not provided, then we should disable autoSessionTracking
      options.autoSessionTracking = false;
    }
  }

  if (options.environment === undefined && process.env.SENTRY_ENVIRONMENT) {
    options.environment = process.env.SENTRY_ENVIRONMENT;
  }

  if (options.autoSessionTracking === undefined && options.dsn !== undefined) {
    options.autoSessionTracking = true;
  }

  if (options.instrumenter === undefined) {
    options.instrumenter = 'sentry';
  }

  // TODO(v7): Refactor this to reduce the logic above
  const clientOptions = {
    ...options,
    stackParser: utils.stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: core.getIntegrationsToSetup(options),
    transport: options.transport || http$1.makeNodeTransport,
  };

  core.initAndBind(options.clientClass || client.NodeClient, clientOptions);

  if (options.autoSessionTracking) {
    startSessionTracking();
  }

  updateScopeFromEnvVariables();

  if (options.spotlight) {
    const client = core.getClient();
    if (client && client.addIntegration) {
      // force integrations to be setup even if no DSN was set
      // If they have already been added before, they will be ignored anyhow
      const integrations = client.getOptions().integrations;
      for (const integration of integrations) {
        client.addIntegration(integration);
      }
      client.addIntegration(
        spotlight.spotlightIntegration({ sidecarUrl: typeof options.spotlight === 'string' ? options.spotlight : undefined }),
      );
    }
  }
}

/**
 * Function that takes an instance of NodeClient and checks if autoSessionTracking option is enabled for that client
 */
function isAutoSessionTrackingEnabled(client) {
  if (client === undefined) {
    return false;
  }
  const clientOptions = client && client.getOptions();
  if (clientOptions && clientOptions.autoSessionTracking !== undefined) {
    return clientOptions.autoSessionTracking;
  }
  return false;
}

/**
 * Returns a release dynamically from environment variables.
 */
function getSentryRelease(fallback) {
  // Always read first as Sentry takes this as precedence
  if (process.env.SENTRY_RELEASE) {
    return process.env.SENTRY_RELEASE;
  }

  // This supports the variable that sentry-webpack-plugin injects
  if (utils.GLOBAL_OBJ.SENTRY_RELEASE && utils.GLOBAL_OBJ.SENTRY_RELEASE.id) {
    return utils.GLOBAL_OBJ.SENTRY_RELEASE.id;
  }

  return (
    // GitHub Actions - https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables
    process.env.GITHUB_SHA ||
    // Netlify - https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
    process.env.COMMIT_REF ||
    // Vercel - https://vercel.com/docs/v2/build-step#system-environment-variables
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_GITHUB_COMMIT_SHA ||
    process.env.VERCEL_GITLAB_COMMIT_SHA ||
    process.env.VERCEL_BITBUCKET_COMMIT_SHA ||
    // Zeit (now known as Vercel)
    process.env.ZEIT_GITHUB_COMMIT_SHA ||
    process.env.ZEIT_GITLAB_COMMIT_SHA ||
    process.env.ZEIT_BITBUCKET_COMMIT_SHA ||
    // Cloudflare Pages - https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables
    process.env.CF_PAGES_COMMIT_SHA ||
    fallback
  );
}

/** Node.js stack parser */
const defaultStackParser = utils.createStackParser(utils.nodeStackLineParser(module$1.createGetModuleFromFilename()));

/**
 * Enable automatic Session Tracking for the node process.
 */
function startSessionTracking() {
  core.startSession();
  // Emitted in the case of healthy sessions, error of `mechanism.handled: true` and unhandledrejections because
  // The 'beforeExit' event is not emitted for conditions causing explicit termination,
  // such as calling process.exit() or uncaught exceptions.
  // Ref: https://nodejs.org/api/process.html#process_event_beforeexit
  process.on('beforeExit', () => {
    const session = core.getIsolationScope().getSession();
    const terminalStates = ['exited', 'crashed'];
    // Only call endSession, if the Session exists on Scope and SessionStatus is not a
    // Terminal Status i.e. Exited or Crashed because
    // "When a session is moved away from ok it must not be updated anymore."
    // Ref: https://develop.sentry.dev/sdk/sessions/
    if (session && !terminalStates.includes(session.status)) {
      core.endSession();
    }
  });
}

/**
 * Update scope and propagation context based on environmental variables.
 *
 * See https://github.com/getsentry/rfcs/blob/main/text/0071-continue-trace-over-process-boundaries.md
 * for more details.
 */
function updateScopeFromEnvVariables() {
  const sentryUseEnvironment = (process.env.SENTRY_USE_ENVIRONMENT || '').toLowerCase();
  if (!['false', 'n', 'no', 'off', '0'].includes(sentryUseEnvironment)) {
    const sentryTraceEnv = process.env.SENTRY_TRACE;
    const baggageEnv = process.env.SENTRY_BAGGAGE;
    const propagationContext = utils.propagationContextFromHeaders(sentryTraceEnv, baggageEnv);
    core.getCurrentScope().setPropagationContext(propagationContext);
  }
}

exports.defaultIntegrations = defaultIntegrations;
exports.defaultStackParser = defaultStackParser;
exports.getDefaultIntegrations = getDefaultIntegrations;
exports.getSentryRelease = getSentryRelease;
exports.init = init;
exports.isAutoSessionTrackingEnabled = isAutoSessionTrackingEnabled;
//# sourceMappingURL=sdk.js.map
