/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const {
  callbackify,
  normalizeDocumentLoader
} = require('./util');

module.exports = class RequestQueue {
  /**
   * Creates a simple queue for requesting documents.
   */
  constructor() {
    this._requests = {};
    this.add = callbackify(this.add.bind(this));
  }

  wrapLoader(loader) {
    const self = this;
    self._loader = normalizeDocumentLoader(loader);
    return function ()
    /* url */
    {
      return self.add.apply(self, arguments);
    };
  }

  add(url) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const self = _this;
      let promise = self._requests[url];

      if (promise) {
        // URL already queued, wait for it to load
        return Promise.resolve(promise);
      } // queue URL and load it


      promise = self._requests[url] = self._loader(url);

      try {
        return yield promise;
      } finally {
        delete self._requests[url];
      }
    })();
  }

};