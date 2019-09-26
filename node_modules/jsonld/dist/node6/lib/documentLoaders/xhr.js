/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const {
  parseLinkHeader,
  buildHeaders
} = require('../util');

const {
  LINK_HEADER_REL
} = require('../constants');

const JsonLdError = require('../JsonLdError');

const RequestQueue = require('../RequestQueue');

const REGEX_LINK_HEADER = /(^|(\r\n))link:/i;
/**
 * Creates a built-in XMLHttpRequest document loader.
 *
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          headers: an object (map) of headers which will be passed as request
 *            headers for the requested document. Accept is not allowed.
 *          [xhr]: the XMLHttpRequest API to use.
 *
 * @return the XMLHttpRequest document loader.
 */

module.exports = ({
  secure,
  headers = {},
  xhr
} = {
  headers: {}
}) => {
  headers = buildHeaders(headers);
  const queue = new RequestQueue();
  return queue.wrapLoader(loader);

  function loader(_x) {
    return _loader.apply(this, arguments);
  }

  function _loader() {
    _loader = _asyncToGenerator(function* (url) {
      if (url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
        throw new JsonLdError('URL could not be dereferenced; only "http" and "https" URLs are ' + 'supported.', 'jsonld.InvalidUrl', {
          code: 'loading document failed',
          url
        });
      }

      if (secure && url.indexOf('https') !== 0) {
        throw new JsonLdError('URL could not be dereferenced; secure mode is enabled and ' + 'the URL\'s scheme is not "https".', 'jsonld.InvalidUrl', {
          code: 'loading document failed',
          url
        });
      }

      let req;

      try {
        req = yield _get(xhr, url, headers);
      } catch (e) {
        throw new JsonLdError('URL could not be dereferenced, an error occurred.', 'jsonld.LoadDocumentError', {
          code: 'loading document failed',
          url,
          cause: e
        });
      }

      if (req.status >= 400) {
        throw new JsonLdError('URL could not be dereferenced: ' + req.statusText, 'jsonld.LoadDocumentError', {
          code: 'loading document failed',
          url,
          httpStatusCode: req.status
        });
      }

      const doc = {
        contextUrl: null,
        documentUrl: url,
        document: req.response
      }; // handle Link Header (avoid unsafe header warning by existence testing)

      const contentType = req.getResponseHeader('Content-Type');
      let linkHeader;

      if (REGEX_LINK_HEADER.test(req.getAllResponseHeaders())) {
        linkHeader = req.getResponseHeader('Link');
      }

      if (linkHeader && contentType !== 'application/ld+json') {
        // only 1 related link header permitted
        linkHeader = parseLinkHeader(linkHeader)[LINK_HEADER_REL];

        if (Array.isArray(linkHeader)) {
          throw new JsonLdError('URL could not be dereferenced, it has more than one ' + 'associated HTTP Link Header.', 'jsonld.InvalidUrl', {
            code: 'multiple context link headers',
            url
          });
        }

        if (linkHeader) {
          doc.contextUrl = linkHeader.target;
        }
      }

      return doc;
    });
    return _loader.apply(this, arguments);
  }
};

function _get(xhr, url, headers) {
  xhr = xhr || XMLHttpRequest;
  const req = new xhr();
  return new Promise((resolve, reject) => {
    req.onload = () => resolve(req);

    req.onerror = err => reject(err);

    req.open('GET', url, true);

    for (const k in headers) {
      req.setRequestHeader(k, headers[k]);
    }

    req.send();
  });
}