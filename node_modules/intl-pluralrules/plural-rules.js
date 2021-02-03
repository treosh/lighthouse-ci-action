'use strict';

var getPluralRules = require('./factory');
var PseudoNumberFormat = require('./pseudo-number-format');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var getPluralRules__default = /*#__PURE__*/_interopDefaultLegacy(getPluralRules);
var PseudoNumberFormat__default = /*#__PURE__*/_interopDefaultLegacy(PseudoNumberFormat);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var plurals = createCommonjsModule(function (module, exports) {
function a(n, ord) {
  if (ord) return 'other';
  return n == 1 ? 'one' : 'other';
}
function b(n, ord) {
  if (ord) return 'other';
  return (n == 0 || n == 1) ? 'one' : 'other';
}
function c(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return n == 1 && v0 ? 'one' : 'other';
}
function d(n, ord) {
  return 'other';
}
function e(n, ord) {
  if (ord) return 'other';
  return n == 1 ? 'one'
    : n == 2 ? 'two'
    : 'other';
}

(function (root, plurals) {
  Object.defineProperty(plurals, '__esModule', { value: true });
  {
    module.exports = plurals;
  }
}(commonjsGlobal, {
_in: d,

af: a,

ak: b,

am: function am(n, ord) {
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

an: a,

ar: function ar(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n100 >= 3 && n100 <= 10) ? 'few'
    : (n100 >= 11 && n100 <= 99) ? 'many'
    : 'other';
},

ars: function ars(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n100 >= 3 && n100 <= 10) ? 'few'
    : (n100 >= 11 && n100 <= 99) ? 'many'
    : 'other';
},

as: function as(n, ord) {
  if (ord) return (n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

asa: a,

ast: c,

az: function az(n, ord) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2), i1000 = i.slice(-3);
  if (ord) return (i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8) || (i100 == 20 || i100 == 50 || i100 == 70 || i100 == 80) ? 'one'
    : (i10 == 3 || i10 == 4) || (i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700 || i1000 == 800 || i1000 == 900) ? 'few'
    : i == 0 || i10 == 6 || (i100 == 40 || i100 == 60 || i100 == 90) ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
},

be: function be(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 2 || n10 == 3) && n100 != 12 && n100 != 13 ? 'few' : 'other';
  return n10 == 1 && n100 != 11 ? 'one'
    : (n10 >= 2 && n10 <= 4) && (n100 < 12 || n100 > 14) ? 'few'
    : t0 && n10 == 0 || (n10 >= 5 && n10 <= 9) || (n100 >= 11 && n100 <= 14) ? 'many'
    : 'other';
},

bem: a,

bez: a,

bg: a,

bho: b,

bm: d,

bn: function bn(n, ord) {
  if (ord) return (n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

bo: d,

br: function br(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), n1000000 = t0 && s[0].slice(-6);
  if (ord) return 'other';
  return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? 'one'
    : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? 'two'
    : ((n10 == 3 || n10 == 4) || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? 'few'
    : n != 0 && t0 && n1000000 == 0 ? 'many'
    : 'other';
},

brx: a,

bs: function bs(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
},

ca: function ca(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return (n == 1 || n == 3) ? 'one'
    : n == 2 ? 'two'
    : n == 4 ? 'few'
    : 'other';
  return n == 1 && v0 ? 'one' : 'other';
},

ce: a,

ceb: function ceb(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return 'other';
  return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
},

cgg: a,

chr: a,

ckb: a,

cs: function cs(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : (i >= 2 && i <= 4) && v0 ? 'few'
    : !v0 ? 'many'
    : 'other';
},

cy: function cy(n, ord) {
  if (ord) return (n == 0 || n == 7 || n == 8 || n == 9) ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n == 3 || n == 4) ? 'few'
    : (n == 5 || n == 6) ? 'many'
    : 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : n == 3 ? 'few'
    : n == 6 ? 'many'
    : 'other';
},

da: function da(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return n == 1 || !t0 && (i == 0 || i == 1) ? 'one' : 'other';
},

de: c,

dsb: function dsb(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i100 == 1 || f100 == 1 ? 'one'
    : v0 && i100 == 2 || f100 == 2 ? 'two'
    : v0 && (i100 == 3 || i100 == 4) || (f100 == 3 || f100 == 4) ? 'few'
    : 'other';
},

dv: a,

dz: d,

ee: a,

el: a,

en: function en(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return n10 == 1 && n100 != 11 ? 'one'
    : n10 == 2 && n100 != 12 ? 'two'
    : n10 == 3 && n100 != 13 ? 'few'
    : 'other';
  return n == 1 && v0 ? 'one' : 'other';
},

eo: a,

es: a,

et: c,

eu: a,

fa: function fa(n, ord) {
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

ff: function ff(n, ord) {
  if (ord) return 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
},

fi: c,

fil: function fil(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return n == 1 ? 'one' : 'other';
  return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
},

fo: a,

fr: function fr(n, ord) {
  if (ord) return n == 1 ? 'one' : 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
},

fur: a,

fy: c,

ga: function ga(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return n == 1 ? 'one' : 'other';
  return n == 1 ? 'one'
    : n == 2 ? 'two'
    : (t0 && n >= 3 && n <= 6) ? 'few'
    : (t0 && n >= 7 && n <= 10) ? 'many'
    : 'other';
},

gd: function gd(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1 || n == 11) ? 'one'
    : (n == 2 || n == 12) ? 'two'
    : (n == 3 || n == 13) ? 'few'
    : 'other';
  return (n == 1 || n == 11) ? 'one'
    : (n == 2 || n == 12) ? 'two'
    : ((t0 && n >= 3 && n <= 10) || (t0 && n >= 13 && n <= 19)) ? 'few'
    : 'other';
},

gl: c,

gsw: a,

gu: function gu(n, ord) {
  if (ord) return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

guw: b,

gv: function gv(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 ? 'one'
    : v0 && i10 == 2 ? 'two'
    : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? 'few'
    : !v0 ? 'many'
    : 'other';
},

ha: a,

haw: a,

he: function he(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : i == 2 && v0 ? 'two'
    : v0 && (n < 0 || n > 10) && t0 && n10 == 0 ? 'many'
    : 'other';
},

hi: function hi(n, ord) {
  if (ord) return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

hr: function hr(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
},

hsb: function hsb(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i100 == 1 || f100 == 1 ? 'one'
    : v0 && i100 == 2 || f100 == 2 ? 'two'
    : v0 && (i100 == 3 || i100 == 4) || (f100 == 3 || f100 == 4) ? 'few'
    : 'other';
},

hu: function hu(n, ord) {
  if (ord) return (n == 1 || n == 5) ? 'one' : 'other';
  return n == 1 ? 'one' : 'other';
},

hy: function hy(n, ord) {
  if (ord) return n == 1 ? 'one' : 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
},

ia: c,

id: d,

ig: d,

ii: d,

io: c,

is: function is(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n, i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return t0 && i10 == 1 && i100 != 11 || !t0 ? 'one' : 'other';
},

it: function it(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
},

iu: e,

iw: function iw(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : i == 2 && v0 ? 'two'
    : v0 && (n < 0 || n > 10) && t0 && n10 == 0 ? 'many'
    : 'other';
},

ja: d,

jbo: d,

jgo: a,

ji: c,

jmc: a,

jv: d,

jw: d,

ka: function ka(n, ord) {
  var s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  if (ord) return i == 1 ? 'one'
    : i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60 || i100 == 80) ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
},

kab: function kab(n, ord) {
  if (ord) return 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
},

kaj: a,

kcg: a,

kde: d,

kea: d,

kk: function kk(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return n10 == 6 || n10 == 9 || t0 && n10 == 0 && n != 0 ? 'many' : 'other';
  return n == 1 ? 'one' : 'other';
},

kkj: a,

kl: a,

km: d,

kn: function kn(n, ord) {
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
},

ko: d,

ks: a,

ksb: a,

ksh: function ksh(n, ord) {
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : 'other';
},

ku: a,

kw: function kw(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2), n1000 = t0 && s[0].slice(-3), n100000 = t0 && s[0].slice(-5), n1000000 = t0 && s[0].slice(-6);
  if (ord) return (t0 && n >= 1 && n <= 4) || ((n100 >= 1 && n100 <= 4) || (n100 >= 21 && n100 <= 24) || (n100 >= 41 && n100 <= 44) || (n100 >= 61 && n100 <= 64) || (n100 >= 81 && n100 <= 84)) ? 'one'
    : n == 5 || n100 == 5 ? 'many'
    : 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : (n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82) || t0 && n1000 == 0 && ((n100000 >= 1000 && n100000 <= 20000) || n100000 == 40000 || n100000 == 60000 || n100000 == 80000) || n != 0 && n1000000 == 100000 ? 'two'
    : (n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63 || n100 == 83) ? 'few'
    : n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61 || n100 == 81) ? 'many'
    : 'other';
},

ky: a,

lag: function lag(n, ord) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : (i == 0 || i == 1) && n != 0 ? 'one'
    : 'other';
},

lb: a,

lg: a,

lkt: d,

ln: b,

lo: function lo(n, ord) {
  if (ord) return n == 1 ? 'one' : 'other';
  return 'other';
},

lt: function lt(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n10 == 1 && (n100 < 11 || n100 > 19) ? 'one'
    : (n10 >= 2 && n10 <= 9) && (n100 < 11 || n100 > 19) ? 'few'
    : f != 0 ? 'many'
    : 'other';
},

lv: function lv(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', v = f.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return t0 && n10 == 0 || (n100 >= 11 && n100 <= 19) || v == 2 && (f100 >= 11 && f100 <= 19) ? 'zero'
    : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one'
    : 'other';
},

mas: a,

mg: b,

mgo: a,

mk: function mk(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return i10 == 1 && i100 != 11 ? 'one'
    : i10 == 2 && i100 != 12 ? 'two'
    : (i10 == 7 || i10 == 8) && i100 != 17 && i100 != 18 ? 'many'
    : 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : 'other';
},

ml: a,

mn: a,

mo: function mo(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return n == 1 ? 'one' : 'other';
  return n == 1 && v0 ? 'one'
    : !v0 || n == 0 || (n100 >= 2 && n100 <= 19) ? 'few'
    : 'other';
},

mr: function mr(n, ord) {
  if (ord) return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : 'other';
  return n == 1 ? 'one' : 'other';
},

ms: function ms(n, ord) {
  if (ord) return n == 1 ? 'one' : 'other';
  return 'other';
},

mt: function mt(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n == 1 ? 'one'
    : n == 0 || (n100 >= 2 && n100 <= 10) ? 'few'
    : (n100 >= 11 && n100 <= 19) ? 'many'
    : 'other';
},

my: d,

nah: a,

naq: e,

nb: a,

nd: a,

ne: function ne(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (t0 && n >= 1 && n <= 4) ? 'one' : 'other';
  return n == 1 ? 'one' : 'other';
},

nl: c,

nn: a,

nnh: a,

no: a,

nqo: d,

nr: a,

nso: b,

ny: a,

nyn: a,

om: a,

or: function or(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1 || n == 5 || (t0 && n >= 7 && n <= 9)) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
},

os: a,

osa: d,

pa: b,

pap: a,

pl: function pl(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) ? 'few'
    : v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && (i10 >= 5 && i10 <= 9) || v0 && (i100 >= 12 && i100 <= 14) ? 'many'
    : 'other';
},

prg: function prg(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', v = f.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return t0 && n10 == 0 || (n100 >= 11 && n100 <= 19) || v == 2 && (f100 >= 11 && f100 <= 19) ? 'zero'
    : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one'
    : 'other';
},

ps: a,

pt: function pt(n, ord) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return (i == 0 || i == 1) ? 'one' : 'other';
},

pt_PT: c,

rm: a,

ro: function ro(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return n == 1 ? 'one' : 'other';
  return n == 1 && v0 ? 'one'
    : !v0 || n == 0 || (n100 >= 2 && n100 <= 19) ? 'few'
    : 'other';
},

rof: a,

root: d,

ru: function ru(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) ? 'few'
    : v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9) || v0 && (i100 >= 11 && i100 <= 14) ? 'many'
    : 'other';
},

rwk: a,

sah: d,

saq: a,

sc: function sc(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
},

scn: function scn(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
},

sd: a,

sdh: a,

se: e,

seh: a,

ses: d,

sg: d,

sh: function sh(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
},

shi: function shi(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one'
    : (t0 && n >= 2 && n <= 10) ? 'few'
    : 'other';
},

si: function si(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '';
  if (ord) return 'other';
  return (n == 0 || n == 1) || i == 0 && f == 1 ? 'one' : 'other';
},

sk: function sk(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : (i >= 2 && i <= 4) && v0 ? 'few'
    : !v0 ? 'many'
    : 'other';
},

sl: function sl(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i100 = i.slice(-2);
  if (ord) return 'other';
  return v0 && i100 == 1 ? 'one'
    : v0 && i100 == 2 ? 'two'
    : v0 && (i100 == 3 || i100 == 4) || !v0 ? 'few'
    : 'other';
},

sma: e,

smi: e,

smj: e,

smn: e,

sms: e,

sn: a,

so: a,

sq: function sq(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return n == 1 ? 'one'
    : n10 == 4 && n100 != 14 ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
},

sr: function sr(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
},

ss: a,

ssy: a,

st: a,

su: d,

sv: function sv(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 || n10 == 2) && n100 != 11 && n100 != 12 ? 'one' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
},

sw: c,

syr: a,

ta: a,

te: a,

teo: a,

th: d,

ti: b,

tig: a,

tk: function tk(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return (n10 == 6 || n10 == 9) || n == 10 ? 'few' : 'other';
  return n == 1 ? 'one' : 'other';
},

tl: function tl(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return n == 1 ? 'one' : 'other';
  return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
},

tn: a,

to: d,

tr: a,

ts: a,

tzm: function tzm(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n == 0 || n == 1) || (t0 && n >= 11 && n <= 99) ? 'one' : 'other';
},

ug: a,

uk: function uk(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return n10 == 3 && n100 != 13 ? 'few' : 'other';
  return v0 && i10 == 1 && i100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) ? 'few'
    : v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9) || v0 && (i100 >= 11 && i100 <= 14) ? 'many'
    : 'other';
},

ur: c,

uz: a,

ve: a,

vi: function vi(n, ord) {
  if (ord) return n == 1 ? 'one' : 'other';
  return 'other';
},

vo: a,

vun: a,

wa: b,

wae: a,

wo: d,

xh: a,

xog: a,

yi: c,

yo: d,

yue: d,

zh: d,

zu: function zu(n, ord) {
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
}
}));
});

var plurals$1 = /*@__PURE__*/getDefaultExportFromCjs(plurals);

var P = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), plurals, {
  'default': plurals$1
}));

var pluralCategories = createCommonjsModule(function (module, exports) {
var z = "zero", o = "one", t = "two", f = "few", m = "many", x = "other";
var a = {cardinal:[o,x],ordinal:[x]};
var b = {cardinal:[x],ordinal:[x]};
var c = {cardinal:[o,f,m,x],ordinal:[x]};
var d = {cardinal:[o,x],ordinal:[o,x]};
var e = {cardinal:[o,t,x],ordinal:[x]};

(function (root, pluralCategories) {
  Object.defineProperty(pluralCategories, '__esModule', { value: true });
  {
    module.exports = pluralCategories;
  }
}(commonjsGlobal, {
_in: b,
af: a,
ak: a,
am: a,
an: a,
ar: {cardinal:[z,o,t,f,m,x],ordinal:[x]},
ars: {cardinal:[z,o,t,f,m,x],ordinal:[x]},
as: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
asa: a,
ast: a,
az: {cardinal:[o,x],ordinal:[o,f,m,x]},
be: {cardinal:[o,f,m,x],ordinal:[f,x]},
bem: a,
bez: a,
bg: a,
bho: a,
bm: b,
bn: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
bo: b,
br: {cardinal:[o,t,f,m,x],ordinal:[x]},
brx: a,
bs: {cardinal:[o,f,x],ordinal:[x]},
ca: {cardinal:[o,x],ordinal:[o,t,f,x]},
ce: a,
ceb: a,
cgg: a,
chr: a,
ckb: a,
cs: c,
cy: {cardinal:[z,o,t,f,m,x],ordinal:[z,o,t,f,m,x]},
da: a,
de: a,
dsb: {cardinal:[o,t,f,x],ordinal:[x]},
dv: a,
dz: b,
ee: a,
el: a,
en: {cardinal:[o,x],ordinal:[o,t,f,x]},
eo: a,
es: a,
et: a,
eu: a,
fa: a,
ff: a,
fi: a,
fil: d,
fo: a,
fr: d,
fur: a,
fy: a,
ga: {cardinal:[o,t,f,m,x],ordinal:[o,x]},
gd: {cardinal:[o,t,f,x],ordinal:[o,t,f,x]},
gl: a,
gsw: a,
gu: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
guw: a,
gv: {cardinal:[o,t,f,m,x],ordinal:[x]},
ha: a,
haw: a,
he: {cardinal:[o,t,m,x],ordinal:[x]},
hi: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
hr: {cardinal:[o,f,x],ordinal:[x]},
hsb: {cardinal:[o,t,f,x],ordinal:[x]},
hu: d,
hy: d,
ia: a,
id: b,
ig: b,
ii: b,
io: a,
is: a,
it: {cardinal:[o,x],ordinal:[m,x]},
iu: e,
iw: {cardinal:[o,t,m,x],ordinal:[x]},
ja: b,
jbo: b,
jgo: a,
ji: a,
jmc: a,
jv: b,
jw: b,
ka: {cardinal:[o,x],ordinal:[o,m,x]},
kab: a,
kaj: a,
kcg: a,
kde: b,
kea: b,
kk: {cardinal:[o,x],ordinal:[m,x]},
kkj: a,
kl: a,
km: b,
kn: a,
ko: b,
ks: a,
ksb: a,
ksh: {cardinal:[z,o,x],ordinal:[x]},
ku: a,
kw: {cardinal:[z,o,t,f,m,x],ordinal:[o,m,x]},
ky: a,
lag: {cardinal:[z,o,x],ordinal:[x]},
lb: a,
lg: a,
lkt: b,
ln: a,
lo: {cardinal:[x],ordinal:[o,x]},
lt: c,
lv: {cardinal:[z,o,x],ordinal:[x]},
mas: a,
mg: a,
mgo: a,
mk: {cardinal:[o,x],ordinal:[o,t,m,x]},
ml: a,
mn: a,
mo: {cardinal:[o,f,x],ordinal:[o,x]},
mr: {cardinal:[o,x],ordinal:[o,t,f,x]},
ms: {cardinal:[x],ordinal:[o,x]},
mt: c,
my: b,
nah: a,
naq: e,
nb: a,
nd: a,
ne: d,
nl: a,
nn: a,
nnh: a,
no: a,
nqo: b,
nr: a,
nso: a,
ny: a,
nyn: a,
om: a,
or: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
os: a,
osa: b,
pa: a,
pap: a,
pl: c,
prg: {cardinal:[z,o,x],ordinal:[x]},
ps: a,
pt: a,
pt_PT: a,
rm: a,
ro: {cardinal:[o,f,x],ordinal:[o,x]},
rof: a,
root: b,
ru: c,
rwk: a,
sah: b,
saq: a,
sc: {cardinal:[o,x],ordinal:[m,x]},
scn: {cardinal:[o,x],ordinal:[m,x]},
sd: a,
sdh: a,
se: e,
seh: a,
ses: b,
sg: b,
sh: {cardinal:[o,f,x],ordinal:[x]},
shi: {cardinal:[o,f,x],ordinal:[x]},
si: a,
sk: c,
sl: {cardinal:[o,t,f,x],ordinal:[x]},
sma: e,
smi: e,
smj: e,
smn: e,
sms: e,
sn: a,
so: a,
sq: {cardinal:[o,x],ordinal:[o,m,x]},
sr: {cardinal:[o,f,x],ordinal:[x]},
ss: a,
ssy: a,
st: a,
su: b,
sv: d,
sw: a,
syr: a,
ta: a,
te: a,
teo: a,
th: b,
ti: a,
tig: a,
tk: {cardinal:[o,x],ordinal:[f,x]},
tl: d,
tn: a,
to: b,
tr: a,
ts: a,
tzm: a,
ug: a,
uk: {cardinal:[o,f,m,x],ordinal:[f,x]},
ur: a,
uz: a,
ve: a,
vi: {cardinal:[x],ordinal:[o,x]},
vo: a,
vun: a,
wa: a,
wae: a,
wo: b,
xh: a,
xog: a,
yi: a,
yo: b,
yue: b,
zh: b,
zu: a
}));
});

var pluralCategories$1 = /*@__PURE__*/getDefaultExportFromCjs(pluralCategories);

var C = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), pluralCategories, {
  'default': pluralCategories$1
}));

// using them here because with this many small functions, bundlers produce less
// cruft than for ES module exports.

var Plurals = plurals$1 || P;
var Categories = pluralCategories$1 || C;
/* istanbul ignore next */

var NumberFormat = (typeof Intl === "undefined" ? "undefined" : _typeof(Intl)) === 'object' && Intl.NumberFormat || PseudoNumberFormat__default['default']; // make-plural exports are cast with safe-identifier to be valid JS identifiers

var id = function id(lc) {
  return lc === 'in' ? '_in' : lc === 'pt-PT' ? 'pt_PT' : lc;
};

var getSelector = function getSelector(lc) {
  return Plurals[id(lc)];
};

var getCategories = function getCategories(lc, ord) {
  return Categories[id(lc)][ord ? 'ordinal' : 'cardinal'];
};

var PluralRules = getPluralRules__default['default'](NumberFormat, getSelector, getCategories);

module.exports = PluralRules;
