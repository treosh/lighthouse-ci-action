import { defineIntegration, convertIntegrationFnToClass, SDK_VERSION, getActiveTransaction, captureException, continueTrace, startTransaction, getCurrentScope, spanToTraceHeader, getDynamicSamplingContextFromSpan, setHttpStatus } from '@sentry/core';
import { fill, dynamicSamplingContextToSentryBaggageHeader } from '@sentry/utils';

function isResponseObject(response) {
  return response && (response ).statusCode !== undefined;
}

function isErrorEvent(event) {
  return event && (event ).error !== undefined;
}

function sendErrorToSentry(errorData) {
  captureException(errorData, {
    mechanism: {
      type: 'hapi',
      handled: false,
      data: {
        function: 'hapiErrorPlugin',
      },
    },
  });
}

const hapiErrorPlugin = {
  name: 'SentryHapiErrorPlugin',
  version: SDK_VERSION,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async function (serverArg) {
    const server = serverArg ;

    server.events.on('request', (request, event) => {
      // eslint-disable-next-line deprecation/deprecation
      const transaction = getActiveTransaction();

      if (isErrorEvent(event)) {
        sendErrorToSentry(event.error);
      }

      if (transaction) {
        transaction.setStatus('internal_error');
        transaction.end();
      }
    });
  },
};

const hapiTracingPlugin = {
  name: 'SentryHapiTracingPlugin',
  version: SDK_VERSION,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async function (serverArg) {
    const server = serverArg ;

    server.ext('onPreHandler', (request, h) => {
      const transaction = continueTrace(
        {
          sentryTrace: request.headers['sentry-trace'] || undefined,
          baggage: request.headers['baggage'] || undefined,
        },
        transactionContext => {
          // eslint-disable-next-line deprecation/deprecation
          return startTransaction({
            ...transactionContext,
            op: 'hapi.request',
            name: request.route.path,
            description: `${request.route.method} ${request.path}`,
          });
        },
      );

      // eslint-disable-next-line deprecation/deprecation
      getCurrentScope().setSpan(transaction);

      return h.continue;
    });

    server.ext('onPreResponse', (request, h) => {
      // eslint-disable-next-line deprecation/deprecation
      const transaction = getActiveTransaction();

      if (request.response && isResponseObject(request.response) && transaction) {
        const response = request.response ;
        response.header('sentry-trace', spanToTraceHeader(transaction));

        const dynamicSamplingContext = dynamicSamplingContextToSentryBaggageHeader(
          getDynamicSamplingContextFromSpan(transaction),
        );

        if (dynamicSamplingContext) {
          response.header('baggage', dynamicSamplingContext);
        }
      }

      return h.continue;
    });

    server.ext('onPostHandler', (request, h) => {
      // eslint-disable-next-line deprecation/deprecation
      const transaction = getActiveTransaction();

      if (transaction) {
        if (request.response && isResponseObject(request.response)) {
          setHttpStatus(transaction, request.response.statusCode);
        }

        transaction.end();
      }

      return h.continue;
    });
  },
};

const INTEGRATION_NAME = 'Hapi';

const _hapiIntegration = ((options = {}) => {
  const server = options.server ;

  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      if (!server) {
        return;
      }

      fill(server, 'start', (originalStart) => {
        return async function () {
          await this.register(hapiTracingPlugin);
          await this.register(hapiErrorPlugin);
          const result = originalStart.apply(this);
          return result;
        };
      });
    },
  };
}) ;

const hapiIntegration = defineIntegration(_hapiIntegration);

/**
 * Hapi Framework Integration.
 * @deprecated Use `hapiIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const Hapi = convertIntegrationFnToClass(INTEGRATION_NAME, hapiIntegration);

// eslint-disable-next-line deprecation/deprecation

export { Hapi, hapiErrorPlugin, hapiIntegration, hapiTracingPlugin };
//# sourceMappingURL=index.js.map
