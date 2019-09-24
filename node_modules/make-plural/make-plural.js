(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MakePlural = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * make-plural -- https://github.com/eemeli/make-plural
 * Copyright (c) 2014-2016 by Eemeli Aro <eemeli@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * The software is provided "as is" and the author disclaims all warranties
 * with regard to this software including all implied warranties of
 * merchantability and fitness. In no event shall the author be liable for
 * any special, direct, indirect, or consequential damages or any damages
 * whatsoever resulting from loss of use, data or profits, whether in an
 * action of contract, negligence or other tortious action, arising out of
 * or in connection with the use or performance of this software.
 */
var Parser =
/*#__PURE__*/
function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(cond) {
      var _this = this;

      if (cond === 'i = 0 or n = 1') return 'n >= 0 && n <= 1';
      if (cond === 'i = 0,1') return 'n >= 0 && n < 2';

      if (cond === 'i = 1 and v = 0') {
        this.v0 = 1;
        return 'n == 1 && v0';
      }

      return cond.replace(/([tv]) (!?)= 0/g, function (m, sym, noteq) {
        var sn = sym + '0';
        _this[sn] = 1;
        return noteq ? '!' + sn : sn;
      }).replace(/\b[fintv]\b/g, function (m) {
        _this[m] = 1;
        return m;
      }).replace(/([fin]) % (10+)/g, function (m, sym, num) {
        var sn = sym + num;
        _this[sn] = 1;
        return sn;
      }).replace(/n10+ = 0/g, 't0 && $&').replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, function (m, se, noteq, x) {
        if (m === 'n = 0,1') return '(n == 0 || n == 1)';
        if (noteq) return se + x.split(',').join(' && ' + se);
        return '(' + se + x.split(',').join(' || ' + se) + ')';
      }).replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, function (m, sym, noteq, x0, x1) {
        if (Number(x0) + 1 === Number(x1)) {
          if (noteq) return "".concat(sym, " != ").concat(x0, " && ").concat(sym, " != ").concat(x1);
          return "(".concat(sym, " == ").concat(x0, " || ").concat(sym, " == ").concat(x1, ")");
        }

        if (noteq) return "(".concat(sym, " < ").concat(x0, " || ").concat(sym, " > ").concat(x1, ")");

        if (sym === 'n') {
          _this.t0 = 1;
          return "(t0 && n >= ".concat(x0, " && n <= ").concat(x1, ")");
        }

        return "(".concat(sym, " >= ").concat(x0, " && ").concat(sym, " <= ").concat(x1, ")");
      }).replace(/ and /g, ' && ').replace(/ or /g, ' || ').replace(/ = /g, ' == ');
    }
  }, {
    key: "vars",
    value: function vars() {
      var vars = [];
      if (this.i) vars.push('i = s[0]');
      if (this.f || this.v) vars.push("f = s[1] || ''");
      if (this.t) vars.push("t = (s[1] || '').replace(/0+$/, '')");
      if (this.v) vars.push('v = f.length');
      if (this.v0) vars.push('v0 = !s[1]');
      if (this.t0 || this.n10 || this.n100) vars.push('t0 = Number(s[0]) == n');

      for (var k in this) {
        if (/^.10+$/.test(k)) {
          var k0 = k[0] === 'n' ? 't0 && s[0]' : k[0];
          vars.push("".concat(k, " = ").concat(k0, ".slice(-").concat(k.substr(2).length, ")"));
        }
      }

      if (!vars.length) return '';
      return 'var ' + ["s = String(n).split('.')"].concat(vars).join(', ');
    }
  }]);

  return Parser;
}();

var Tests =
/*#__PURE__*/
function () {
  function Tests(obj) {
    _classCallCheck(this, Tests);

    this.obj = obj;
    this.ordinal = {};
    this.cardinal = {};
  }

  _createClass(Tests, [{
    key: "add",
    value: function add(type, cat, src) {
      this[type][cat] = {
        src: src,
        values: null
      };
    }
  }, {
    key: "testCond",
    value: function testCond(n, type, expResult, fn) {
      try {
        var r = (fn || this.obj.fn)(n, type === 'ordinal');
      } catch (e) {
        r = e.toString();
      }

      if (r !== expResult) {
        throw new Error('Locale ' + JSON.stringify(this.obj.lc) + type + ' rule self-test failed for v = ' + JSON.stringify(n) + ' (was ' + JSON.stringify(r) + ', expected ' + JSON.stringify(expResult) + ')');
      }

      return true;
    }
  }, {
    key: "testCat",
    value: function testCat(type, cat, fn) {
      var _this2 = this;

      var data = this[type][cat];

      if (!data.values) {
        data.values = data.src.join(' ').replace(/^[ ,]+|[ ,…]+$/g, '').replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2').split(/[ ,~…]+/);
      }

      data.values.forEach(function (n) {
        _this2.testCond(n, type, cat, fn);

        if (!/\.0+$/.test(n)) _this2.testCond(Number(n), type, cat, fn);
      });
      return true;
    }
  }, {
    key: "testAll",
    value: function testAll() {
      for (var cat in this.cardinal) {
        this.testCat('cardinal', cat);
      }

      for (var _cat in this.ordinal) {
        this.testCat('ordinal', _cat);
      }

      return true;
    }
  }]);

  return Tests;
}();

var MakePlural =
/*#__PURE__*/
function () {
  function MakePlural(lc) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MakePlural,
        cardinals = _ref.cardinals,
        ordinals = _ref.ordinals;

    _classCallCheck(this, MakePlural);

    if (!cardinals && !ordinals) throw new Error('At least one type of plural is required');
    this.lc = lc;
    this.categories = {
      cardinal: [],
      ordinal: []
    };
    this.parser = new Parser();
    this.tests = new Tests(this);
    this.fn = this.buildFunction(cardinals, ordinals);
    this.fn._obj = this;
    this.fn.categories = this.categories;

    this.fn.test = function () {
      return this.tests.testAll() && this.fn;
    }.bind(this);

    this.fn.toString = this.fnToString.bind(this);
    return this.fn;
  }

  _createClass(MakePlural, [{
    key: "compile",
    value: function compile(type, req) {
      var cases = [];
      var rules = MakePlural.getRules(type, this.lc);

      if (!rules) {
        if (req) throw new Error("Locale \"".concat(this.lc, "\" ").concat(type, " rules not found"));
        this.categories[type] = ['other'];
        return "'other'";
      }

      for (var r in rules) {
        var _rules$r$trim$split = rules[r].trim().split(/\s*@\w*/),
            _rules$r$trim$split2 = _toArray(_rules$r$trim$split),
            cond = _rules$r$trim$split2[0],
            examples = _rules$r$trim$split2.slice(1);

        var cat = r.replace('pluralRule-count-', '');
        if (cond) cases.push([this.parser.parse(cond), cat]);
        this.tests.add(type, cat, examples);
      }

      this.categories[type] = cases.map(function (c) {
        return c[1];
      }).concat('other');

      if (cases.length === 1) {
        return "(".concat(cases[0][0], ") ? '").concat(cases[0][1], "' : 'other'");
      } else {
        return _toConsumableArray(cases.map(function (c) {
          return "(".concat(c[0], ") ? '").concat(c[1], "'");
        })).concat(["'other'"]).join('\n      : ');
      }
    }
  }, {
    key: "buildFunction",
    value: function buildFunction(cardinals, ordinals) {
      var _this3 = this;

      var compile = function compile(c) {
        return c ? (c[1] ? 'return ' : 'if (ord) return ') + _this3.compile.apply(_this3, _toConsumableArray(c)) : '';
      };

      var fold = {
        vars: function vars(str) {
          return "  ".concat(str, ";").replace(/(.{1,78})(,|$) ?/g, '$1$2\n      ');
        },
        cond: function cond(str) {
          return "  ".concat(str, ";").replace(/(.{1,78}) (\|\| |$) ?/gm, '$1\n          $2');
        }
      };
      var cond = [ordinals && ['ordinal', !cardinals], cardinals && ['cardinal', true]].map(compile).map(fold.cond);
      var body = [fold.vars(this.parser.vars())].concat(_toConsumableArray(cond)).filter(function (line) {
        return !/^[\s;]*$/.test(line);
      }).map(function (line) {
        return line.replace(/\s+$/gm, '');
      }).join('\n');
      var args = ordinals && cardinals ? 'n, ord' : 'n';
      return new Function(args, body); // eslint-disable-line no-new-func
    }
  }, {
    key: "fnToString",
    value: function fnToString(name) {
      return Function.prototype.toString.call(this.fn).replace(/^function( \w+)?/, name ? 'function ' + name : 'function').replace(/\n\/\*(``)?\*\//, '');
    }
  }], [{
    key: "load",
    value: function load() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.forEach(function (cldr) {
        var data = cldr && cldr.supplemental || null;
        if (!data) throw new Error('Data does not appear to be CLDR data');
        MakePlural.rules = {
          cardinal: data['plurals-type-cardinal'] || MakePlural.rules.cardinal,
          ordinal: data['plurals-type-ordinal'] || MakePlural.rules.ordinal
        };
      });
      return MakePlural;
    }
  }, {
    key: "getRules",
    value: function getRules(type, locale) {
      if (locale.length) {
        var cat = MakePlural.rules[type];
        if (locale in cat) return cat[locale];
        var lc0 = locale.toLowerCase();

        for (var lc in cat) {
          if (lc.toLowerCase() === lc0) return cat[lc];
        }
      }

      return null;
    }
  }]);

  return MakePlural;
}();

exports.default = MakePlural;
MakePlural.cardinals = true;
MakePlural.ordinals = false;
MakePlural.rules = {
  cardinal: {},
  ordinal: {}
};
module.exports = exports.default;

},{}]},{},[1])(1)
});
