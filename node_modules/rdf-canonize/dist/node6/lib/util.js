/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const api = {};
module.exports = api; // define setImmediate and nextTick
//// nextTick implementation with browser-compatible fallback ////
// from https://github.com/caolan/async/blob/master/lib/async.js
// capture the global reference to guard against fakeTimer mocks

const _setImmediate = typeof setImmediate === 'function' && setImmediate;

const _delay = _setImmediate ? // not a direct alias (for IE10 compatibility)
fn => _setImmediate(fn) : fn => setTimeout(fn, 0);

if (typeof process === 'object' && typeof process.nextTick === 'function') {
  api.nextTick = process.nextTick;
} else {
  api.nextTick = _delay;
}

api.setImmediate = _setImmediate ? _delay : api.nextTick;
/**
 * Clones an object, array, or string/number. If a typed JavaScript object
 * is given, such as a Date, it will be converted to a string.
 *
 * @param value the value to clone.
 *
 * @return the cloned value.
 */

api.clone = function (value) {
  if (value && typeof value === 'object') {
    let rval;

    if (Array.isArray(value)) {
      rval = [];

      for (let i = 0; i < value.length; ++i) {
        rval[i] = api.clone(value[i]);
      }
    } else if (api.isObject(value)) {
      rval = {};

      for (const key in value) {
        rval[key] = api.clone(value[key]);
      }
    } else {
      rval = value.toString();
    }

    return rval;
  }

  return value;
};
/**
 * Returns true if the given value is an Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Object, false if not.
 */


api.isObject = v => Object.prototype.toString.call(v) === '[object Object]';
/**
 * Returns true if the given value is undefined.
 *
 * @param v the value to check.
 *
 * @return true if the value is undefined, false if not.
 */


api.isUndefined = v => typeof v === 'undefined';

api.callbackify = fn => {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (...args) {
        const callback = args[args.length - 1];

        if (typeof callback === 'function') {
          args.pop();
        }

        let result;

        try {
          result = yield fn.apply(null, args);
        } catch (e) {
          if (typeof callback === 'function') {
            return _invokeCallback(callback, e);
          }

          throw e;
        }

        if (typeof callback === 'function') {
          return _invokeCallback(callback, null, result);
        }

        return result;
      });

      return function () {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

function _invokeCallback(callback, err, result) {
  try {
    return callback(err, result);
  } catch (unhandledError) {
    // throw unhandled errors to prevent "unhandled rejected promise"
    // and simulate what would have happened in a promiseless API
    process.nextTick(() => {
      throw unhandledError;
    });
  }
}