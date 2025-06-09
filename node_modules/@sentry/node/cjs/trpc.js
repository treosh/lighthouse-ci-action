var {
  _optionalChain
} = require('@sentry/utils');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const utils = require('@sentry/utils');

/**
 * Sentry tRPC middleware that names the handling transaction after the called procedure.
 *
 * Use the Sentry tRPC middleware in combination with the Sentry server integration,
 * e.g. Express Request Handlers or Next.js SDK.
 */
function trpcMiddleware(options = {}) {
  return function ({ path, type, next, rawInput }) {
    const clientOptions = _optionalChain([core.getClient, 'call', _ => _(), 'optionalAccess', _2 => _2.getOptions, 'call', _3 => _3()]);
    // eslint-disable-next-line deprecation/deprecation
    const sentryTransaction = core.getCurrentScope().getTransaction();

    if (sentryTransaction) {
      sentryTransaction.updateName(`trpc/${path}`);
      sentryTransaction.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, 'route');
      sentryTransaction.op = 'rpc.server';

      const trpcContext = {
        procedure_type: type,
      };

      if (options.attachRpcInput !== undefined ? options.attachRpcInput : _optionalChain([clientOptions, 'optionalAccess', _4 => _4.sendDefaultPii])) {
        trpcContext.input = utils.normalize(rawInput);
      }

      // TODO: Can we rewrite this to an attribute? Or set this on the scope?
      // eslint-disable-next-line deprecation/deprecation
      sentryTransaction.setContext('trpc', trpcContext);
    }

    function captureIfError(nextResult) {
      if (!nextResult.ok) {
        core.captureException(nextResult.error, { mechanism: { handled: false, data: { function: 'trpcMiddleware' } } });
      }
    }

    let maybePromiseResult;
    try {
      maybePromiseResult = next();
    } catch (e) {
      core.captureException(e, { mechanism: { handled: false, data: { function: 'trpcMiddleware' } } });
      throw e;
    }

    if (utils.isThenable(maybePromiseResult)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      Promise.resolve(maybePromiseResult).then(
        nextResult => {
          captureIfError(nextResult );
        },
        e => {
          core.captureException(e, { mechanism: { handled: false, data: { function: 'trpcMiddleware' } } });
        },
      );
    } else {
      captureIfError(maybePromiseResult );
    }

    // We return the original promise just to be safe.
    return maybePromiseResult;
  };
}

exports.trpcMiddleware = trpcMiddleware;
//# sourceMappingURL=trpc.js.map
