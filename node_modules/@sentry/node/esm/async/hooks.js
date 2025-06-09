import { _optionalChain } from '@sentry/utils';
import { setAsyncContextStrategy, ensureHubOnCarrier, getHubFromCarrier } from '@sentry/core';
import * as async_hooks from 'async_hooks';

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
    ensureHubOnCarrier(carrier, parent);
    return getHubFromCarrier(carrier);
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

  setAsyncContextStrategy({ getCurrentHub, runWithAsyncContext });
}

export { setHooksAsyncContextStrategy };
//# sourceMappingURL=hooks.js.map
