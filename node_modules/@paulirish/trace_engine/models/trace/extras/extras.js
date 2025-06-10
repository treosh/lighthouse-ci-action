// @ts-nocheck
/* eslint-disable */

// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Exclude the parts of extras.ts that have painful dependencies. Include these cuz they don't and are needed.
export * as ThirdParties from './ThirdParties.js';
export * as ScriptDuplication from './ScriptDuplication.js';
export * as StackTraceForEvent from './StackTraceForEvent.js';

// The rest of this file is a polyfill :)
// Remove once Lighthouse drops Node 18 support.

// npx esbuild tmp.js --bundle
//
// where tmp.js is:
//
//    import 'es-iterator-helpers/Iterator.prototype.find/auto';
//    import 'es-iterator-helpers/Iterator.prototype.flatMap/auto';
//    import 'es-iterator-helpers/Iterator.prototype.map/auto';
//    import 'es-iterator-helpers/Iterator.prototype.reduce/auto';
//    import 'es-iterator-helpers/Iterator.prototype.toArray/auto';

"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports, module) {
      "use strict";
      var toStr = Object.prototype.toString;
      module.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation = __commonJS({
    "node_modules/object-keys/implementation.js"(exports, module) {
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        }();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports, module) {
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          }(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module.exports = keysShim;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      module.exports = TypeError;
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports, module) {
      "use strict";
      module.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/define-data-property/index.js
  var require_define_data_property = __commonJS({
    "node_modules/define-data-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var gopd = require_gopd();
      module.exports = function defineDataProperty(obj, property, value) {
        if (!obj || typeof obj !== "object" && typeof obj !== "function") {
          throw new $TypeError("`obj` must be an object or a function`");
        }
        if (typeof property !== "string" && typeof property !== "symbol") {
          throw new $TypeError("`property` must be a string or a symbol`");
        }
        if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
          throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
          throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
          throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
          throw new $TypeError("`loose`, if provided, must be a boolean");
        }
        var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
        var nonWritable = arguments.length > 4 ? arguments[4] : null;
        var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
        var loose = arguments.length > 6 ? arguments[6] : false;
        var desc = !!gopd && gopd(obj, property);
        if ($defineProperty) {
          $defineProperty(obj, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          });
        } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
          obj[property] = value;
        } else {
          throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        }
      };
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        return !!$defineProperty;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!$defineProperty) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "node_modules/define-properties/index.js"(exports, module) {
      "use strict";
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var defineDataProperty = require_define_data_property();
      var isFunction = function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      };
      var supportsDescriptors = require_has_property_descriptors()();
      var defineProperty = function(object, name, value, predicate) {
        if (name in object) {
          if (predicate === true) {
            if (object[name] === value) {
              return;
            }
          } else if (!isFunction(predicate) || !predicate()) {
            return;
          }
        }
        if (supportsDescriptors) {
          defineDataProperty(object, name, value, true);
        } else {
          defineDataProperty(object, name, value);
        }
      };
      var defineProperties = function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      };
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module.exports = defineProperties;
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports, module) {
      "use strict";
      module.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      module.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports, module) {
      "use strict";
      module.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports, module) {
      "use strict";
      module.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports, module) {
      "use strict";
      module.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports, module) {
      "use strict";
      module.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports, module) {
      "use strict";
      module.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports, module) {
      "use strict";
      module.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports, module) {
      "use strict";
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports, module) {
      "use strict";
      var $isNaN = require_isNaN();
      module.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = (
            /** @type {PropertyDescriptor} */
            Object.getOwnPropertyDescriptor(obj, sym)
          );
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/get-proto/Reflect.getPrototypeOf.js
  var require_Reflect_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
      "use strict";
      module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    }
  });

  // node_modules/get-proto/Object.getPrototypeOf.js
  var require_Object_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
      "use strict";
      var $Object = require_es_object_atoms();
      module.exports = $Object.getPrototypeOf || null;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      };
      var slicy = function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      };
      var joiny = function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      };
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation2();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/call-bind-apply-helpers/functionCall.js
  var require_functionCall = __commonJS({
    "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
      "use strict";
      module.exports = Function.prototype.call;
    }
  });

  // node_modules/call-bind-apply-helpers/functionApply.js
  var require_functionApply = __commonJS({
    "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
      "use strict";
      module.exports = Function.prototype.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/reflectApply.js
  var require_reflectApply = __commonJS({
    "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
      "use strict";
      module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/actualApply.js
  var require_actualApply = __commonJS({
    "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var $reflectApply = require_reflectApply();
      module.exports = $reflectApply || bind.call($call, $apply);
    }
  });

  // node_modules/call-bind-apply-helpers/index.js
  var require_call_bind_apply_helpers = __commonJS({
    "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $TypeError = require_type();
      var $call = require_functionCall();
      var $actualApply = require_actualApply();
      module.exports = function callBindBasic(args) {
        if (args.length < 1 || typeof args[0] !== "function") {
          throw new $TypeError("a function is required");
        }
        return $actualApply(bind, $call, args);
      };
    }
  });

  // node_modules/dunder-proto/get.js
  var require_get = __commonJS({
    "node_modules/dunder-proto/get.js"(exports, module) {
      "use strict";
      var callBind = require_call_bind_apply_helpers();
      var gOPD = require_gopd();
      var hasProtoAccessor;
      try {
        hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
        [].__proto__ === Array.prototype;
      } catch (e) {
        if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
          throw e;
        }
      }
      var desc = !!hasProtoAccessor && gOPD && gOPD(
        Object.prototype,
        /** @type {keyof typeof Object.prototype} */
        "__proto__"
      );
      var $Object = Object;
      var $getPrototypeOf = $Object.getPrototypeOf;
      module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
        /** @type {import('./get')} */
        function getDunder(value) {
          return $getPrototypeOf(value == null ? value : $Object(value));
        }
      ) : false;
    }
  });

  // node_modules/get-proto/index.js
  var require_get_proto = __commonJS({
    "node_modules/get-proto/index.js"(exports, module) {
      "use strict";
      var reflectGetProto = require_Reflect_getPrototypeOf();
      var originalGetProto = require_Object_getPrototypeOf();
      var getDunderProto = require_get();
      module.exports = reflectGetProto ? function getProto(O) {
        return reflectGetProto(O);
      } : originalGetProto ? function getProto(O) {
        if (!O || typeof O !== "object" && typeof O !== "function") {
          throw new TypeError("getProto: not an object");
        }
        return originalGetProto(O);
      } : getDunderProto ? function getProto(O) {
        return getDunderProto(O);
      } : null;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports, module) {
      "use strict";
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $Object = require_es_object_atoms();
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var abs = require_abs();
      var floor = require_floor();
      var max = require_max();
      var min = require_min();
      var pow = require_pow();
      var round = require_round();
      var sign = require_sign();
      var $Function = Function;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = require_gopd();
      var $defineProperty = require_es_define_property();
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = require_get_proto();
      var $ObjectGPO = require_Object_getPrototypeOf();
      var $ReflectGPO = require_Reflect_getPrototypeOf();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": $EvalError,
        "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": $Object,
        "%Object.getOwnPropertyDescriptor%": $gOPD,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
        "%Function.prototype.call%": $call,
        "%Function.prototype.apply%": $apply,
        "%Object.defineProperty%": $defineProperty,
        "%Object.getPrototypeOf%": $ObjectGPO,
        "%Math.abs%": abs,
        "%Math.floor%": floor,
        "%Math.max%": max,
        "%Math.min%": min,
        "%Math.pow%": pow,
        "%Math.round%": round,
        "%Math.sign%": sign,
        "%Reflect.getPrototypeOf%": $ReflectGPO
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call($call, Array.prototype.concat);
      var $spliceApply = bind.call($apply, Array.prototype.splice);
      var $replace = bind.call($call, String.prototype.replace);
      var $strSlice = bind.call($call, String.prototype.slice);
      var $exec = bind.call($call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void undefined2;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bound/index.js
  var require_call_bound = __commonJS({
    "node_modules/call-bound/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBindBasic = require_call_bind_apply_helpers();
      var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = (
          /** @type {(this: unknown, ...args: unknown[]) => unknown} */
          GetIntrinsic(name, !!allowMissing)
        );
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBindBasic(
            /** @type {const} */
            [intrinsic]
          );
        }
        return intrinsic;
      };
    }
  });

  // node_modules/es-abstract/helpers/IsArray.js
  var require_IsArray = __commonJS({
    "node_modules/es-abstract/helpers/IsArray.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $Array = GetIntrinsic("%Array%");
      var toStr = !$Array.isArray && require_call_bound()("Object.prototype.toString");
      module.exports = $Array.isArray || function IsArray(argument) {
        return toStr(argument) === "[object Array]";
      };
    }
  });

  // node_modules/es-abstract/2024/IsArray.js
  var require_IsArray2 = __commonJS({
    "node_modules/es-abstract/2024/IsArray.js"(exports, module) {
      "use strict";
      module.exports = require_IsArray();
    }
  });

  // node_modules/es-abstract/2024/Call.js
  var require_Call = __commonJS({
    "node_modules/es-abstract/2024/Call.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_call_bound();
      var $TypeError = require_type();
      var IsArray = require_IsArray2();
      var $apply = GetIntrinsic("%Reflect.apply%", true) || callBound("Function.prototype.apply");
      module.exports = function Call(F, V) {
        var argumentsList = arguments.length > 2 ? arguments[2] : [];
        if (!IsArray(argumentsList)) {
          throw new $TypeError("Assertion failed: optional `argumentsList`, if provided, must be a List");
        }
        return $apply(F, V, argumentsList);
      };
    }
  });

  // (disabled):node_modules/object-inspect/util.inspect
  var require_util = __commonJS({
    "(disabled):node_modules/object-inspect/util.inspect"() {
    }
  });

  // node_modules/object-inspect/index.js
  var require_object_inspect = __commonJS({
    "node_modules/object-inspect/index.js"(exports, module) {
      var hasMap = typeof Map === "function" && Map.prototype;
      var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
      var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
      var mapForEach = hasMap && Map.prototype.forEach;
      var hasSet = typeof Set === "function" && Set.prototype;
      var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
      var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
      var setForEach = hasSet && Set.prototype.forEach;
      var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
      var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
      var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
      var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
      var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
      var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
      var booleanValueOf = Boolean.prototype.valueOf;
      var objectToString = Object.prototype.toString;
      var functionToString = Function.prototype.toString;
      var $match = String.prototype.match;
      var $slice = String.prototype.slice;
      var $replace = String.prototype.replace;
      var $toUpperCase = String.prototype.toUpperCase;
      var $toLowerCase = String.prototype.toLowerCase;
      var $test = RegExp.prototype.test;
      var $concat = Array.prototype.concat;
      var $join = Array.prototype.join;
      var $arrSlice = Array.prototype.slice;
      var $floor = Math.floor;
      var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
      var gOPS = Object.getOwnPropertySymbols;
      var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
      var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
        return O.__proto__;
      } : null);
      function addNumericSeparator(num, str) {
        if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
          return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === "number") {
          var int = num < 0 ? -$floor(-num) : $floor(num);
          if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return $replace.call(str, sepRegex, "$&_");
      }
      var utilInspect = require_util();
      var inspectCustom = utilInspect.custom;
      var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
      var quotes = {
        __proto__: null,
        "double": '"',
        single: "'"
      };
      var quoteREs = {
        __proto__: null,
        "double": /(["\\])/g,
        single: /(['\\])/g
      };
      module.exports = function inspect_(obj, options, depth, seen) {
        var opts = options || {};
        if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
          throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
          throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
        if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
          throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
          throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;
        if (typeof obj === "undefined") {
          return "undefined";
        }
        if (obj === null) {
          return "null";
        }
        if (typeof obj === "boolean") {
          return obj ? "true" : "false";
        }
        if (typeof obj === "string") {
          return inspectString(obj, opts);
        }
        if (typeof obj === "number") {
          if (obj === 0) {
            return Infinity / obj > 0 ? "0" : "-0";
          }
          var str = String(obj);
          return numericSeparator ? addNumericSeparator(obj, str) : str;
        }
        if (typeof obj === "bigint") {
          var bigIntStr = String(obj) + "n";
          return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
        }
        var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
        if (typeof depth === "undefined") {
          depth = 0;
        }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
          return isArray(obj) ? "[Array]" : "[Object]";
        }
        var indent = getIndent(opts, depth);
        if (typeof seen === "undefined") {
          seen = [];
        } else if (indexOf(seen, obj) >= 0) {
          return "[Circular]";
        }
        function inspect(value, from, noIndent) {
          if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
          }
          if (noIndent) {
            var newOpts = {
              depth: opts.depth
            };
            if (has(opts, "quoteStyle")) {
              newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
          }
          return inspect_(value, opts, depth + 1, seen);
        }
        if (typeof obj === "function" && !isRegExp(obj)) {
          var name = nameOf(obj);
          var keys = arrObjKeys(obj, inspect);
          return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
        }
        if (isSymbol(obj)) {
          var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
          return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj)) {
          var s = "<" + $toLowerCase.call(String(obj.nodeName));
          var attrs = obj.attributes || [];
          for (var i = 0; i < attrs.length; i++) {
            s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
          }
          s += ">";
          if (obj.childNodes && obj.childNodes.length) {
            s += "...";
          }
          s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
          return s;
        }
        if (isArray(obj)) {
          if (obj.length === 0) {
            return "[]";
          }
          var xs = arrObjKeys(obj, inspect);
          if (indent && !singleLineValues(xs)) {
            return "[" + indentedJoin(xs, indent) + "]";
          }
          return "[ " + $join.call(xs, ", ") + " ]";
        }
        if (isError(obj)) {
          var parts = arrObjKeys(obj, inspect);
          if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
            return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
          }
          if (parts.length === 0) {
            return "[" + String(obj) + "]";
          }
          return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
        }
        if (typeof obj === "object" && customInspect) {
          if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
          } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
            return obj.inspect();
          }
        }
        if (isMap(obj)) {
          var mapParts = [];
          if (mapForEach) {
            mapForEach.call(obj, function(value, key) {
              mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
            });
          }
          return collectionOf("Map", mapSize.call(obj), mapParts, indent);
        }
        if (isSet(obj)) {
          var setParts = [];
          if (setForEach) {
            setForEach.call(obj, function(value) {
              setParts.push(inspect(value, obj));
            });
          }
          return collectionOf("Set", setSize.call(obj), setParts, indent);
        }
        if (isWeakMap(obj)) {
          return weakCollectionOf("WeakMap");
        }
        if (isWeakSet(obj)) {
          return weakCollectionOf("WeakSet");
        }
        if (isWeakRef(obj)) {
          return weakCollectionOf("WeakRef");
        }
        if (isNumber(obj)) {
          return markBoxed(inspect(Number(obj)));
        }
        if (isBigInt(obj)) {
          return markBoxed(inspect(bigIntValueOf.call(obj)));
        }
        if (isBoolean(obj)) {
          return markBoxed(booleanValueOf.call(obj));
        }
        if (isString(obj)) {
          return markBoxed(inspect(String(obj)));
        }
        if (typeof window !== "undefined" && obj === window) {
          return "{ [object Window] }";
        }
        if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
          return "{ [object globalThis] }";
        }
        if (!isDate(obj) && !isRegExp(obj)) {
          var ys = arrObjKeys(obj, inspect);
          var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
          var protoTag = obj instanceof Object ? "" : "null prototype";
          var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
          var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
          var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
          if (ys.length === 0) {
            return tag + "{}";
          }
          if (indent) {
            return tag + "{" + indentedJoin(ys, indent) + "}";
          }
          return tag + "{ " + $join.call(ys, ", ") + " }";
        }
        return String(obj);
      };
      function wrapQuotes(s, defaultStyle, opts) {
        var style = opts.quoteStyle || defaultStyle;
        var quoteChar = quotes[style];
        return quoteChar + s + quoteChar;
      }
      function quote(s) {
        return $replace.call(String(s), /"/g, "&quot;");
      }
      function canTrustToString(obj) {
        return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
      }
      function isArray(obj) {
        return toStr(obj) === "[object Array]" && canTrustToString(obj);
      }
      function isDate(obj) {
        return toStr(obj) === "[object Date]" && canTrustToString(obj);
      }
      function isRegExp(obj) {
        return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
      }
      function isError(obj) {
        return toStr(obj) === "[object Error]" && canTrustToString(obj);
      }
      function isString(obj) {
        return toStr(obj) === "[object String]" && canTrustToString(obj);
      }
      function isNumber(obj) {
        return toStr(obj) === "[object Number]" && canTrustToString(obj);
      }
      function isBoolean(obj) {
        return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
      }
      function isSymbol(obj) {
        if (hasShammedSymbols) {
          return obj && typeof obj === "object" && obj instanceof Symbol;
        }
        if (typeof obj === "symbol") {
          return true;
        }
        if (!obj || typeof obj !== "object" || !symToString) {
          return false;
        }
        try {
          symToString.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isBigInt(obj) {
        if (!obj || typeof obj !== "object" || !bigIntValueOf) {
          return false;
        }
        try {
          bigIntValueOf.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      var hasOwn = Object.prototype.hasOwnProperty || function(key) {
        return key in this;
      };
      function has(obj, key) {
        return hasOwn.call(obj, key);
      }
      function toStr(obj) {
        return objectToString.call(obj);
      }
      function nameOf(f) {
        if (f.name) {
          return f.name;
        }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) {
          return m[1];
        }
        return null;
      }
      function indexOf(xs, x) {
        if (xs.indexOf) {
          return xs.indexOf(x);
        }
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) {
            return i;
          }
        }
        return -1;
      }
      function isMap(x) {
        if (!mapSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          mapSize.call(x);
          try {
            setSize.call(x);
          } catch (s) {
            return true;
          }
          return x instanceof Map;
        } catch (e) {
        }
        return false;
      }
      function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakMapHas.call(x, weakMapHas);
          try {
            weakSetHas.call(x, weakSetHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakMap;
        } catch (e) {
        }
        return false;
      }
      function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakRefDeref.call(x);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isSet(x) {
        if (!setSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          setSize.call(x);
          try {
            mapSize.call(x);
          } catch (m) {
            return true;
          }
          return x instanceof Set;
        } catch (e) {
        }
        return false;
      }
      function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakSetHas.call(x, weakSetHas);
          try {
            weakMapHas.call(x, weakMapHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakSet;
        } catch (e) {
        }
        return false;
      }
      function isElement(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
          return true;
        }
        return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
      }
      function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
          var remaining = str.length - opts.maxStringLength;
          var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
          return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        var quoteRE = quoteREs[opts.quoteStyle || "single"];
        quoteRE.lastIndex = 0;
        var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, "single", opts);
      }
      function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[n];
        if (x) {
          return "\\" + x;
        }
        return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
      }
      function markBoxed(str) {
        return "Object(" + str + ")";
      }
      function weakCollectionOf(type) {
        return type + " { ? }";
      }
      function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
        return type + " (" + size + ") {" + joinedEntries + "}";
      }
      function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
          if (indexOf(xs[i], "\n") >= 0) {
            return false;
          }
        }
        return true;
      }
      function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === "	") {
          baseIndent = "	";
        } else if (typeof opts.indent === "number" && opts.indent > 0) {
          baseIndent = $join.call(Array(opts.indent + 1), " ");
        } else {
          return null;
        }
        return {
          base: baseIndent,
          prev: $join.call(Array(depth + 1), baseIndent)
        };
      }
      function indentedJoin(xs, indent) {
        if (xs.length === 0) {
          return "";
        }
        var lineJoiner = "\n" + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
      }
      function arrObjKeys(obj, inspect) {
        var isArr = isArray(obj);
        var xs = [];
        if (isArr) {
          xs.length = obj.length;
          for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
          }
        }
        var syms = typeof gOPS === "function" ? gOPS(obj) : [];
        var symMap;
        if (hasShammedSymbols) {
          symMap = {};
          for (var k = 0; k < syms.length; k++) {
            symMap["$" + syms[k]] = syms[k];
          }
        }
        for (var key in obj) {
          if (!has(obj, key)) {
            continue;
          }
          if (isArr && String(Number(key)) === key && key < obj.length) {
            continue;
          }
          if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
            continue;
          } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
          } else {
            xs.push(key + ": " + inspect(obj[key], obj));
          }
        }
        if (typeof gOPS === "function") {
          for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
              xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
            }
          }
        }
        return xs;
      }
    }
  });

  // node_modules/es-abstract/helpers/isObject.js
  var require_isObject = __commonJS({
    "node_modules/es-abstract/helpers/isObject.js"(exports, module) {
      "use strict";
      module.exports = function isObject(x) {
        return !!x && (typeof x === "function" || typeof x === "object");
      };
    }
  });

  // node_modules/es-abstract/helpers/isPropertyKey.js
  var require_isPropertyKey = __commonJS({
    "node_modules/es-abstract/helpers/isPropertyKey.js"(exports, module) {
      "use strict";
      module.exports = function isPropertyKey(argument) {
        return typeof argument === "string" || typeof argument === "symbol";
      };
    }
  });

  // node_modules/es-abstract/2024/Get.js
  var require_Get = __commonJS({
    "node_modules/es-abstract/2024/Get.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var inspect = require_object_inspect();
      var isObject = require_isObject();
      var isPropertyKey = require_isPropertyKey();
      module.exports = function Get(O, P) {
        if (!isObject(O)) {
          throw new $TypeError("Assertion failed: Type(O) is not Object");
        }
        if (!isPropertyKey(P)) {
          throw new $TypeError("Assertion failed: P is not a Property Key, got " + inspect(P));
        }
        return O[P];
      };
    }
  });

  // node_modules/es-abstract/5/Type.js
  var require_Type = __commonJS({
    "node_modules/es-abstract/5/Type.js"(exports, module) {
      "use strict";
      var isObject = require_isObject();
      module.exports = function Type(x) {
        if (x === null) {
          return "Null";
        }
        if (typeof x === "undefined") {
          return "Undefined";
        }
        if (isObject(x)) {
          return "Object";
        }
        if (typeof x === "number") {
          return "Number";
        }
        if (typeof x === "boolean") {
          return "Boolean";
        }
        if (typeof x === "string") {
          return "String";
        }
      };
    }
  });

  // node_modules/es-abstract/2024/Type.js
  var require_Type2 = __commonJS({
    "node_modules/es-abstract/2024/Type.js"(exports, module) {
      "use strict";
      var ES5Type = require_Type();
      module.exports = function Type(x) {
        if (typeof x === "symbol") {
          return "Symbol";
        }
        if (typeof x === "bigint") {
          return "BigInt";
        }
        return ES5Type(x);
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/GetIteratorDirect.js
  var require_GetIteratorDirect = __commonJS({
    "node_modules/es-iterator-helpers/aos/GetIteratorDirect.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Get = require_Get();
      var Type = require_Type2();
      module.exports = function GetIteratorDirect(obj) {
        if (Type(obj) !== "Object") {
          throw new $TypeError("Assertion failed: `obj` must be an Object");
        }
        var nextMethod = Get(obj, "next");
        var iteratorRecord = { "[[Iterator]]": obj, "[[NextMethod]]": nextMethod, "[[Done]]": false };
        return iteratorRecord;
      };
    }
  });

  // node_modules/is-callable/index.js
  var require_is_callable = __commonJS({
    "node_modules/is-callable/index.js"(exports, module) {
      "use strict";
      var fnToStr = Function.prototype.toString;
      var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
      var badArrayLike;
      var isCallableMarker;
      if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
        try {
          badArrayLike = Object.defineProperty({}, "length", {
            get: function() {
              throw isCallableMarker;
            }
          });
          isCallableMarker = {};
          reflectApply(function() {
            throw 42;
          }, null, badArrayLike);
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null;
          }
        }
      } else {
        reflectApply = null;
      }
      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false;
        }
      };
      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var objectClass = "[object Object]";
      var fnClass = "[object Function]";
      var genClass = "[object GeneratorFunction]";
      var ddaClass = "[object HTMLAllCollection]";
      var ddaClass2 = "[object HTML document.all class]";
      var ddaClass3 = "[object HTMLCollection]";
      var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
      var isIE68 = !(0 in [,]);
      var isDDA = function isDocumentDotAll() {
        return false;
      };
      if (typeof document === "object") {
        all = document.all;
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll(value) {
            if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
              try {
                var str = toStr.call(value);
                return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
              } catch (e) {
              }
            }
            return false;
          };
        }
      }
      var all;
      module.exports = reflectApply ? function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        try {
          reflectApply(value, null, badArrayLike);
        } catch (e) {
          if (e !== isCallableMarker) {
            return false;
          }
        }
        return !isES6ClassFn(value) && tryFunctionObject(value);
      } : function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
          return false;
        }
        return tryFunctionObject(value);
      };
    }
  });

  // node_modules/es-abstract/2024/IsCallable.js
  var require_IsCallable = __commonJS({
    "node_modules/es-abstract/2024/IsCallable.js"(exports, module) {
      "use strict";
      module.exports = require_is_callable();
    }
  });

  // node_modules/side-channel-list/index.js
  var require_side_channel_list = __commonJS({
    "node_modules/side-channel-list/index.js"(exports, module) {
      "use strict";
      var inspect = require_object_inspect();
      var $TypeError = require_type();
      var listGetNode = function(list, key, isDelete) {
        var prev = list;
        var curr;
        for (; (curr = prev.next) != null; prev = curr) {
          if (curr.key === key) {
            prev.next = curr.next;
            if (!isDelete) {
              curr.next = /** @type {NonNullable<typeof list.next>} */
              list.next;
              list.next = curr;
            }
            return curr;
          }
        }
      };
      var listGet = function(objects, key) {
        if (!objects) {
          return void 0;
        }
        var node = listGetNode(objects, key);
        return node && node.value;
      };
      var listSet = function(objects, key, value) {
        var node = listGetNode(objects, key);
        if (node) {
          node.value = value;
        } else {
          objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
          {
            // eslint-disable-line no-param-reassign, no-extra-parens
            key,
            next: objects.next,
            value
          };
        }
      };
      var listHas = function(objects, key) {
        if (!objects) {
          return false;
        }
        return !!listGetNode(objects, key);
      };
      var listDelete = function(objects, key) {
        if (objects) {
          return listGetNode(objects, key, true);
        }
      };
      module.exports = function getSideChannelList() {
        var $o;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            var root = $o && $o.next;
            var deletedNode = listDelete($o, key);
            if (deletedNode && root && root === deletedNode) {
              $o = void 0;
            }
            return !!deletedNode;
          },
          get: function(key) {
            return listGet($o, key);
          },
          has: function(key) {
            return listHas($o, key);
          },
          set: function(key, value) {
            if (!$o) {
              $o = {
                next: void 0
              };
            }
            listSet(
              /** @type {NonNullable<typeof $o>} */
              $o,
              key,
              value
            );
          }
        };
        return channel;
      };
    }
  });

  // node_modules/side-channel-map/index.js
  var require_side_channel_map = __commonJS({
    "node_modules/side-channel-map/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_call_bound();
      var inspect = require_object_inspect();
      var $TypeError = require_type();
      var $Map = GetIntrinsic("%Map%", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSet = callBound("Map.prototype.set", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var $mapDelete = callBound("Map.prototype.delete", true);
      var $mapSize = callBound("Map.prototype.size", true);
      module.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
      function getSideChannelMap() {
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($m) {
              var result = $mapDelete($m, key);
              if ($mapSize($m) === 0) {
                $m = void 0;
              }
              return result;
            }
            return false;
          },
          get: function(key) {
            if ($m) {
              return $mapGet($m, key);
            }
          },
          has: function(key) {
            if ($m) {
              return $mapHas($m, key);
            }
            return false;
          },
          set: function(key, value) {
            if (!$m) {
              $m = new $Map();
            }
            $mapSet($m, key, value);
          }
        };
        return channel;
      };
    }
  });

  // node_modules/side-channel-weakmap/index.js
  var require_side_channel_weakmap = __commonJS({
    "node_modules/side-channel-weakmap/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_call_bound();
      var inspect = require_object_inspect();
      var getSideChannelMap = require_side_channel_map();
      var $TypeError = require_type();
      var $WeakMap = GetIntrinsic("%WeakMap%", true);
      var $weakMapGet = callBound("WeakMap.prototype.get", true);
      var $weakMapSet = callBound("WeakMap.prototype.set", true);
      var $weakMapHas = callBound("WeakMap.prototype.has", true);
      var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
      module.exports = $WeakMap ? (
        /** @type {Exclude<import('.'), false>} */
        function getSideChannelWeakMap() {
          var $wm;
          var $m;
          var channel = {
            assert: function(key) {
              if (!channel.has(key)) {
                throw new $TypeError("Side channel does not contain " + inspect(key));
              }
            },
            "delete": function(key) {
              if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
                if ($wm) {
                  return $weakMapDelete($wm, key);
                }
              } else if (getSideChannelMap) {
                if ($m) {
                  return $m["delete"](key);
                }
              }
              return false;
            },
            get: function(key) {
              if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
                if ($wm) {
                  return $weakMapGet($wm, key);
                }
              }
              return $m && $m.get(key);
            },
            has: function(key) {
              if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
                if ($wm) {
                  return $weakMapHas($wm, key);
                }
              }
              return !!$m && $m.has(key);
            },
            set: function(key, value) {
              if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
                if (!$wm) {
                  $wm = new $WeakMap();
                }
                $weakMapSet($wm, key, value);
              } else if (getSideChannelMap) {
                if (!$m) {
                  $m = getSideChannelMap();
                }
                $m.set(key, value);
              }
            }
          };
          return channel;
        }
      ) : getSideChannelMap;
    }
  });

  // node_modules/side-channel/index.js
  var require_side_channel = __commonJS({
    "node_modules/side-channel/index.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var inspect = require_object_inspect();
      var getSideChannelList = require_side_channel_list();
      var getSideChannelMap = require_side_channel_map();
      var getSideChannelWeakMap = require_side_channel_weakmap();
      var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
      module.exports = function getSideChannel() {
        var $channelData;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            return !!$channelData && $channelData["delete"](key);
          },
          get: function(key) {
            return $channelData && $channelData.get(key);
          },
          has: function(key) {
            return !!$channelData && $channelData.has(key);
          },
          set: function(key, value) {
            if (!$channelData) {
              $channelData = makeChannel();
            }
            $channelData.set(key, value);
          }
        };
        return channel;
      };
    }
  });

  // node_modules/internal-slot/index.js
  var require_internal_slot = __commonJS({
    "node_modules/internal-slot/index.js"(exports, module) {
      "use strict";
      var hasOwn = require_hasown();
      var channel = require_side_channel()();
      var $TypeError = require_type();
      var SLOT = {
        assert: function(O, slot) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          channel.assert(O);
          if (!SLOT.has(O, slot)) {
            throw new $TypeError("`" + slot + "` is not present on `O`");
          }
        },
        get: function(O, slot) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          var slots = channel.get(O);
          return slots && slots[
            /** @type {SaltedInternalSlot} */
            "$" + slot
          ];
        },
        has: function(O, slot) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          var slots = channel.get(O);
          return !!slots && hasOwn(
            slots,
            /** @type {SaltedInternalSlot} */
            "$" + slot
          );
        },
        set: function(O, slot, V) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          var slots = channel.get(O);
          if (!slots) {
            slots = {};
            channel.set(O, slots);
          }
          slots[
            /** @type {SaltedInternalSlot} */
            "$" + slot
          ] = V;
        }
      };
      if (Object.freeze) {
        Object.freeze(SLOT);
      }
      module.exports = SLOT;
    }
  });

  // node_modules/es-abstract/2024/CompletionRecord.js
  var require_CompletionRecord = __commonJS({
    "node_modules/es-abstract/2024/CompletionRecord.js"(exports, module) {
      "use strict";
      var $SyntaxError = require_syntax();
      var SLOT = require_internal_slot();
      var CompletionRecord = function CompletionRecord2(type, value) {
        if (!(this instanceof CompletionRecord2)) {
          return new CompletionRecord2(type, value);
        }
        if (type !== "normal" && type !== "break" && type !== "continue" && type !== "return" && type !== "throw") {
          throw new $SyntaxError('Assertion failed: `type` must be one of "normal", "break", "continue", "return", or "throw"');
        }
        SLOT.set(this, "[[Type]]", type);
        SLOT.set(this, "[[Value]]", value);
      };
      CompletionRecord.prototype.type = function Type() {
        return SLOT.get(this, "[[Type]]");
      };
      CompletionRecord.prototype.value = function Value() {
        return SLOT.get(this, "[[Value]]");
      };
      CompletionRecord.prototype["?"] = function ReturnIfAbrupt() {
        var type = SLOT.get(this, "[[Type]]");
        var value = SLOT.get(this, "[[Value]]");
        if (type === "throw") {
          throw value;
        }
        return value;
      };
      CompletionRecord.prototype["!"] = function assert() {
        var type = SLOT.get(this, "[[Type]]");
        if (type !== "normal") {
          throw new $SyntaxError('Assertion failed: Completion Record is not of type "normal"');
        }
        return SLOT.get(this, "[[Value]]");
      };
      module.exports = CompletionRecord;
    }
  });

  // node_modules/es-abstract/2024/GetV.js
  var require_GetV = __commonJS({
    "node_modules/es-abstract/2024/GetV.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var inspect = require_object_inspect();
      var isPropertyKey = require_isPropertyKey();
      module.exports = function GetV(V, P) {
        if (!isPropertyKey(P)) {
          throw new $TypeError("Assertion failed: P is not a Property Key, got " + inspect(P));
        }
        return V[P];
      };
    }
  });

  // node_modules/es-abstract/2024/GetMethod.js
  var require_GetMethod = __commonJS({
    "node_modules/es-abstract/2024/GetMethod.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var GetV = require_GetV();
      var IsCallable = require_IsCallable();
      var isPropertyKey = require_isPropertyKey();
      var inspect = require_object_inspect();
      module.exports = function GetMethod(O, P) {
        if (!isPropertyKey(P)) {
          throw new $TypeError("Assertion failed: P is not a Property Key");
        }
        var func = GetV(O, P);
        if (func == null) {
          return void 0;
        }
        if (!IsCallable(func)) {
          throw new $TypeError(inspect(P) + " is not a function: " + inspect(func));
        }
        return func;
      };
    }
  });

  // node_modules/es-abstract/helpers/records/iterator-record.js
  var require_iterator_record = __commonJS({
    "node_modules/es-abstract/helpers/records/iterator-record.js"(exports, module) {
      "use strict";
      var hasOwn = require_hasown();
      module.exports = function isIteratorRecord(value) {
        return !!value && typeof value === "object" && hasOwn(value, "[[Iterator]]") && hasOwn(value, "[[NextMethod]]") && hasOwn(value, "[[Done]]") && typeof value["[[Done]]"] === "boolean";
      };
    }
  });

  // node_modules/es-abstract/2024/IteratorClose.js
  var require_IteratorClose = __commonJS({
    "node_modules/es-abstract/2024/IteratorClose.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Call = require_Call();
      var CompletionRecord = require_CompletionRecord();
      var GetMethod = require_GetMethod();
      var IsCallable = require_IsCallable();
      var isObject = require_isObject();
      var isIteratorRecord = require_iterator_record();
      module.exports = function IteratorClose(iteratorRecord, completion) {
        if (!isIteratorRecord(iteratorRecord)) {
          throw new $TypeError("Assertion failed: `iteratorRecord` must be an Iterator Record");
        }
        if (!isObject(iteratorRecord["[[Iterator]]"])) {
          throw new $TypeError("Assertion failed: iteratorRecord.[[Iterator]] must be an Object");
        }
        if (!IsCallable(completion) && !(completion instanceof CompletionRecord)) {
          throw new $TypeError("Assertion failed: completion is not a thunk representing a Completion Record, nor a Completion Record instance");
        }
        var completionThunk = completion instanceof CompletionRecord ? function() {
          return completion["?"]();
        } : completion;
        var iterator = iteratorRecord["[[Iterator]]"];
        var iteratorReturn;
        try {
          iteratorReturn = GetMethod(iterator, "return");
        } catch (e) {
          completionThunk();
          completionThunk = null;
          throw e;
        }
        if (typeof iteratorReturn === "undefined") {
          return completionThunk();
        }
        var innerResult;
        try {
          innerResult = Call(iteratorReturn, iterator, []);
        } catch (e) {
          completionThunk();
          completionThunk = null;
          throw e;
        }
        var completionRecord = completionThunk();
        completionThunk = null;
        if (!isObject(innerResult)) {
          throw new $TypeError("iterator .return must return an object");
        }
        return completionRecord;
      };
    }
  });

  // node_modules/es-abstract/2024/ToBoolean.js
  var require_ToBoolean = __commonJS({
    "node_modules/es-abstract/2024/ToBoolean.js"(exports, module) {
      "use strict";
      module.exports = function ToBoolean(value) {
        return !!value;
      };
    }
  });

  // node_modules/es-abstract/2024/IteratorComplete.js
  var require_IteratorComplete = __commonJS({
    "node_modules/es-abstract/2024/IteratorComplete.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Get = require_Get();
      var ToBoolean = require_ToBoolean();
      var isObject = require_isObject();
      module.exports = function IteratorComplete(iterResult) {
        if (!isObject(iterResult)) {
          throw new $TypeError("Assertion failed: Type(iterResult) is not Object");
        }
        return ToBoolean(Get(iterResult, "done"));
      };
    }
  });

  // node_modules/es-abstract/2024/IteratorNext.js
  var require_IteratorNext = __commonJS({
    "node_modules/es-abstract/2024/IteratorNext.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Call = require_Call();
      var isObject = require_isObject();
      var isIteratorRecord = require_iterator_record();
      module.exports = function IteratorNext(iteratorRecord) {
        if (!isIteratorRecord(iteratorRecord)) {
          throw new $TypeError("Assertion failed: `iteratorRecord` must be an Iterator Record");
        }
        var result;
        if (arguments.length < 2) {
          result = Call(iteratorRecord["[[NextMethod]]"], iteratorRecord["[[Iterator]]"]);
        } else {
          result = Call(iteratorRecord["[[NextMethod]]"], iteratorRecord["[[Iterator]]"], [arguments[1]]);
        }
        if (!isObject(result)) {
          throw new $TypeError("iterator next must return an object");
        }
        return result;
      };
    }
  });

  // node_modules/es-abstract/2024/IteratorStepValue.js
  var require_IteratorStepValue = __commonJS({
    "node_modules/es-abstract/2024/IteratorStepValue.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Get = require_Get();
      var IteratorComplete = require_IteratorComplete();
      var IteratorNext = require_IteratorNext();
      var isIteratorRecord = require_iterator_record();
      module.exports = function IteratorStepValue(iteratorRecord) {
        if (!isIteratorRecord(iteratorRecord)) {
          throw new $TypeError("Assertion failed: `iteratorRecord` must be an Iterator Record");
        }
        var result;
        try {
          result = IteratorNext(iteratorRecord);
        } catch (e) {
          iteratorRecord["[[Done]]"] = true;
          throw e;
        }
        var done;
        try {
          done = IteratorComplete(result);
        } catch (e) {
          iteratorRecord["[[Done]]"] = true;
          throw e;
        }
        if (done) {
          iteratorRecord["[[Done]]"] = true;
          return "DONE";
        }
        var value;
        try {
          value = Get(result, "value");
        } catch (e) {
          iteratorRecord["[[Done]]"] = true;
          throw e;
        }
        return value;
      };
    }
  });

  // node_modules/es-abstract/2024/NormalCompletion.js
  var require_NormalCompletion = __commonJS({
    "node_modules/es-abstract/2024/NormalCompletion.js"(exports, module) {
      "use strict";
      var CompletionRecord = require_CompletionRecord();
      module.exports = function NormalCompletion(value) {
        return new CompletionRecord("normal", value);
      };
    }
  });

  // node_modules/es-abstract/2024/ThrowCompletion.js
  var require_ThrowCompletion = __commonJS({
    "node_modules/es-abstract/2024/ThrowCompletion.js"(exports, module) {
      "use strict";
      var CompletionRecord = require_CompletionRecord();
      module.exports = function ThrowCompletion(argument) {
        return new CompletionRecord("throw", argument);
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.find/implementation.js
  var require_implementation3 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.find/implementation.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Call = require_Call();
      var GetIteratorDirect = require_GetIteratorDirect();
      var IsCallable = require_IsCallable();
      var IteratorClose = require_IteratorClose();
      var IteratorStepValue = require_IteratorStepValue();
      var NormalCompletion = require_NormalCompletion();
      var ThrowCompletion = require_ThrowCompletion();
      var ToBoolean = require_ToBoolean();
      var Type = require_Type2();
      module.exports = function find(predicate) {
        if (this instanceof find) {
          throw new $TypeError("`find` is not a constructor");
        }
        var O = this;
        if (Type(O) !== "Object") {
          throw new $TypeError("`this` value must be an Object");
        }
        if (!IsCallable(predicate)) {
          throw new $TypeError("`predicate` must be a function");
        }
        var iterated = GetIteratorDirect(O);
        var counter = 0;
        while (true) {
          var value = IteratorStepValue(iterated);
          if (iterated["[[Done]]"]) {
            return void 0;
          }
          var result;
          try {
            result = Call(predicate, void 0, [value, counter]);
          } catch (e) {
            IteratorClose(
              iterated,
              ThrowCompletion(e)
            );
          } finally {
            counter += 1;
          }
          if (ToBoolean(result)) {
            return IteratorClose(
              iterated,
              NormalCompletion(value)
            );
          }
        }
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.find/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.find/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation3();
      module.exports = function getPolyfill() {
        return typeof Iterator === "function" && typeof Iterator.prototype.find === "function" ? Iterator.prototype.find : implementation;
      };
    }
  });

  // node_modules/functions-have-names/index.js
  var require_functions_have_names = __commonJS({
    "node_modules/functions-have-names/index.js"(exports, module) {
      "use strict";
      var functionsHaveNames = function functionsHaveNames2() {
        return typeof function f() {
        }.name === "string";
      };
      var gOPD = Object.getOwnPropertyDescriptor;
      if (gOPD) {
        try {
          gOPD([], "length");
        } catch (e) {
          gOPD = null;
        }
      }
      functionsHaveNames.functionsHaveConfigurableNames = function functionsHaveConfigurableNames() {
        if (!functionsHaveNames() || !gOPD) {
          return false;
        }
        var desc = gOPD(function() {
        }, "name");
        return !!desc && !!desc.configurable;
      };
      var $bind = Function.prototype.bind;
      functionsHaveNames.boundFunctionsHaveNames = function boundFunctionsHaveNames() {
        return functionsHaveNames() && typeof $bind === "function" && function f() {
        }.bind().name !== "";
      };
      module.exports = functionsHaveNames;
    }
  });

  // node_modules/set-function-name/index.js
  var require_set_function_name = __commonJS({
    "node_modules/set-function-name/index.js"(exports, module) {
      "use strict";
      var define = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var functionsHaveConfigurableNames = require_functions_have_names().functionsHaveConfigurableNames();
      var $TypeError = require_type();
      module.exports = function setFunctionName(fn, name) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        if (!loose || functionsHaveConfigurableNames) {
          if (hasDescriptors) {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "name",
              name,
              true,
              true
            );
          } else {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "name",
              name
            );
          }
        }
        return fn;
      };
    }
  });

  // node_modules/iterator.prototype/index.js
  var require_iterator = __commonJS({
    "node_modules/iterator.prototype/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var gPO = require_get_proto();
      var hasSymbols = require_has_symbols();
      var setFunctionName = require_set_function_name();
      var defineDataProperty = require_define_data_property();
      var $Object = require_es_object_atoms();
      var arrayIterProto = GetIntrinsic("%ArrayIteratorPrototype%", true);
      var iterProto = arrayIterProto && gPO(arrayIterProto);
      var result = iterProto !== $Object.prototype && iterProto || {};
      if (hasSymbols()) {
        if (!(Symbol.iterator in result)) {
          iter = setFunctionName(function SymbolIterator() {
            return this;
          }, "[Symbol.iterator]", true);
          defineDataProperty(result, Symbol.iterator, iter, true);
        }
      }
      var iter;
      module.exports = result;
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype/implementation.js
  var require_implementation4 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype/implementation.js"(exports, module) {
      "use strict";
      module.exports = require_iterator();
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.find/shim.js
  var require_shim = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.find/shim.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var getPolyfill = require_polyfill();
      var $IteratorPrototype = require_implementation4();
      module.exports = function shimIteratorPrototypeFind() {
        var polyfill = getPolyfill();
        define(
          $IteratorPrototype,
          { find: polyfill },
          { find: function() {
            return $IteratorPrototype.find !== polyfill;
          } }
        );
        return polyfill;
      };
    }
  });

  // node_modules/es-abstract/2024/CreateIterResultObject.js
  var require_CreateIterResultObject = __commonJS({
    "node_modules/es-abstract/2024/CreateIterResultObject.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      module.exports = function CreateIterResultObject(value, done) {
        if (typeof done !== "boolean") {
          throw new $TypeError("Assertion failed: Type(done) is not Boolean");
        }
        return {
          value,
          done
        };
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/GeneratorStart.js
  var require_GeneratorStart = __commonJS({
    "node_modules/es-iterator-helpers/aos/GeneratorStart.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var CreateIterResultObject = require_CreateIterResultObject();
      var IsCallable = require_IsCallable();
      var Type = require_Type2();
      var SLOT = require_internal_slot();
      module.exports = function GeneratorStart(generator, closure) {
        SLOT.assert(generator, "[[GeneratorState]]");
        SLOT.assert(generator, "[[GeneratorContext]]");
        SLOT.assert(generator, "[[GeneratorBrand]]");
        SLOT.assert(generator, "[[Sentinel]]");
        SLOT.assert(generator, "[[CloseIfAbrupt]]");
        if (!IsCallable(closure) || closure.length !== 0) {
          throw new $TypeError("`closure` must be a function that takes no arguments");
        }
        var sentinel = SLOT.get(closure, "[[Sentinel]]");
        if (Type(sentinel) !== "Object") {
          throw new $TypeError("`closure.[[Sentinel]]` must be an object");
        }
        SLOT.set(generator, "[[GeneratorContext]]", function() {
          try {
            var result = closure();
            if (result === sentinel) {
              SLOT.set(generator, "[[GeneratorState]]", "completed");
              SLOT.set(generator, "[[GeneratorContext]]", null);
              return CreateIterResultObject(void 0, true);
            }
            SLOT.set(generator, "[[GeneratorState]]", "suspendedYield");
            return CreateIterResultObject(result, false);
          } catch (e) {
            SLOT.set(generator, "[[GeneratorState]]", "completed");
            SLOT.set(generator, "[[GeneratorContext]]", null);
            throw e;
          }
        });
        SLOT.set(generator, "[[GeneratorState]]", "suspendedStart");
      };
    }
  });

  // node_modules/es-abstract/helpers/forEach.js
  var require_forEach = __commonJS({
    "node_modules/es-abstract/helpers/forEach.js"(exports, module) {
      "use strict";
      module.exports = function forEach(array, callback) {
        for (var i = 0; i < array.length; i += 1) {
          callback(array[i], i, array);
        }
      };
    }
  });

  // node_modules/has-proto/index.js
  var require_has_proto = __commonJS({
    "node_modules/has-proto/index.js"(exports, module) {
      "use strict";
      var test = {
        __proto__: null,
        foo: {}
      };
      var result = { __proto__: test }.foo === test.foo && !(test instanceof Object);
      module.exports = function hasProto() {
        return result;
      };
    }
  });

  // node_modules/es-abstract/2024/OrdinaryObjectCreate.js
  var require_OrdinaryObjectCreate = __commonJS({
    "node_modules/es-abstract/2024/OrdinaryObjectCreate.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $ObjectCreate = GetIntrinsic("%Object.create%", true);
      var $TypeError = require_type();
      var $SyntaxError = require_syntax();
      var IsArray = require_IsArray2();
      var forEach = require_forEach();
      var isObject = require_isObject();
      var SLOT = require_internal_slot();
      var hasProto = require_has_proto()();
      module.exports = function OrdinaryObjectCreate(proto) {
        if (proto !== null && !isObject(proto)) {
          throw new $TypeError("Assertion failed: `proto` must be null or an object");
        }
        var additionalInternalSlotsList = arguments.length < 2 ? [] : arguments[1];
        if (!IsArray(additionalInternalSlotsList)) {
          throw new $TypeError("Assertion failed: `additionalInternalSlotsList` must be an Array");
        }
        var O;
        if ($ObjectCreate) {
          O = $ObjectCreate(proto);
        } else if (hasProto) {
          O = { __proto__: proto };
        } else {
          if (proto === null) {
            throw new $SyntaxError("native Object.create support is required to create null objects");
          }
          var T = function T2() {
          };
          T.prototype = proto;
          O = new T();
        }
        if (additionalInternalSlotsList.length > 0) {
          forEach(additionalInternalSlotsList, function(slot) {
            SLOT.set(O, slot, void 0);
          });
        }
        return O;
      };
    }
  });

  // node_modules/es-abstract/helpers/every.js
  var require_every = __commonJS({
    "node_modules/es-abstract/helpers/every.js"(exports, module) {
      "use strict";
      module.exports = function every(array, predicate) {
        for (var i = 0; i < array.length; i += 1) {
          if (!predicate(array[i], i, array)) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/set-function-length/index.js
  var require_set_function_length = __commonJS({
    "node_modules/set-function-length/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var define = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var gOPD = require_gopd();
      var $TypeError = require_type();
      var $floor = GetIntrinsic("%Math.floor%");
      module.exports = function setFunctionLength(fn, length) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
          throw new $TypeError("`length` must be a positive 32-bit integer");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        var functionLengthIsConfigurable = true;
        var functionLengthIsWritable = true;
        if ("length" in fn && gOPD) {
          var desc = gOPD(fn, "length");
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false;
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false;
          }
        }
        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length,
              true,
              true
            );
          } else {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length
            );
          }
        }
        return fn;
      };
    }
  });

  // node_modules/call-bind-apply-helpers/applyBind.js
  var require_applyBind = __commonJS({
    "node_modules/call-bind-apply-helpers/applyBind.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var actualApply = require_actualApply();
      module.exports = function applyBind() {
        return actualApply(bind, $apply, arguments);
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      var setFunctionLength = require_set_function_length();
      var $defineProperty = require_es_define_property();
      var callBindBasic = require_call_bind_apply_helpers();
      var applyBind = require_applyBind();
      module.exports = function callBind(originalFunction) {
        var func = callBindBasic(arguments);
        var adjustedLength = originalFunction.length - (arguments.length - 1);
        return setFunctionLength(
          func,
          1 + (adjustedLength > 0 ? adjustedLength : 0),
          true
        );
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/isarray/index.js
  var require_isarray = __commonJS({
    "node_modules/isarray/index.js"(exports, module) {
      var toString = {}.toString;
      module.exports = Array.isArray || function(arr) {
        return toString.call(arr) == "[object Array]";
      };
    }
  });

  // node_modules/safe-array-concat/index.js
  var require_safe_array_concat = __commonJS({
    "node_modules/safe-array-concat/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $concat = GetIntrinsic("%Array.prototype.concat%");
      var callBind = require_call_bind();
      var callBound = require_call_bound();
      var $slice = callBound("Array.prototype.slice");
      var hasSymbols = require_shams()();
      var isConcatSpreadable = hasSymbols && Symbol.isConcatSpreadable;
      var empty = [];
      var $concatApply = isConcatSpreadable ? callBind.apply($concat, empty) : null;
      var isArray = isConcatSpreadable ? (
        /** @type {(value: unknown) => value is unknown[]} */
        require_isarray()
      ) : null;
      module.exports = isConcatSpreadable ? function safeArrayConcat(item) {
        for (var i = 0; i < arguments.length; i += 1) {
          var arg = arguments[i];
          if (arg && typeof arg === "object" && typeof arg[isConcatSpreadable] === "boolean") {
            if (!empty[isConcatSpreadable]) {
              empty[isConcatSpreadable] = true;
            }
            var arr = isArray(arg) ? $slice(arg) : [arg];
            arr[isConcatSpreadable] = true;
            arguments[i] = arr;
          }
        }
        return $concatApply(arguments);
      } : callBind($concat, empty);
    }
  });

  // node_modules/es-iterator-helpers/aos/CreateIteratorFromClosure.js
  var require_CreateIteratorFromClosure = __commonJS({
    "node_modules/es-iterator-helpers/aos/CreateIteratorFromClosure.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var GeneratorStart = require_GeneratorStart();
      var IsArray = require_IsArray2();
      var IsCallable = require_IsCallable();
      var OrdinaryObjectCreate = require_OrdinaryObjectCreate();
      var every = require_every();
      var SLOT = require_internal_slot();
      var safeConcat = require_safe_array_concat();
      var isString = function isString2(slot) {
        return typeof slot === "string";
      };
      module.exports = function CreateIteratorFromClosure(closure, generatorBrand, proto) {
        if (!IsCallable(closure)) {
          throw new $TypeError("`closure` must be a function");
        }
        if (typeof generatorBrand !== "string") {
          throw new $TypeError("`generatorBrand` must be a string");
        }
        var extraSlots = arguments.length > 3 ? arguments[3] : [];
        if (arguments.length > 3) {
          if (!IsArray(extraSlots) || !every(extraSlots, isString)) {
            throw new $TypeError("`extraSlots` must be a List of String internal slot names");
          }
        }
        var internalSlotsList = safeConcat(extraSlots, ["[[GeneratorContext]]", "[[GeneratorBrand]]", "[[GeneratorState]]"]);
        var generator = OrdinaryObjectCreate(proto, internalSlotsList);
        SLOT.set(generator, "[[GeneratorBrand]]", generatorBrand);
        SLOT.assert(closure, "[[Sentinel]]");
        SLOT.set(generator, "[[Sentinel]]", SLOT.get(closure, "[[Sentinel]]"));
        SLOT.assert(closure, "[[CloseIfAbrupt]]");
        SLOT.set(generator, "[[CloseIfAbrupt]]", SLOT.get(closure, "[[CloseIfAbrupt]]"));
        GeneratorStart(generator, closure);
        return generator;
      };
    }
  });

  // node_modules/es-abstract/helpers/isLeadingSurrogate.js
  var require_isLeadingSurrogate = __commonJS({
    "node_modules/es-abstract/helpers/isLeadingSurrogate.js"(exports, module) {
      "use strict";
      module.exports = function isLeadingSurrogate(charCode) {
        return typeof charCode === "number" && charCode >= 55296 && charCode <= 56319;
      };
    }
  });

  // node_modules/es-abstract/helpers/isTrailingSurrogate.js
  var require_isTrailingSurrogate = __commonJS({
    "node_modules/es-abstract/helpers/isTrailingSurrogate.js"(exports, module) {
      "use strict";
      module.exports = function isTrailingSurrogate(charCode) {
        return typeof charCode === "number" && charCode >= 56320 && charCode <= 57343;
      };
    }
  });

  // node_modules/es-abstract/2024/UTF16SurrogatePairToCodePoint.js
  var require_UTF16SurrogatePairToCodePoint = __commonJS({
    "node_modules/es-abstract/2024/UTF16SurrogatePairToCodePoint.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $TypeError = require_type();
      var $fromCharCode = GetIntrinsic("%String.fromCharCode%");
      var isLeadingSurrogate = require_isLeadingSurrogate();
      var isTrailingSurrogate = require_isTrailingSurrogate();
      module.exports = function UTF16SurrogatePairToCodePoint(lead, trail) {
        if (!isLeadingSurrogate(lead) || !isTrailingSurrogate(trail)) {
          throw new $TypeError("Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code");
        }
        return $fromCharCode(lead) + $fromCharCode(trail);
      };
    }
  });

  // node_modules/es-abstract/2024/CodePointAt.js
  var require_CodePointAt = __commonJS({
    "node_modules/es-abstract/2024/CodePointAt.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var callBound = require_call_bound();
      var isLeadingSurrogate = require_isLeadingSurrogate();
      var isTrailingSurrogate = require_isTrailingSurrogate();
      var UTF16SurrogatePairToCodePoint = require_UTF16SurrogatePairToCodePoint();
      var $charAt = callBound("String.prototype.charAt");
      var $charCodeAt = callBound("String.prototype.charCodeAt");
      module.exports = function CodePointAt(string, position) {
        if (typeof string !== "string") {
          throw new $TypeError("Assertion failed: `string` must be a String");
        }
        var size = string.length;
        if (position < 0 || position >= size) {
          throw new $TypeError("Assertion failed: `position` must be >= 0, and < the length of `string`");
        }
        var first = $charCodeAt(string, position);
        var cp = $charAt(string, position);
        var firstIsLeading = isLeadingSurrogate(first);
        var firstIsTrailing = isTrailingSurrogate(first);
        if (!firstIsLeading && !firstIsTrailing) {
          return {
            "[[CodePoint]]": cp,
            "[[CodeUnitCount]]": 1,
            "[[IsUnpairedSurrogate]]": false
          };
        }
        if (firstIsTrailing || position + 1 === size) {
          return {
            "[[CodePoint]]": cp,
            "[[CodeUnitCount]]": 1,
            "[[IsUnpairedSurrogate]]": true
          };
        }
        var second = $charCodeAt(string, position + 1);
        if (!isTrailingSurrogate(second)) {
          return {
            "[[CodePoint]]": cp,
            "[[CodeUnitCount]]": 1,
            "[[IsUnpairedSurrogate]]": true
          };
        }
        return {
          "[[CodePoint]]": UTF16SurrogatePairToCodePoint(first, second),
          "[[CodeUnitCount]]": 2,
          "[[IsUnpairedSurrogate]]": false
        };
      };
    }
  });

  // node_modules/math-intrinsics/isFinite.js
  var require_isFinite = __commonJS({
    "node_modules/math-intrinsics/isFinite.js"(exports, module) {
      "use strict";
      var $isNaN = require_isNaN();
      module.exports = function isFinite2(x) {
        return (typeof x === "number" || typeof x === "bigint") && !$isNaN(x) && x !== Infinity && x !== -Infinity;
      };
    }
  });

  // node_modules/math-intrinsics/isInteger.js
  var require_isInteger = __commonJS({
    "node_modules/math-intrinsics/isInteger.js"(exports, module) {
      "use strict";
      var $abs = require_abs();
      var $floor = require_floor();
      var $isNaN = require_isNaN();
      var $isFinite = require_isFinite();
      module.exports = function isInteger(argument) {
        if (typeof argument !== "number" || $isNaN(argument) || !$isFinite(argument)) {
          return false;
        }
        var absValue = $abs(argument);
        return $floor(absValue) === absValue;
      };
    }
  });

  // node_modules/math-intrinsics/constants/maxSafeInteger.js
  var require_maxSafeInteger = __commonJS({
    "node_modules/math-intrinsics/constants/maxSafeInteger.js"(exports, module) {
      "use strict";
      module.exports = /** @type {import('./maxSafeInteger')} */
      Number.MAX_SAFE_INTEGER || 9007199254740991;
    }
  });

  // node_modules/es-abstract/2024/AdvanceStringIndex.js
  var require_AdvanceStringIndex = __commonJS({
    "node_modules/es-abstract/2024/AdvanceStringIndex.js"(exports, module) {
      "use strict";
      var CodePointAt = require_CodePointAt();
      var $TypeError = require_type();
      var isInteger = require_isInteger();
      var MAX_SAFE_INTEGER = require_maxSafeInteger();
      module.exports = function AdvanceStringIndex(S, index, unicode) {
        if (typeof S !== "string") {
          throw new $TypeError("Assertion failed: `S` must be a String");
        }
        if (!isInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
          throw new $TypeError("Assertion failed: `length` must be an integer >= 0 and <= 2**53");
        }
        if (typeof unicode !== "boolean") {
          throw new $TypeError("Assertion failed: `unicode` must be a Boolean");
        }
        if (!unicode) {
          return index + 1;
        }
        var length = S.length;
        if (index + 1 >= length) {
          return index + 1;
        }
        var cp = CodePointAt(S, index);
        return index + cp["[[CodeUnitCount]]"];
      };
    }
  });

  // node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "node_modules/has-tostringtag/shams.js"(exports, module) {
      "use strict";
      var hasSymbols = require_shams();
      module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      };
    }
  });

  // node_modules/is-string/index.js
  var require_is_string = __commonJS({
    "node_modules/is-string/index.js"(exports, module) {
      "use strict";
      var callBound = require_call_bound();
      var $strValueOf = callBound("String.prototype.valueOf");
      var tryStringObject = function tryStringObject2(value) {
        try {
          $strValueOf(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var $toString = callBound("Object.prototype.toString");
      var strClass = "[object String]";
      var hasToStringTag = require_shams2()();
      module.exports = function isString(value) {
        if (typeof value === "string") {
          return true;
        }
        if (!value || typeof value !== "object") {
          return false;
        }
        return hasToStringTag ? tryStringObject(value) : $toString(value) === strClass;
      };
    }
  });

  // node_modules/es-abstract/helpers/getIteratorMethod.js
  var require_getIteratorMethod = __commonJS({
    "node_modules/es-abstract/helpers/getIteratorMethod.js"(exports, module) {
      "use strict";
      var hasSymbols = require_has_symbols()();
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_call_bound();
      var isString = require_is_string();
      var $iterator = GetIntrinsic("%Symbol.iterator%", true);
      var $stringSlice = callBound("String.prototype.slice");
      var $String = GetIntrinsic("%String%");
      module.exports = function getIteratorMethod(ES, iterable) {
        var usingIterator;
        if (hasSymbols) {
          usingIterator = ES.GetMethod(iterable, $iterator);
        } else if (ES.IsArray(iterable)) {
          usingIterator = function() {
            var i = -1;
            var arr = this;
            return {
              next: function() {
                i += 1;
                return {
                  done: i >= arr.length,
                  value: arr[i]
                };
              }
            };
          };
        } else if (isString(iterable)) {
          usingIterator = function() {
            var i = 0;
            return {
              next: function() {
                var nextIndex = ES.AdvanceStringIndex($String(iterable), i, true);
                var value = $stringSlice(iterable, i, nextIndex);
                i = nextIndex;
                return {
                  done: nextIndex > iterable.length,
                  value
                };
              }
            };
          };
        }
        return usingIterator;
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/GetIteratorFlattenable.js
  var require_GetIteratorFlattenable = __commonJS({
    "node_modules/es-iterator-helpers/aos/GetIteratorFlattenable.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var AdvanceStringIndex = require_AdvanceStringIndex();
      var Call = require_Call();
      var GetIteratorDirect = require_GetIteratorDirect();
      var GetMethod = require_GetMethod();
      var IsArray = require_IsArray2();
      var Type = require_Type2();
      var getIteratorMethod = require_getIteratorMethod();
      module.exports = function GetIteratorFlattenable(obj, stringHandling) {
        if (stringHandling !== "REJECT-STRINGS" && stringHandling !== "ITERATE-STRINGS") {
          throw new $TypeError('Assertion failed: `stringHandling` must be "REJECT-STRINGS" or "ITERATE-STRINGS"');
        }
        if (Type(obj) !== "Object") {
          if (stringHandling === "REJECT-STRINGS" || typeof obj !== "string") {
            throw new $TypeError("obj must be an Object");
          }
        }
        var method = void 0;
        method = getIteratorMethod(
          {
            AdvanceStringIndex,
            GetMethod,
            IsArray
          },
          obj
        );
        var iterator;
        if (typeof method === "undefined") {
          iterator = obj;
        } else {
          iterator = Call(method, obj);
        }
        if (Type(iterator) !== "Object") {
          throw new $TypeError("iterator must be an Object");
        }
        return GetIteratorDirect(iterator);
      };
    }
  });

  // node_modules/es-set-tostringtag/index.js
  var require_es_set_tostringtag = __commonJS({
    "node_modules/es-set-tostringtag/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var hasToStringTag = require_shams2()();
      var hasOwn = require_hasown();
      var $TypeError = require_type();
      var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
      module.exports = function setToStringTag(object, value) {
        var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
        var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
        if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") {
          throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
        }
        if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
          if ($defineProperty) {
            $defineProperty(object, toStringTag, {
              configurable: !nonConfigurable,
              enumerable: false,
              value,
              writable: false
            });
          } else {
            object[toStringTag] = value;
          }
        }
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/GeneratorValidate.js
  var require_GeneratorValidate = __commonJS({
    "node_modules/es-iterator-helpers/aos/GeneratorValidate.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var SLOT = require_internal_slot();
      module.exports = function GeneratorValidate(generator, generatorBrand) {
        SLOT.assert(generator, "[[GeneratorState]]");
        SLOT.assert(generator, "[[GeneratorBrand]]");
        var brand = SLOT.get(generator, "[[GeneratorBrand]]");
        if (brand !== generatorBrand) {
          throw new $TypeError("Assertion failed: generator brand is unexpected: " + brand);
        }
        SLOT.assert(generator, "[[GeneratorContext]]");
        var state = SLOT.get(generator, "[[GeneratorState]]");
        if (state === "executing") {
          throw new $TypeError("generator is executing");
        }
        return state;
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/GeneratorResume.js
  var require_GeneratorResume = __commonJS({
    "node_modules/es-iterator-helpers/aos/GeneratorResume.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var CreateIterResultObject = require_CreateIterResultObject();
      var GeneratorValidate = require_GeneratorValidate();
      var SLOT = require_internal_slot();
      module.exports = function GeneratorResume(generator, value, generatorBrand) {
        var state = GeneratorValidate(generator, generatorBrand);
        if (state === "completed") {
          return CreateIterResultObject(void 0, true);
        }
        if (state !== "suspendedStart" && state !== "suspendedYield") {
          throw new $TypeError("Assertion failed: generator state is unexpected: " + state);
        }
        var genContext = SLOT.get(generator, "[[GeneratorContext]]");
        SLOT.set(generator, "[[GeneratorState]]", "executing");
        var result = genContext(value);
        return result;
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/GeneratorResumeAbrupt.js
  var require_GeneratorResumeAbrupt = __commonJS({
    "node_modules/es-iterator-helpers/aos/GeneratorResumeAbrupt.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var CompletionRecord = require_CompletionRecord();
      var CreateIterResultObject = require_CreateIterResultObject();
      var GeneratorValidate = require_GeneratorValidate();
      var NormalCompletion = require_NormalCompletion();
      var SLOT = require_internal_slot();
      module.exports = function GeneratorResumeAbrupt(generator, abruptCompletion, generatorBrand) {
        if (!(abruptCompletion instanceof CompletionRecord)) {
          throw new $TypeError("Assertion failed: abruptCompletion must be a Completion Record");
        }
        var state = GeneratorValidate(generator, generatorBrand);
        if (state === "suspendedStart") {
          SLOT.set(generator, "[[GeneratorState]]", "completed");
          SLOT.set(generator, "[[GeneratorContext]]", null);
          state = "completed";
        }
        var value = abruptCompletion.value();
        if (state === "completed") {
          return CreateIterResultObject(value, true);
        }
        if (state !== "suspendedYield") {
          throw new $TypeError("Assertion failed: generator state is unexpected: " + state);
        }
        if (abruptCompletion.type() === "return") {
          return CreateIterResultObject(SLOT.get(generator, "[[CloseIfAbrupt]]")(NormalCompletion(abruptCompletion.value())), true);
        }
        var genContext = SLOT.get(generator, "[[GeneratorContext]]");
        SLOT.set(generator, "[[GeneratorState]]", "executing");
        var result = genContext(value);
        return result;
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/IteratorCloseAll.js
  var require_IteratorCloseAll = __commonJS({
    "node_modules/es-iterator-helpers/aos/IteratorCloseAll.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var CompletionRecord = require_CompletionRecord();
      var IteratorClose = require_IteratorClose();
      var ThrowCompletion = require_ThrowCompletion();
      var IsArray = require_IsArray();
      var every = require_every();
      var isIteratorRecord = require_iterator_record();
      module.exports = function IteratorCloseAll(iters, completion) {
        if (!IsArray(iters) || !every(iters, isIteratorRecord)) {
          throw new $TypeError("Assertion failed: `iters` must be a List of IteratorRecords");
        }
        if (!(completion instanceof CompletionRecord)) {
          throw new $TypeError("Assertion failed: `completion` must be a Completion Record");
        }
        for (var i = iters.length - 1; i >= 0; i -= 1) {
          try {
            IteratorClose(iters[i], completion);
          } catch (e) {
            completion = ThrowCompletion(e);
          }
        }
        return completion["?"]();
      };
    }
  });

  // node_modules/es-iterator-helpers/aos/ReturnCompletion.js
  var require_ReturnCompletion = __commonJS({
    "node_modules/es-iterator-helpers/aos/ReturnCompletion.js"(exports, module) {
      "use strict";
      var CompletionRecord = require_CompletionRecord();
      module.exports = function ReturnCompletion(value) {
        return new CompletionRecord("return", value);
      };
    }
  });

  // node_modules/es-iterator-helpers/IteratorHelperPrototype/index.js
  var require_IteratorHelperPrototype = __commonJS({
    "node_modules/es-iterator-helpers/IteratorHelperPrototype/index.js"(exports, module) {
      "use strict";
      var setToStringTag = require_es_set_tostringtag();
      var hasProto = require_has_proto()();
      var iterProto = require_implementation4();
      var SLOT = require_internal_slot();
      var CreateIterResultObject = require_CreateIterResultObject();
      var GeneratorResume = require_GeneratorResume();
      var GeneratorResumeAbrupt = require_GeneratorResumeAbrupt();
      var IteratorCloseAll = require_IteratorCloseAll();
      var ReturnCompletion = require_ReturnCompletion();
      var implementation;
      var o = {
        // in an object, for name inference
        "return": function() {
          var O = this;
          SLOT.assert(O, "[[UnderlyingIterators]]");
          SLOT.assert(O, "[[GeneratorState]]");
          if (SLOT.get(O, "[[GeneratorState]]") === "suspendedStart") {
            SLOT.set(O, "[[GeneratorState]]", "completed");
            IteratorCloseAll(SLOT.get(O, "[[UnderlyingIterators]]"), ReturnCompletion(void 0));
            return CreateIterResultObject(void 0, true);
          }
          var C = ReturnCompletion(void 0);
          return GeneratorResumeAbrupt(O, C, "Iterator Helper");
        }
      };
      if (hasProto) {
        implementation = {
          __proto__: iterProto,
          next: function next() {
            return GeneratorResume(this, void 0, "Iterator Helper");
          },
          "return": o["return"]
        };
        setToStringTag(implementation, "Iterator Helper");
      } else {
        IteratorHelper = function IteratorHelper2() {
        };
        IteratorHelper.prototype = iterProto;
        implementation = new IteratorHelper();
        delete implementation.constructor;
        implementation.next = function next() {
          return GeneratorResume(this, void 0, "Iterator Helper");
        };
        implementation["return"] = o["return"];
      }
      var IteratorHelper;
      module.exports = implementation;
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.flatMap/implementation.js
  var require_implementation5 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.flatMap/implementation.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Call = require_Call();
      var CompletionRecord = require_CompletionRecord();
      var CreateIteratorFromClosure = require_CreateIteratorFromClosure();
      var GetIteratorDirect = require_GetIteratorDirect();
      var GetIteratorFlattenable = require_GetIteratorFlattenable();
      var IsCallable = require_IsCallable();
      var IteratorClose = require_IteratorClose();
      var IteratorStepValue = require_IteratorStepValue();
      var ThrowCompletion = require_ThrowCompletion();
      var Type = require_Type2();
      var iterHelperProto = require_IteratorHelperPrototype();
      var SLOT = require_internal_slot();
      module.exports = function flatMap(mapper) {
        if (this instanceof flatMap) {
          throw new $TypeError("`flatMap` is not a constructor");
        }
        var O = this;
        if (Type(O) !== "Object") {
          throw new $TypeError("`this` value must be an Object");
        }
        if (!IsCallable(mapper)) {
          throw new $TypeError("`mapper` must be a function");
        }
        var iterated = GetIteratorDirect(O);
        var sentinel = { sentinel: true };
        var innerIterator = sentinel;
        var closeIfAbrupt = function(abruptCompletion) {
          if (!(abruptCompletion instanceof CompletionRecord)) {
            throw new $TypeError("`abruptCompletion` must be a Completion Record");
          }
          try {
            if (innerIterator !== sentinel) {
              IteratorClose(
                innerIterator,
                abruptCompletion
              );
            }
          } finally {
            innerIterator = sentinel;
            IteratorClose(
              iterated,
              abruptCompletion
            );
          }
        };
        var counter = 0;
        var innerAlive = false;
        var closure = function() {
          if (innerIterator === sentinel) {
            var value = IteratorStepValue(iterated);
            if (iterated["[[Done]]"]) {
              innerAlive = false;
              innerIterator = sentinel;
              return sentinel;
            }
          }
          if (innerIterator === sentinel) {
            innerAlive = true;
            try {
              var mapped = Call(mapper, void 0, [value, counter]);
              innerIterator = GetIteratorFlattenable(mapped, "REJECT-STRINGS");
            } catch (e) {
              innerAlive = false;
              innerIterator = sentinel;
              closeIfAbrupt(ThrowCompletion(e));
            } finally {
              counter += 1;
            }
          }
          if (innerAlive) {
            var innerValue;
            try {
              innerValue = IteratorStepValue(innerIterator);
            } catch (e) {
              innerAlive = false;
              innerIterator = sentinel;
              closeIfAbrupt(ThrowCompletion(e));
            }
            if (innerIterator["[[Done]]"]) {
              innerAlive = false;
              innerIterator = sentinel;
              return closure();
            }
            return innerValue;
          }
          return sentinel;
        };
        SLOT.set(closure, "[[Sentinel]]", sentinel);
        SLOT.set(closure, "[[CloseIfAbrupt]]", closeIfAbrupt);
        var result = CreateIteratorFromClosure(closure, "Iterator Helper", iterHelperProto, ["[[UnderlyingIterators]]"]);
        SLOT.set(result, "[[UnderlyingIterators]]", [iterated]);
        return result;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.flatMap/polyfill.js
  var require_polyfill2 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.flatMap/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation5();
      module.exports = function getPolyfill() {
        if (typeof Iterator === "function" && typeof Iterator.prototype.flatMap === "function") {
          try {
            Iterator.prototype.flatMap.call({ next: null }, function() {
            }).next();
          } catch (e) {
            return Iterator.prototype.flatMap;
          }
        }
        return implementation;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.flatMap/shim.js
  var require_shim2 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.flatMap/shim.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var getPolyfill = require_polyfill2();
      var $IteratorPrototype = require_implementation4();
      module.exports = function shimIteratorPrototypeFlatMap() {
        var polyfill = getPolyfill();
        define(
          $IteratorPrototype,
          { flatMap: polyfill },
          { flatMap: function() {
            return $IteratorPrototype.flatMap !== polyfill;
          } }
        );
        return polyfill;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.map/implementation.js
  var require_implementation6 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.map/implementation.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Call = require_Call();
      var CompletionRecord = require_CompletionRecord();
      var CreateIteratorFromClosure = require_CreateIteratorFromClosure();
      var GetIteratorDirect = require_GetIteratorDirect();
      var IsCallable = require_IsCallable();
      var IteratorClose = require_IteratorClose();
      var IteratorStepValue = require_IteratorStepValue();
      var ThrowCompletion = require_ThrowCompletion();
      var Type = require_Type2();
      var iterHelperProto = require_IteratorHelperPrototype();
      var SLOT = require_internal_slot();
      module.exports = function map(mapper) {
        if (this instanceof map) {
          throw new $TypeError("`map` is not a constructor");
        }
        var O = this;
        if (Type(O) !== "Object") {
          throw new $TypeError("`this` value must be an Object");
        }
        if (!IsCallable(mapper)) {
          throw new $TypeError("`mapper` must be a function");
        }
        var iterated = GetIteratorDirect(O);
        var closeIfAbrupt = function(abruptCompletion) {
          if (!(abruptCompletion instanceof CompletionRecord)) {
            throw new $TypeError("`abruptCompletion` must be a Completion Record");
          }
          IteratorClose(
            iterated,
            abruptCompletion
          );
        };
        var sentinel = {};
        var counter = 0;
        var closure = function() {
          var value = IteratorStepValue(iterated);
          if (iterated["[[Done]]"]) {
            return sentinel;
          }
          var mapped;
          try {
            mapped = Call(mapper, void 0, [value, counter]);
            return mapped;
          } catch (e) {
            closeIfAbrupt(ThrowCompletion(e));
            throw e;
          } finally {
            counter += 1;
          }
        };
        SLOT.set(closure, "[[Sentinel]]", sentinel);
        SLOT.set(closure, "[[CloseIfAbrupt]]", closeIfAbrupt);
        var result = CreateIteratorFromClosure(closure, "Iterator Helper", iterHelperProto, ["[[UnderlyingIterators]]"]);
        SLOT.set(result, "[[UnderlyingIterators]]", [iterated]);
        return result;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.map/polyfill.js
  var require_polyfill3 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.map/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation6();
      module.exports = function getPolyfill() {
        if (typeof Iterator === "function" && typeof Iterator.prototype.map === "function") {
          try {
            Iterator.prototype.map.call({ next: null }, function() {
            }).next();
          } catch (e) {
            return Iterator.prototype.map;
          }
        }
        return implementation;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.map/shim.js
  var require_shim3 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.map/shim.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var getPolyfill = require_polyfill3();
      var $IteratorPrototype = require_implementation4();
      module.exports = function shimIteratorPrototypeMap() {
        var polyfill = getPolyfill();
        define(
          $IteratorPrototype,
          { map: polyfill },
          { map: function() {
            return $IteratorPrototype.map !== polyfill;
          } }
        );
        return polyfill;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.reduce/implementation.js
  var require_implementation7 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.reduce/implementation.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var Call = require_Call();
      var GetIteratorDirect = require_GetIteratorDirect();
      var IsCallable = require_IsCallable();
      var IteratorClose = require_IteratorClose();
      var IteratorStepValue = require_IteratorStepValue();
      var ThrowCompletion = require_ThrowCompletion();
      var Type = require_Type2();
      module.exports = function reduce(reducer) {
        if (this instanceof reduce) {
          throw new $TypeError("`reduce` is not a constructor");
        }
        var O = this;
        if (Type(O) !== "Object") {
          throw new $TypeError("`this` value must be an Object");
        }
        if (!IsCallable(reducer)) {
          throw new $TypeError("`reducer` must be a function");
        }
        var iterated = GetIteratorDirect(O);
        var accumulator;
        var counter;
        if (arguments.length < 2) {
          accumulator = IteratorStepValue(iterated);
          if (iterated["[[Done]]"]) {
            throw new $TypeError("Reduce of empty iterator with no initial value");
          }
          counter = 1;
        } else {
          accumulator = arguments[1];
          counter = 0;
        }
        while (true) {
          var value = IteratorStepValue(iterated);
          if (iterated["[[Done]]"]) {
            return accumulator;
          }
          try {
            var result = Call(reducer, void 0, [accumulator, value, counter]);
            accumulator = result;
          } catch (e) {
            IteratorClose(
              iterated,
              ThrowCompletion(e)
            );
          }
          counter += 1;
        }
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.reduce/polyfill.js
  var require_polyfill4 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.reduce/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation7();
      module.exports = function getPolyfill() {
        return typeof Iterator === "function" && typeof Iterator.prototype.reduce === "function" ? Iterator.prototype.reduce : implementation;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.reduce/shim.js
  var require_shim4 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.reduce/shim.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var getPolyfill = require_polyfill4();
      var $IteratorPrototype = require_implementation4();
      module.exports = function shimIteratorPrototypeReduce() {
        var polyfill = getPolyfill();
        define(
          $IteratorPrototype,
          { reduce: polyfill },
          { reduce: function() {
            return $IteratorPrototype.reduce !== polyfill;
          } }
        );
        return polyfill;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.toArray/implementation.js
  var require_implementation8 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.toArray/implementation.js"(exports, module) {
      "use strict";
      var $TypeError = require_type();
      var GetIteratorDirect = require_GetIteratorDirect();
      var IteratorStepValue = require_IteratorStepValue();
      var Type = require_Type2();
      module.exports = function toArray() {
        if (this instanceof toArray) {
          throw new $TypeError("`toArray` is not a constructor");
        }
        var O = this;
        if (Type(O) !== "Object") {
          throw new $TypeError("`this` value must be an Object");
        }
        var iterated = GetIteratorDirect(O);
        var items = [];
        while (true) {
          var value = IteratorStepValue(iterated);
          if (iterated["[[Done]]"]) {
            return items;
          }
          items[items.length] = value;
        }
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.toArray/polyfill.js
  var require_polyfill5 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.toArray/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation8();
      module.exports = function getPolyfill() {
        return typeof Iterator === "function" && typeof Iterator.prototype.toArray === "function" ? Iterator.prototype.toArray : implementation;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.toArray/shim.js
  var require_shim5 = __commonJS({
    "node_modules/es-iterator-helpers/Iterator.prototype.toArray/shim.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var getPolyfill = require_polyfill5();
      var $IteratorPrototype = require_implementation4();
      module.exports = function shimIteratorPrototypeToArray() {
        var polyfill = getPolyfill();
        define(
          $IteratorPrototype,
          { toArray: polyfill },
          { toArray: function() {
            return $IteratorPrototype.toArray !== polyfill;
          } }
        );
        return polyfill;
      };
    }
  });

  // node_modules/es-iterator-helpers/Iterator.prototype.find/auto.js
  require_shim()();

  // node_modules/es-iterator-helpers/Iterator.prototype.flatMap/auto.js
  require_shim2()();

  // node_modules/es-iterator-helpers/Iterator.prototype.map/auto.js
  require_shim3()();

  // node_modules/es-iterator-helpers/Iterator.prototype.reduce/auto.js
  require_shim4()();

  // node_modules/es-iterator-helpers/Iterator.prototype.toArray/auto.js
  require_shim5()();
})();
