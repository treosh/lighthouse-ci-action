'use strict';

var PluralRules = require('./plural-rules');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PluralRules__default = /*#__PURE__*/_interopDefaultLegacy(PluralRules);

if (typeof Intl === 'undefined') {
  if (typeof global !== 'undefined') {
    global.Intl = {
      PluralRules: PluralRules__default['default']
    };
  } else if (typeof window !== 'undefined') {
    window.Intl = {
      PluralRules: PluralRules__default['default']
    };
  } else {
    this.Intl = {
      PluralRules: PluralRules__default['default']
    };
  }

  PluralRules__default['default'].polyfill = true;
} else if (!Intl.PluralRules) {
  Intl.PluralRules = PluralRules__default['default'];
  PluralRules__default['default'].polyfill = true;
} else {
  var test = ['en', 'es', 'ru', 'zh'];
  var supported = Intl.PluralRules.supportedLocalesOf(test);

  if (supported.length < test.length) {
    Intl.PluralRules = PluralRules__default['default'];
    PluralRules__default['default'].polyfill = true;
  }
}
