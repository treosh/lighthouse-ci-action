import { _optionalChain } from '@sentry/utils';
import { defineIntegration, getClient, isSentryRequestUrl, getCurrentScope, getIsolationScope, getActiveSpan, spanToTraceHeader, getDynamicSamplingContextFromSpan, getDynamicSamplingContextFromClient, setHttpStatus, spanToJSON, hasTracingEnabled, getCurrentHub, addBreadcrumb } from '@sentry/core';
import { dropUndefinedKeys, logger, fill, LRUMap, generateSentryTraceHeader, dynamicSamplingContextToSentryBaggageHeader, stringMatchesSomePattern } from '@sentry/utils';
import { DEBUG_BUILD } from '../debug-build.js';
import { NODE_VERSION } from '../nodeVersion.js';
import { normalizeRequestArgs, extractRawUrl, extractUrl, cleanSpanDescription } from './utils/http.js';

const _httpIntegration = ((options = {}) => {
  const { breadcrumbs, tracing, shouldCreateSpanForRequest } = options;

  const convertedOptions = {
    breadcrumbs,
    tracing:
      tracing === false
        ? false
        : dropUndefinedKeys({
            // If tracing is forced to `true`, we don't want to set `enableIfHasTracingEnabled`
            enableIfHasTracingEnabled: tracing === true ? undefined : true,
            shouldCreateSpanForRequest,
          }),
  };

  // eslint-disable-next-line deprecation/deprecation
  return new Http(convertedOptions) ;
}) ;

/**
 * The http module integration instruments Node's internal http module. It creates breadcrumbs, spans for outgoing
 * http requests, and attaches trace data when tracing is enabled via its `tracing` option.
 *
 * By default, this will always create breadcrumbs, and will create spans if tracing is enabled.
 */
const httpIntegration = defineIntegration(_httpIntegration);

/**
 * The http module integration instruments Node's internal http module. It creates breadcrumbs, transactions for outgoing
 * http requests and attaches trace data when tracing is enabled via its `tracing` option.
 *
 * @deprecated Use `httpIntegration()` instead.
 */
class Http  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Http';}

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line deprecation/deprecation
   __init() {this.name = Http.id;}

  /**
   * @inheritDoc
   */
   constructor(options = {}) {Http.prototype.__init.call(this);
    this._breadcrumbs = typeof options.breadcrumbs === 'undefined' ? true : options.breadcrumbs;
    this._tracing = !options.tracing ? undefined : options.tracing === true ? {} : options.tracing;
  }

  /**
   * @inheritDoc
   */
   setupOnce(
    _addGlobalEventProcessor,
    // eslint-disable-next-line deprecation/deprecation
    setupOnceGetCurrentHub,
  ) {
    // eslint-disable-next-line deprecation/deprecation
    const clientOptions = _optionalChain([setupOnceGetCurrentHub, 'call', _ => _(), 'access', _2 => _2.getClient, 'call', _3 => _3(), 'optionalAccess', _4 => _4.getOptions, 'call', _5 => _5()]);

    // If `tracing` is not explicitly set, we default this based on whether or not tracing is enabled.
    // But for compatibility, we only do that if `enableIfHasTracingEnabled` is set.
    const shouldCreateSpans = _shouldCreateSpans(this._tracing, clientOptions);

    // No need to instrument if we don't want to track anything
    if (!this._breadcrumbs && !shouldCreateSpans) {
      return;
    }

    // Do not auto-instrument for other instrumenter
    if (clientOptions && clientOptions.instrumenter !== 'sentry') {
      DEBUG_BUILD && logger.log('HTTP Integration is skipped because of instrumenter configuration.');
      return;
    }

    const shouldCreateSpanForRequest = _getShouldCreateSpanForRequest(shouldCreateSpans, this._tracing, clientOptions);

    // eslint-disable-next-line deprecation/deprecation
    const tracePropagationTargets = _optionalChain([clientOptions, 'optionalAccess', _6 => _6.tracePropagationTargets]) || _optionalChain([this, 'access', _7 => _7._tracing, 'optionalAccess', _8 => _8.tracePropagationTargets]);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const httpModule = require('http');
    const wrappedHttpHandlerMaker = _createWrappedRequestMethodFactory(
      httpModule,
      this._breadcrumbs,
      shouldCreateSpanForRequest,
      tracePropagationTargets,
    );
    fill(httpModule, 'get', wrappedHttpHandlerMaker);
    fill(httpModule, 'request', wrappedHttpHandlerMaker);

    // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
    // If we do, we'd get double breadcrumbs and double spans for `https` calls.
    // It has been changed in Node 9, so for all versions equal and above, we patch `https` separately.
    if (NODE_VERSION.major > 8) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const httpsModule = require('https');
      const wrappedHttpsHandlerMaker = _createWrappedRequestMethodFactory(
        httpsModule,
        this._breadcrumbs,
        shouldCreateSpanForRequest,
        tracePropagationTargets,
      );
      fill(httpsModule, 'get', wrappedHttpsHandlerMaker);
      fill(httpsModule, 'request', wrappedHttpsHandlerMaker);
    }
  }
}Http.__initStatic();

// for ease of reading below

/**
 * Function which creates a function which creates wrapped versions of internal `request` and `get` calls within `http`
 * and `https` modules. (NB: Not a typo - this is a creator^2!)
 *
 * @param breadcrumbsEnabled Whether or not to record outgoing requests as breadcrumbs
 * @param tracingEnabled Whether or not to record outgoing requests as tracing spans
 *
 * @returns A function which accepts the exiting handler and returns a wrapped handler
 */
function _createWrappedRequestMethodFactory(
  httpModule,
  breadcrumbsEnabled,
  shouldCreateSpanForRequest,
  tracePropagationTargets,
) {
  // We're caching results so we don't have to recompute regexp every time we create a request.
  const createSpanUrlMap = new LRUMap(100);
  const headersUrlMap = new LRUMap(100);

  const shouldCreateSpan = (url) => {
    if (shouldCreateSpanForRequest === undefined) {
      return true;
    }

    const cachedDecision = createSpanUrlMap.get(url);
    if (cachedDecision !== undefined) {
      return cachedDecision;
    }

    const decision = shouldCreateSpanForRequest(url);
    createSpanUrlMap.set(url, decision);
    return decision;
  };

  const shouldAttachTraceData = (url) => {
    if (tracePropagationTargets === undefined) {
      return true;
    }

    const cachedDecision = headersUrlMap.get(url);
    if (cachedDecision !== undefined) {
      return cachedDecision;
    }

    const decision = stringMatchesSomePattern(url, tracePropagationTargets);
    headersUrlMap.set(url, decision);
    return decision;
  };

  /**
   * Captures Breadcrumb based on provided request/response pair
   */
  function addRequestBreadcrumb(
    event,
    requestSpanData,
    req,
    res,
  ) {
    // eslint-disable-next-line deprecation/deprecation
    if (!getCurrentHub().getIntegration(Http)) {
      return;
    }

    addBreadcrumb(
      {
        category: 'http',
        data: {
          status_code: res && res.statusCode,
          ...requestSpanData,
        },
        type: 'http',
      },
      {
        event,
        request: req,
        response: res,
      },
    );
  }

  return function wrappedRequestMethodFactory(originalRequestMethod) {
    return function wrappedMethod( ...args) {
      const requestArgs = normalizeRequestArgs(httpModule, args);
      const requestOptions = requestArgs[0];
      // eslint-disable-next-line deprecation/deprecation
      const rawRequestUrl = extractRawUrl(requestOptions);
      const requestUrl = extractUrl(requestOptions);
      const client = getClient();

      // we don't want to record requests to Sentry as either breadcrumbs or spans, so just use the original method
      if (isSentryRequestUrl(requestUrl, client)) {
        return originalRequestMethod.apply(httpModule, requestArgs);
      }

      const scope = getCurrentScope();
      const isolationScope = getIsolationScope();
      const parentSpan = getActiveSpan();

      const data = getRequestSpanData(requestUrl, requestOptions);

      const requestSpan = shouldCreateSpan(rawRequestUrl)
        ? // eslint-disable-next-line deprecation/deprecation
          _optionalChain([parentSpan, 'optionalAccess', _9 => _9.startChild, 'call', _10 => _10({
            op: 'http.client',
            origin: 'auto.http.node.http',
            description: `${data['http.method']} ${data.url}`,
            data,
          })])
        : undefined;

      if (client && shouldAttachTraceData(rawRequestUrl)) {
        const { traceId, spanId, sampled, dsc } = {
          ...isolationScope.getPropagationContext(),
          ...scope.getPropagationContext(),
        };

        const sentryTraceHeader = requestSpan
          ? spanToTraceHeader(requestSpan)
          : generateSentryTraceHeader(traceId, spanId, sampled);

        const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(
          dsc ||
            (requestSpan
              ? getDynamicSamplingContextFromSpan(requestSpan)
              : getDynamicSamplingContextFromClient(traceId, client, scope)),
        );

        addHeadersToRequestOptions(requestOptions, requestUrl, sentryTraceHeader, sentryBaggageHeader);
      } else {
        DEBUG_BUILD &&
          logger.log(
            `[Tracing] Not adding sentry-trace header to outgoing request (${requestUrl}) due to mismatching tracePropagationTargets option.`,
          );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return originalRequestMethod
        .apply(httpModule, requestArgs)
        .once('response', function ( res) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const req = this;
          if (breadcrumbsEnabled) {
            addRequestBreadcrumb('response', data, req, res);
          }
          if (requestSpan) {
            if (res.statusCode) {
              setHttpStatus(requestSpan, res.statusCode);
            }
            requestSpan.updateName(
              cleanSpanDescription(spanToJSON(requestSpan).description || '', requestOptions, req) || '',
            );
            requestSpan.end();
          }
        })
        .once('error', function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const req = this;

          if (breadcrumbsEnabled) {
            addRequestBreadcrumb('error', data, req);
          }
          if (requestSpan) {
            setHttpStatus(requestSpan, 500);
            requestSpan.updateName(
              cleanSpanDescription(spanToJSON(requestSpan).description || '', requestOptions, req) || '',
            );
            requestSpan.end();
          }
        });
    };
  };
}

function addHeadersToRequestOptions(
  requestOptions,
  requestUrl,
  sentryTraceHeader,
  sentryBaggageHeader,
) {
  // Don't overwrite sentry-trace and baggage header if it's already set.
  const headers = requestOptions.headers || {};
  if (headers['sentry-trace']) {
    return;
  }

  DEBUG_BUILD &&
    logger.log(`[Tracing] Adding sentry-trace header ${sentryTraceHeader} to outgoing request to "${requestUrl}": `);

  requestOptions.headers = {
    ...requestOptions.headers,
    'sentry-trace': sentryTraceHeader,
    // Setting a header to `undefined` will crash in node so we only set the baggage header when it's defined
    ...(sentryBaggageHeader &&
      sentryBaggageHeader.length > 0 && { baggage: normalizeBaggageHeader(requestOptions, sentryBaggageHeader) }),
  };
}

function getRequestSpanData(requestUrl, requestOptions) {
  const method = requestOptions.method || 'GET';
  const data = {
    url: requestUrl,
    'http.method': method,
  };
  if (requestOptions.hash) {
    // strip leading "#"
    data['http.fragment'] = requestOptions.hash.substring(1);
  }
  if (requestOptions.search) {
    // strip leading "?"
    data['http.query'] = requestOptions.search.substring(1);
  }
  return data;
}

function normalizeBaggageHeader(
  requestOptions,
  sentryBaggageHeader,
) {
  if (!requestOptions.headers || !requestOptions.headers.baggage) {
    return sentryBaggageHeader;
  } else if (!sentryBaggageHeader) {
    return requestOptions.headers.baggage ;
  } else if (Array.isArray(requestOptions.headers.baggage)) {
    return [...requestOptions.headers.baggage, sentryBaggageHeader];
  }
  // Type-cast explanation:
  // Technically this the following could be of type `(number | string)[]` but for the sake of simplicity
  // we say this is undefined behaviour, since it would not be baggage spec conform if the user did this.
  return [requestOptions.headers.baggage, sentryBaggageHeader] ;
}

/** Exported for tests only. */
function _shouldCreateSpans(
  tracingOptions,
  clientOptions,
) {
  return tracingOptions === undefined
    ? false
    : tracingOptions.enableIfHasTracingEnabled
      ? hasTracingEnabled(clientOptions)
      : true;
}

/** Exported for tests only. */
function _getShouldCreateSpanForRequest(
  shouldCreateSpans,
  tracingOptions,
  clientOptions,
) {
  const handler = shouldCreateSpans
    ? // eslint-disable-next-line deprecation/deprecation
      _optionalChain([tracingOptions, 'optionalAccess', _11 => _11.shouldCreateSpanForRequest]) || _optionalChain([clientOptions, 'optionalAccess', _12 => _12.shouldCreateSpanForRequest])
    : () => false;

  return handler;
}

export { Http, _getShouldCreateSpanForRequest, _shouldCreateSpans, httpIntegration };
//# sourceMappingURL=http.js.map
