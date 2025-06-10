import { _optionalChain } from '@sentry/utils';
import { defineIntegration, convertIntegrationFnToClass, getClient } from '@sentry/core';
import { LRUMap, logger } from '@sentry/utils';
import { NODE_VERSION } from '../../nodeVersion.js';
import { createRateLimiter, hashFromStack, hashFrames, functionNamesMatch } from './common.js';

/* eslint-disable max-lines */

/** Creates a container for callbacks to be called sequentially */
function createCallbackList(complete) {
  // A collection of callbacks to be executed last to first
  let callbacks = [];

  let completedCalled = false;
  function checkedComplete(result) {
    callbacks = [];
    if (completedCalled) {
      return;
    }
    completedCalled = true;
    complete(result);
  }

  // complete should be called last
  callbacks.push(checkedComplete);

  function add(fn) {
    callbacks.push(fn);
  }

  function next(result) {
    const popped = callbacks.pop() || checkedComplete;

    try {
      popped(result);
    } catch (_) {
      // If there is an error, we still want to call the complete callback
      checkedComplete(result);
    }
  }

  return { add, next };
}

/**
 * Promise API is available as `Experimental` and in Node 19 only.
 *
 * Callback-based API is `Stable` since v14 and `Experimental` since v8.
 * Because of that, we are creating our own `AsyncSession` class.
 *
 * https://nodejs.org/docs/latest-v19.x/api/inspector.html#promises-api
 * https://nodejs.org/docs/latest-v14.x/api/inspector.html
 */
class AsyncSession  {

  /** Throws if inspector API is not available */
   constructor() {
    /*
    TODO: We really should get rid of this require statement below for a couple of reasons:
    1. It makes the integration unusable in the SvelteKit SDK, as it's not possible to use `require`
       in SvelteKit server code (at least not by default).
    2. Throwing in a constructor is bad practice

    More context for a future attempt to fix this:
    We already tried replacing it with import but didn't get it to work because of async problems.
    We still called import in the constructor but assigned to a promise which we "awaited" in
    `configureAndConnect`. However, this broke the Node integration tests as no local variables
    were reported any more. We probably missed a place where we need to await the promise, too.
    */

    // Node can be built without inspector support so this can throw
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Session } = require('inspector');
    this._session = new Session();
  }

  /** @inheritdoc */
   configureAndConnect(onPause, captureAll) {
    this._session.connect();

    this._session.on('Debugger.paused', event => {
      onPause(event, () => {
        // After the pause work is complete, resume execution or the exception context memory is leaked
        this._session.post('Debugger.resume');
      });
    });

    this._session.post('Debugger.enable');
    this._session.post('Debugger.setPauseOnExceptions', { state: captureAll ? 'all' : 'uncaught' });
  }

   setPauseOnExceptions(captureAll) {
    this._session.post('Debugger.setPauseOnExceptions', { state: captureAll ? 'all' : 'uncaught' });
  }

  /** @inheritdoc */
   getLocalVariables(objectId, complete) {
    this._getProperties(objectId, props => {
      const { add, next } = createCallbackList(complete);

      for (const prop of props) {
        if (_optionalChain([prop, 'optionalAccess', _2 => _2.value, 'optionalAccess', _3 => _3.objectId]) && _optionalChain([prop, 'optionalAccess', _4 => _4.value, 'access', _5 => _5.className]) === 'Array') {
          const id = prop.value.objectId;
          add(vars => this._unrollArray(id, prop.name, vars, next));
        } else if (_optionalChain([prop, 'optionalAccess', _6 => _6.value, 'optionalAccess', _7 => _7.objectId]) && _optionalChain([prop, 'optionalAccess', _8 => _8.value, 'optionalAccess', _9 => _9.className]) === 'Object') {
          const id = prop.value.objectId;
          add(vars => this._unrollObject(id, prop.name, vars, next));
        } else if (_optionalChain([prop, 'optionalAccess', _10 => _10.value, 'optionalAccess', _11 => _11.value]) != null || _optionalChain([prop, 'optionalAccess', _12 => _12.value, 'optionalAccess', _13 => _13.description]) != null) {
          add(vars => this._unrollOther(prop, vars, next));
        }
      }

      next({});
    });
  }

  /**
   * Gets all the PropertyDescriptors of an object
   */
   _getProperties(objectId, next) {
    this._session.post(
      'Runtime.getProperties',
      {
        objectId,
        ownProperties: true,
      },
      (err, params) => {
        if (err) {
          next([]);
        } else {
          next(params.result);
        }
      },
    );
  }

  /**
   * Unrolls an array property
   */
   _unrollArray(objectId, name, vars, next) {
    this._getProperties(objectId, props => {
      vars[name] = props
        .filter(v => v.name !== 'length' && !isNaN(parseInt(v.name, 10)))
        .sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10))
        .map(v => _optionalChain([v, 'optionalAccess', _14 => _14.value, 'optionalAccess', _15 => _15.value]));

      next(vars);
    });
  }

  /**
   * Unrolls an object property
   */
   _unrollObject(objectId, name, vars, next) {
    this._getProperties(objectId, props => {
      vars[name] = props
        .map(v => [v.name, _optionalChain([v, 'optionalAccess', _16 => _16.value, 'optionalAccess', _17 => _17.value])])
        .reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {} );

      next(vars);
    });
  }

  /**
   * Unrolls other properties
   */
   _unrollOther(prop, vars, next) {
    if (_optionalChain([prop, 'optionalAccess', _18 => _18.value, 'optionalAccess', _19 => _19.value]) != null) {
      vars[prop.name] = prop.value.value;
    } else if (_optionalChain([prop, 'optionalAccess', _20 => _20.value, 'optionalAccess', _21 => _21.description]) != null && _optionalChain([prop, 'optionalAccess', _22 => _22.value, 'optionalAccess', _23 => _23.type]) !== 'function') {
      vars[prop.name] = `<${prop.value.description}>`;
    }

    next(vars);
  }
}

/**
 * When using Vercel pkg, the inspector module is not available.
 * https://github.com/getsentry/sentry-javascript/issues/6769
 */
function tryNewAsyncSession() {
  try {
    return new AsyncSession();
  } catch (e) {
    return undefined;
  }
}

const INTEGRATION_NAME = 'LocalVariables';

/**
 * Adds local variables to exception frames
 */
const _localVariablesSyncIntegration = ((
  options = {},
  session = tryNewAsyncSession(),
) => {
  const cachedFrames = new LRUMap(20);
  let rateLimiter;
  let shouldProcessEvent = false;

  function handlePaused(
    stackParser,
    { params: { reason, data, callFrames } },
    complete,
  ) {
    if (reason !== 'exception' && reason !== 'promiseRejection') {
      complete();
      return;
    }

    _optionalChain([rateLimiter, 'optionalCall', _24 => _24()]);

    // data.description contains the original error.stack
    const exceptionHash = hashFromStack(stackParser, _optionalChain([data, 'optionalAccess', _25 => _25.description]));

    if (exceptionHash == undefined) {
      complete();
      return;
    }

    const { add, next } = createCallbackList(frames => {
      cachedFrames.set(exceptionHash, frames);
      complete();
    });

    // Because we're queuing up and making all these calls synchronously, we can potentially overflow the stack
    // For this reason we only attempt to get local variables for the first 5 frames
    for (let i = 0; i < Math.min(callFrames.length, 5); i++) {
      const { scopeChain, functionName, this: obj } = callFrames[i];

      const localScope = scopeChain.find(scope => scope.type === 'local');

      // obj.className is undefined in ESM modules
      const fn = obj.className === 'global' || !obj.className ? functionName : `${obj.className}.${functionName}`;

      if (_optionalChain([localScope, 'optionalAccess', _26 => _26.object, 'access', _27 => _27.objectId]) === undefined) {
        add(frames => {
          frames[i] = { function: fn };
          next(frames);
        });
      } else {
        const id = localScope.object.objectId;
        add(frames =>
          _optionalChain([session, 'optionalAccess', _28 => _28.getLocalVariables, 'call', _29 => _29(id, vars => {
            frames[i] = { function: fn, vars };
            next(frames);
          })]),
        );
      }
    }

    next([]);
  }

  function addLocalVariablesToException(exception) {
    const hash = hashFrames(_optionalChain([exception, 'optionalAccess', _30 => _30.stacktrace, 'optionalAccess', _31 => _31.frames]));

    if (hash === undefined) {
      return;
    }

    // Check if we have local variables for an exception that matches the hash
    // remove is identical to get but also removes the entry from the cache
    const cachedFrame = cachedFrames.remove(hash);

    if (cachedFrame === undefined) {
      return;
    }

    // Filter out frames where the function name is `new Promise` since these are in the error.stack frames
    // but do not appear in the debugger call frames
    const frames = (_optionalChain([exception, 'access', _32 => _32.stacktrace, 'optionalAccess', _33 => _33.frames]) || []).filter(frame => frame.function !== 'new Promise');

    for (let i = 0; i < frames.length; i++) {
      // Sentry frames are in reverse order
      const frameIndex = frames.length - i - 1;

      // Drop out if we run out of frames to match up
      if (!frames[frameIndex] || !cachedFrame[i]) {
        break;
      }

      if (
        // We need to have vars to add
        cachedFrame[i].vars === undefined ||
        // We're not interested in frames that are not in_app because the vars are not relevant
        frames[frameIndex].in_app === false ||
        // The function names need to match
        !functionNamesMatch(frames[frameIndex].function, cachedFrame[i].function)
      ) {
        continue;
      }

      frames[frameIndex].vars = cachedFrame[i].vars;
    }
  }

  function addLocalVariablesToEvent(event) {
    for (const exception of _optionalChain([event, 'optionalAccess', _34 => _34.exception, 'optionalAccess', _35 => _35.values]) || []) {
      addLocalVariablesToException(exception);
    }

    return event;
  }

  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      const client = getClient();
      const clientOptions = _optionalChain([client, 'optionalAccess', _36 => _36.getOptions, 'call', _37 => _37()]);

      if (session && _optionalChain([clientOptions, 'optionalAccess', _38 => _38.includeLocalVariables])) {
        // Only setup this integration if the Node version is >= v18
        // https://github.com/getsentry/sentry-javascript/issues/7697
        const unsupportedNodeVersion = NODE_VERSION.major < 18;

        if (unsupportedNodeVersion) {
          logger.log('The `LocalVariables` integration is only supported on Node >= v18.');
          return;
        }

        const captureAll = options.captureAllExceptions !== false;

        session.configureAndConnect(
          (ev, complete) =>
            handlePaused(clientOptions.stackParser, ev , complete),
          captureAll,
        );

        if (captureAll) {
          const max = options.maxExceptionsPerSecond || 50;

          rateLimiter = createRateLimiter(
            max,
            () => {
              logger.log('Local variables rate-limit lifted.');
              _optionalChain([session, 'optionalAccess', _39 => _39.setPauseOnExceptions, 'call', _40 => _40(true)]);
            },
            seconds => {
              logger.log(
                `Local variables rate-limit exceeded. Disabling capturing of caught exceptions for ${seconds} seconds.`,
              );
              _optionalChain([session, 'optionalAccess', _41 => _41.setPauseOnExceptions, 'call', _42 => _42(false)]);
            },
          );
        }

        shouldProcessEvent = true;
      }
    },
    processEvent(event) {
      if (shouldProcessEvent) {
        return addLocalVariablesToEvent(event);
      }

      return event;
    },
    // These are entirely for testing
    _getCachedFramesCount() {
      return cachedFrames.size;
    },
    _getFirstCachedFrame() {
      return cachedFrames.values()[0];
    },
  };
}) ;

const localVariablesSyncIntegration = defineIntegration(_localVariablesSyncIntegration);

/**
 * Adds local variables to exception frames.
 * @deprecated Use `localVariablesSyncIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const LocalVariablesSync = convertIntegrationFnToClass(
  INTEGRATION_NAME,
  localVariablesSyncIntegration,
)

;

// eslint-disable-next-line deprecation/deprecation

export { LocalVariablesSync, createCallbackList, localVariablesSyncIntegration };
//# sourceMappingURL=local-variables-sync.js.map
