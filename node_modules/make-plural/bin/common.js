"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardinals = exports.combined = void 0;
var combined = {
  plurals: ["function(n, ord) {\n  if (ord) return 'other';\n  return 'other';\n}", "function(n, ord) {\n  if (ord) return 'other';\n  return (n == 1) ? 'one' : 'other';\n}", "function(n, ord) {\n  if (ord) return 'other';\n  return ((n == 0\n          || n == 1)) ? 'one' : 'other';\n}", "function(n, ord) {\n  var s = String(n).split('.'), v0 = !s[1];\n  if (ord) return 'other';\n  return (n == 1 && v0) ? 'one' : 'other';\n}"],
  categories: ['{cardinal:["other"],ordinal:["other"]}', '{cardinal:["one","other"],ordinal:["other"]}', '{cardinal:["one","other"],ordinal:["one","other"]}', '{cardinal:["one","two","other"],ordinal:["other"]}']
};
exports.combined = combined;
var cardinals = {
  plurals: ["function(n) {\n  return 'other';\n}", "function(n) {\n  return (n == 1) ? 'one' : 'other';\n}", "function(n) {\n  return ((n == 0\n          || n == 1)) ? 'one' : 'other';\n}", "function(n) {\n  var s = String(n).split('.'), v0 = !s[1];\n  return (n == 1 && v0) ? 'one' : 'other';\n}"],
  categories: ['{cardinal:["other"],ordinal:[]}', '{cardinal:["one","other"],ordinal:[]}', '{cardinal:["one","other"],ordinal:[]}', '{cardinal:["one","two","other"],ordinal:[]}']
};
exports.cardinals = cardinals;

