/* jshint esversion: 6 */
/* jslint node: true */
'use strict';

module.exports = function (object) {
  return serialize(object);

  function serialize (object) {
    if (object === null || typeof object !== 'object' || object.toJSON != null) {
      return JSON.stringify(object);
    }
    if (Array.isArray(object) && object.length === 0) {
      return '[]';
    }
    if (Array.isArray(object) && object.length === 1) {
      return '[' + serialize(object[0]) + ']';
    }
    if (Array.isArray(object)) {
      return '[' + object.reduce((t, cv, ci) => {
        t = (ci === 1 ? serialize(t) : t);
        return t + ',' + serialize(cv);
      }) + ']';
    }
    const keys = Object.keys(object);
    if (keys.length === 0) {
      return '{}';
    }
    if (keys.length === 1) {
      return '{' + serialize(keys[0]) + ':' + serialize(object[keys[0]]) + '}';
    }
    return '{' + keys.sort().reduce((t, cv, ci) => {
      t = (ci === 1 ? serialize(t) + ':' + serialize(object[t]) : t);
      return t + ',' + serialize(cv) + ':' + serialize(object[cv]);
    }) + '}';
  }
};
