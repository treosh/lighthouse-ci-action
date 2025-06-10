import { _optionalChain } from '@sentry/utils';
import { defineIntegration, hasTracingEnabled, getClient, isSentryRequestUrl, getCurrentScope, getIsolationScope, getActiveSpan, spanToTraceHeader, getDynamicSamplingContextFromSpan, getDynamicSamplingContextFromClient, setHttpStatus, addBreadcrumb } from '@sentry/core';
import { LRUMap, generateSentryTraceHeader, dynamicSamplingContextToSentryBaggageHeader, parseUrl, stringMatchesSomePattern, getSanitizedUrlString } from '@sentry/utils';
import { NODE_VERSION } from '../../nodeVersion.js';

var ChannelName;(function (ChannelName) {
  // https://github.com/nodejs/undici/blob/e6fc80f809d1217814c044f52ed40ef13f21e43c/docs/api/DiagnosticsChannel.md#undicirequestcreate
  const RequestCreate = 'undici:request:create'; ChannelName["RequestCreate"] = RequestCreate;
  const RequestEnd = 'undici:request:headers'; ChannelName["RequestEnd"] = RequestEnd;
  const RequestError = 'undici:request:error'; ChannelName["RequestError"] = RequestError;
})(ChannelName || (ChannelName = {}));

// Please note that you cannot use `console.log` to debug the callbacks registered to the `diagnostics_channel` API.
// To debug, you can use `writeFileSync` to write to a file:
// https://nodejs.org/api/async_hooks.html#printing-in-asynchook-callbacks
//
// import { writeFileSync } from 'fs';
// import { format } from 'util';
//
// function debug(...args: any): void {
//   // Use a function like this one when debugging inside an AsyncHook callback
//   // @ts-expect-error any
//   writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
// }

const _nativeNodeFetchintegration = ((options) => {
  // eslint-disable-next-line deprecation/deprecation
  return new Undici(options) ;
}) ;

const nativeNodeFetchintegration = defineIntegration(_nativeNodeFetchintegration);

/**
 * Instruments outgoing HTTP requests made with the `undici` package via
 * Node's `diagnostics_channel` API.
 *
 * Supports Undici 4.7.0 or higher.
 *
 * Requires Node 16.17.0 or higher.
 *
 * @deprecated Use `nativeNodeFetchintegration()` instead.
 */
class Undici  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Undici';}

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line deprecation/deprecation
   __init() {this.name = Undici.id;}

    __init2() {this._createSpanUrlMap = new LRUMap(100);}
    __init3() {this._headersUrlMap = new LRUMap(100);}

   constructor(_options = {}) {Undici.prototype.__init.call(this);Undici.prototype.__init2.call(this);Undici.prototype.__init3.call(this);Undici.prototype.__init4.call(this);Undici.prototype.__init5.call(this);Undici.prototype.__init6.call(this);
    this._options = {
      breadcrumbs: _options.breadcrumbs === undefined ? true : _options.breadcrumbs,
      tracing: _options.tracing,
      shouldCreateSpanForRequest: _options.shouldCreateSpanForRequest,
    };
  }

  /**
   * @inheritDoc
   */
   setupOnce(_addGlobalEventProcessor) {
    // Requires Node 16+ to use the diagnostics_channel API.
    if (NODE_VERSION.major < 16) {
      return;
    }

    let ds;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ds = require('diagnostics_channel') ;
    } catch (e) {
      // no-op
    }

    if (!ds || !ds.subscribe) {
      return;
    }

    // https://github.com/nodejs/undici/blob/e6fc80f809d1217814c044f52ed40ef13f21e43c/docs/api/DiagnosticsChannel.md
    ds.subscribe(ChannelName.RequestCreate, this._onRequestCreate);
    ds.subscribe(ChannelName.RequestEnd, this._onRequestEnd);
    ds.subscribe(ChannelName.RequestError, this._onRequestError);
  }

  /** Helper that wraps shouldCreateSpanForRequest option */
   _shouldCreateSpan(url) {
    if (this._options.tracing === false || (this._options.tracing === undefined && !hasTracingEnabled())) {
      return false;
    }

    if (this._options.shouldCreateSpanForRequest === undefined) {
      return true;
    }

    const cachedDecision = this._createSpanUrlMap.get(url);
    if (cachedDecision !== undefined) {
      return cachedDecision;
    }

    const decision = this._options.shouldCreateSpanForRequest(url);
    this._createSpanUrlMap.set(url, decision);
    return decision;
  }

   __init4() {this._onRequestCreate = (message) => {
    // eslint-disable-next-line deprecation/deprecation
    if (!_optionalChain([getClient, 'call', _10 => _10(), 'optionalAccess', _11 => _11.getIntegration, 'call', _12 => _12(Undici)])) {
      return;
    }

    const { request } = message ;

    const stringUrl = request.origin ? request.origin.toString() + request.path : request.path;

    const client = getClient();
    if (!client) {
      return;
    }

    if (isSentryRequestUrl(stringUrl, client) || request.__sentry_span__ !== undefined) {
      return;
    }

    const clientOptions = client.getOptions();
    const scope = getCurrentScope();
    const isolationScope = getIsolationScope();
    const parentSpan = getActiveSpan();

    const span = this._shouldCreateSpan(stringUrl) ? createRequestSpan(parentSpan, request, stringUrl) : undefined;
    if (span) {
      request.__sentry_span__ = span;
    }

    const shouldAttachTraceData = (url) => {
      if (clientOptions.tracePropagationTargets === undefined) {
        return true;
      }

      const cachedDecision = this._headersUrlMap.get(url);
      if (cachedDecision !== undefined) {
        return cachedDecision;
      }

      const decision = stringMatchesSomePattern(url, clientOptions.tracePropagationTargets);
      this._headersUrlMap.set(url, decision);
      return decision;
    };

    if (shouldAttachTraceData(stringUrl)) {
      const { traceId, spanId, sampled, dsc } = {
        ...isolationScope.getPropagationContext(),
        ...scope.getPropagationContext(),
      };

      const sentryTraceHeader = span ? spanToTraceHeader(span) : generateSentryTraceHeader(traceId, spanId, sampled);

      const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(
        dsc ||
          (span
            ? getDynamicSamplingContextFromSpan(span)
            : getDynamicSamplingContextFromClient(traceId, client, scope)),
      );

      setHeadersOnRequest(request, sentryTraceHeader, sentryBaggageHeader);
    }
  };}

   __init5() {this._onRequestEnd = (message) => {
    // eslint-disable-next-line deprecation/deprecation
    if (!_optionalChain([getClient, 'call', _13 => _13(), 'optionalAccess', _14 => _14.getIntegration, 'call', _15 => _15(Undici)])) {
      return;
    }

    const { request, response } = message ;

    const stringUrl = request.origin ? request.origin.toString() + request.path : request.path;

    if (isSentryRequestUrl(stringUrl, getClient())) {
      return;
    }

    const span = request.__sentry_span__;
    if (span) {
      setHttpStatus(span, response.statusCode);
      span.end();
    }

    if (this._options.breadcrumbs) {
      addBreadcrumb(
        {
          category: 'http',
          data: {
            method: request.method,
            status_code: response.statusCode,
            url: stringUrl,
          },
          type: 'http',
        },
        {
          event: 'response',
          request,
          response,
        },
      );
    }
  };}

   __init6() {this._onRequestError = (message) => {
    // eslint-disable-next-line deprecation/deprecation
    if (!_optionalChain([getClient, 'call', _16 => _16(), 'optionalAccess', _17 => _17.getIntegration, 'call', _18 => _18(Undici)])) {
      return;
    }

    const { request } = message ;

    const stringUrl = request.origin ? request.origin.toString() + request.path : request.path;

    if (isSentryRequestUrl(stringUrl, getClient())) {
      return;
    }

    const span = request.__sentry_span__;
    if (span) {
      span.setStatus('internal_error');
      span.end();
    }

    if (this._options.breadcrumbs) {
      addBreadcrumb(
        {
          category: 'http',
          data: {
            method: request.method,
            url: stringUrl,
          },
          level: 'error',
          type: 'http',
        },
        {
          event: 'error',
          request,
        },
      );
    }
  };}
}Undici.__initStatic();

function setHeadersOnRequest(
  request,
  sentryTrace,
  sentryBaggageHeader,
) {
  let hasSentryHeaders;
  if (Array.isArray(request.headers)) {
    hasSentryHeaders = request.headers.some(headerLine => headerLine === 'sentry-trace');
  } else {
    const headerLines = request.headers.split('\r\n');
    hasSentryHeaders = headerLines.some(headerLine => headerLine.startsWith('sentry-trace:'));
  }

  if (hasSentryHeaders) {
    return;
  }

  request.addHeader('sentry-trace', sentryTrace);
  if (sentryBaggageHeader) {
    request.addHeader('baggage', sentryBaggageHeader);
  }
}

function createRequestSpan(
  activeSpan,
  request,
  stringUrl,
) {
  const url = parseUrl(stringUrl);

  const method = request.method || 'GET';
  const data = {
    'http.method': method,
  };
  if (url.search) {
    data['http.query'] = url.search;
  }
  if (url.hash) {
    data['http.fragment'] = url.hash;
  }
  // eslint-disable-next-line deprecation/deprecation
  return _optionalChain([activeSpan, 'optionalAccess', _19 => _19.startChild, 'call', _20 => _20({
    op: 'http.client',
    origin: 'auto.http.node.undici',
    description: `${method} ${getSanitizedUrlString(url)}`,
    data,
  })]);
}

export { ChannelName, Undici, nativeNodeFetchintegration };
//# sourceMappingURL=index.js.map
