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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// does not check for duplicate subtags
var isStructurallyValidLanguageTag = function isStructurallyValidLanguageTag(locale) {
  return locale.split('-').every(function (subtag) {
    return /[a-z0-9]+/i.test(subtag);
  });
};

var canonicalizeLocaleList = function canonicalizeLocaleList(locales) {
  if (!locales) return [];
  if (!Array.isArray(locales)) locales = [locales];
  var res = {};

  for (var i = 0; i < locales.length; ++i) {
    var tag = locales[i];
    if (tag && _typeof(tag) === 'object') tag = String(tag);

    if (typeof tag !== 'string') {
      // Requiring tag to be a String or Object means that the Number value
      // NaN will not be interpreted as the language tag "nan", which stands
      // for Min Nan Chinese.
      var msg = "Locales should be strings, ".concat(JSON.stringify(tag), " isn't.");
      throw new TypeError(msg);
    }

    if (tag[0] === '*') continue;

    if (!isStructurallyValidLanguageTag(tag)) {
      var strTag = JSON.stringify(tag);

      var _msg = "The locale ".concat(strTag, " is not a structurally valid BCP 47 language tag.");

      throw new RangeError(_msg);
    }

    res[tag] = true;
  }

  return Object.keys(res);
};

var defaultLocale = function defaultLocale() {
  return (
    /* istanbul ignore next */
    typeof navigator !== 'undefined' && navigator && (navigator.userLanguage || navigator.language) || 'en-US'
  );
};

var getType = function getType(type) {
  if (!type) return 'cardinal';
  if (type === 'cardinal' || type === 'ordinal') return type;
  throw new RangeError('Not a valid plural type: ' + JSON.stringify(type));
};

function getPluralRules(NumberFormat, getSelector, getCategories) {
  var findLocale = function findLocale(locale) {
    do {
      if (getSelector(locale)) return locale;
      locale = locale.replace(/-?[^-]*$/, '');
    } while (locale);

    return null;
  };

  var resolveLocale = function resolveLocale(locales) {
    var canonicalLocales = canonicalizeLocaleList(locales);

    for (var i = 0; i < canonicalLocales.length; ++i) {
      var lc = findLocale(canonicalLocales[i]);
      if (lc) return lc;
    }

    return findLocale(defaultLocale());
  };

  var PluralRules = /*#__PURE__*/function () {
    _createClass(PluralRules, null, [{
      key: "supportedLocalesOf",
      value: function supportedLocalesOf(locales) {
        return canonicalizeLocaleList(locales).filter(findLocale);
      }
    }]);

    function PluralRules(locales) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, PluralRules);

      this._locale = resolveLocale(locales);
      this._select = getSelector(this._locale);
      this._type = getType(opt.type);
      this._nf = new NumberFormat('en', opt); // make-plural expects latin digits with . decimal separator
    }

    _createClass(PluralRules, [{
      key: "resolvedOptions",
      value: function resolvedOptions() {
        var _this$_nf$resolvedOpt = this._nf.resolvedOptions(),
            minimumIntegerDigits = _this$_nf$resolvedOpt.minimumIntegerDigits,
            minimumFractionDigits = _this$_nf$resolvedOpt.minimumFractionDigits,
            maximumFractionDigits = _this$_nf$resolvedOpt.maximumFractionDigits,
            minimumSignificantDigits = _this$_nf$resolvedOpt.minimumSignificantDigits,
            maximumSignificantDigits = _this$_nf$resolvedOpt.maximumSignificantDigits;

        var opt = {
          locale: this._locale,
          minimumIntegerDigits: minimumIntegerDigits,
          minimumFractionDigits: minimumFractionDigits,
          maximumFractionDigits: maximumFractionDigits,
          pluralCategories: getCategories(this._locale, this._type === 'ordinal'),
          type: this._type
        };

        if (typeof minimumSignificantDigits === 'number') {
          opt.minimumSignificantDigits = minimumSignificantDigits;
          opt.maximumSignificantDigits = maximumSignificantDigits;
        }

        return opt;
      }
    }, {
      key: "select",
      value: function select(number) {
        if (!(this instanceof PluralRules)) throw new TypeError("select() called on incompatible ".concat(this));
        if (typeof number !== 'number') number = Number(number);
        if (!isFinite(number)) return 'other';

        var fmt = this._nf.format(Math.abs(number));

        return this._select(fmt, this._type === 'ordinal');
      }
    }]);

    return PluralRules;
  }();

  Object.defineProperty(PluralRules, 'prototype', {
    writable: false
  });
  return PluralRules;
}

export default getPluralRules;
