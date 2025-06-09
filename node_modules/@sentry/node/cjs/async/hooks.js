var {
  _optionalChain
} = require('@sentry/utils');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const async_hooks = require('async_hooks');

// eslint-disable-next-line deprecation/deprecation
let asyncStorage;

/**
 * Sets the async context strategy to use AsyncLocalStorage which requires Node v12.17.0 or v13.10.0.
 */
function setHooksAsyncContextStrategy() {
  if (!asyncStorage) {
    // eslint-disable-next-line deprecation/deprecation
    asyncStorage = new (async_hooks ).AsyncLocalStorage();
  }

  // eslint-disable-next-line deprecation/deprecation
  function getCurrentHub() {
    return asyncStorage.getStore();
  }

  // eslint-disable-next-line deprecation/deprecation
  function createNewHub(parent) {
    const carrier = {};
    core.ensureHubOnCarrier(carrier, parent);
    return core.getHubFromCarrier(carrier);
  }

  function runWithAsyncContext(callback, options) {
    const existingHub = getCurrentHub();

    if (existingHub && _optionalChain([options, 'optionalAccess', _ => _.reuseExisting])) {
      // We're already in an async context, so we don't need to create a new one
      // just call the callback with the current hub
      return callback();
    }

    const newHub = createNewHub(existingHub);

    return asyncStorage.run(newHub, () => {
      return callback();
    });
  }

  core.setAsyncContextStrategy({ getCurrentHub, runWithAsyncContext });
}

exports.setHooksAsyncContextStrategy = setHooksAsyncContextStrategy;
//# sourceMappingURL=hooks.js.map
