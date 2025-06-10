import { _optionalChain, _optionalChainDelete } from '@sentry/utils';
import { URL } from 'url';
import { defineIntegration, convertIntegrationFnToClass, getGlobalScope, mergeScopeData, getIsolationScope, getCurrentScope } from '@sentry/core';
import { logger, GLOBAL_OBJ, dynamicRequire } from '@sentry/utils';
import { NODE_VERSION } from '../../nodeVersion.js';
import { base64WorkerScript } from './worker-script.js';

const DEFAULT_INTERVAL = 50;
const DEFAULT_HANG_THRESHOLD = 5000;

function log(message, ...args) {
  logger.log(`[ANR] ${message}`, ...args);
}

function globalWithScopeFetchFn() {
  return GLOBAL_OBJ;
}

/** Fetches merged scope data */
function getScopeData() {
  const scope = getGlobalScope().getScopeData();
  mergeScopeData(scope, getIsolationScope().getScopeData());
  mergeScopeData(scope, getCurrentScope().getScopeData());

  // We remove attachments because they likely won't serialize well as json
  scope.attachments = [];
  // We can't serialize event processor functions
  scope.eventProcessors = [];

  return scope;
}

/**
 * We need to use dynamicRequire because worker_threads is not available in node < v12 and webpack error will when
 * targeting those versions
 */
function getWorkerThreads() {
  return dynamicRequire(module, 'worker_threads');
}

/**
 * Gets contexts by calling all event processors. This relies on being called after all integrations are setup
 */
async function getContexts(client) {
  let event = { message: 'ANR' };
  const eventHint = {};

  for (const processor of client.getEventProcessors()) {
    if (event === null) break;
    event = await processor(event, eventHint);
  }

  return _optionalChain([event, 'optionalAccess', _2 => _2.contexts]) || {};
}

const INTEGRATION_NAME = 'Anr';

const _anrIntegration = ((options = {}) => {
  if (NODE_VERSION.major < 16 || (NODE_VERSION.major === 16 && NODE_VERSION.minor < 17)) {
    throw new Error('ANR detection requires Node 16.17.0 or later');
  }

  let worker;
  let client;

  // Hookup the scope fetch function to the global object so that it can be called from the worker thread via the
  // debugger when it pauses
  const gbl = globalWithScopeFetchFn();
  gbl.__SENTRY_GET_SCOPES__ = getScopeData;

  return {
    name: INTEGRATION_NAME,
    // TODO v8: Remove this
    setupOnce() {}, // eslint-disable-line @typescript-eslint/no-empty-function
    startWorker: () => {
      if (worker) {
        return;
      }

      if (client) {
        worker = _startWorker(client, options);
      }
    },
    stopWorker: () => {
      if (worker) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        worker.then(stop => {
          stop();
          worker = undefined;
        });
      }
    },
    setup(initClient) {
      client = initClient;

      // setImmediate is used to ensure that all other integrations have had their setup called first.
      // This allows us to call into all integrations to fetch the full context
      setImmediate(() => this.startWorker());
    },
  } ;
}) ;

const anrIntegration = defineIntegration(_anrIntegration) ;

/**
 * Starts a thread to detect App Not Responding (ANR) events
 *
 * ANR detection requires Node 16.17.0 or later
 *
 * @deprecated Use `anrIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const Anr = convertIntegrationFnToClass(INTEGRATION_NAME, anrIntegration)

;

// eslint-disable-next-line deprecation/deprecation

/**
 * Starts the ANR worker thread
 */
async function _startWorker(
  client,
  integrationOptions,
) {
  const dsn = client.getDsn();

  if (!dsn) {
    return () => {
      //
    };
  }

  const contexts = await getContexts(client);

  // These will not be accurate if sent later from the worker thread
   _optionalChainDelete([contexts, 'access', _3 => _3.app, 'optionalAccess', _4 => delete _4.app_memory]);
   _optionalChainDelete([contexts, 'access', _5 => _5.device, 'optionalAccess', _6 => delete _6.free_memory]);

  const initOptions = client.getOptions();

  const sdkMetadata = client.getSdkMetadata() || {};
  if (sdkMetadata.sdk) {
    sdkMetadata.sdk.integrations = initOptions.integrations.map(i => i.name);
  }

  const options = {
    debug: logger.isEnabled(),
    dsn,
    environment: initOptions.environment || 'production',
    release: initOptions.release,
    dist: initOptions.dist,
    sdkMetadata,
    appRootPath: integrationOptions.appRootPath,
    pollInterval: integrationOptions.pollInterval || DEFAULT_INTERVAL,
    anrThreshold: integrationOptions.anrThreshold || DEFAULT_HANG_THRESHOLD,
    captureStackTrace: !!integrationOptions.captureStackTrace,
    staticTags: integrationOptions.staticTags || {},
    contexts,
  };

  if (options.captureStackTrace) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const inspector = require('inspector');
    if (!inspector.url()) {
      inspector.open(0);
    }
  }

  const { Worker } = getWorkerThreads();

  const worker = new Worker(new URL(`data:application/javascript;base64,${base64WorkerScript}`), {
    workerData: options,
  });

  process.on('exit', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    worker.terminate();
  });

  const timer = setInterval(() => {
    try {
      const currentSession = getCurrentScope().getSession();
      // We need to copy the session object and remove the toJSON method so it can be sent to the worker
      // serialized without making it a SerializedSession
      const session = currentSession ? { ...currentSession, toJSON: undefined } : undefined;
      // message the worker to tell it the main event loop is still running
      worker.postMessage({ session });
    } catch (_) {
      //
    }
  }, options.pollInterval);
  // Timer should not block exit
  timer.unref();

  worker.on('message', (msg) => {
    if (msg === 'session-ended') {
      log('ANR event sent from ANR worker. Clearing session in this thread.');
      getCurrentScope().setSession(undefined);
    }
  });

  worker.once('error', (err) => {
    clearInterval(timer);
    log('ANR worker error', err);
  });

  worker.once('exit', (code) => {
    clearInterval(timer);
    log('ANR worker exit', code);
  });

  // Ensure this thread can't block app exit
  worker.unref();

  return () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    worker.terminate();
    clearInterval(timer);
  };
}

export { Anr, anrIntegration };
//# sourceMappingURL=index.js.map
