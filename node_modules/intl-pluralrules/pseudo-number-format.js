'use strict';

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

var PseudoNumberFormat = /*#__PURE__*/function () {
  function PseudoNumberFormat(lc, // locale is ignored; always use 'en'
  _ref) {
    var minID = _ref.minimumIntegerDigits,
        minFD = _ref.minimumFractionDigits,
        maxFD = _ref.maximumFractionDigits,
        minSD = _ref.minimumSignificantDigits,
        maxSD = _ref.maximumSignificantDigits;

    _classCallCheck(this, PseudoNumberFormat);

    this._minID = typeof minID === 'number' ? minID : 1;
    this._minFD = typeof minFD === 'number' ? minFD : 0;
    this._maxFD = typeof maxFD === 'number' ? maxFD : Math.max(this._minFD, 3);

    if (typeof minSD === 'number' || typeof maxSD === 'number') {
      this._minSD = typeof minSD === 'number' ? minSD : 1;
      this._maxSD = typeof maxSD === 'number' ? maxSD : 21;
    }
  }

  _createClass(PseudoNumberFormat, [{
    key: "resolvedOptions",
    value: function resolvedOptions() {
      var opt = {
        minimumIntegerDigits: this._minID,
        minimumFractionDigits: this._minFD,
        maximumFractionDigits: this._maxFD
      };

      if (typeof this._minSD === 'number') {
        opt.minimumSignificantDigits = this._minSD;
        opt.maximumSignificantDigits = this._maxSD;
      }

      return opt;
    }
  }, {
    key: "format",
    value: function format(n) {
      if (this._minSD) {
        var raw = String(n);
        var prec = 0;

        for (var i = 0; i < raw.length; ++i) {
          var c = raw[i];
          if (c >= '0' && c <= '9') ++prec;
        }

        if (prec < this._minSD) return n.toPrecision(this._minSD);
        if (prec > this._maxSD) return n.toPrecision(this._maxSD);
        return raw;
      }

      if (this._minFD > 0) return n.toFixed(this._minFD);
      if (this._maxFD === 0) return n.toFixed(0);
      return String(n);
    }
  }]);

  return PseudoNumberFormat;
}();

module.exports = PseudoNumberFormat;
