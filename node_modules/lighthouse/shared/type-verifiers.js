/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview A collection of general type verification functions for dealing
 * with external data. If these grow in scope they could be auto-generated with
 * something like `io-ts`, but it's not worth the complexity yet.
 */

/**
 * Type predicate verifying `val` is an object (excluding `Array` and `null`).
 * @param {unknown} val
 * @return {val is Record<string, unknown>}
 */
function isObjectOfUnknownValues(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Type predicate verifying `val` is an object or an array.
 * @param {unknown} val
 * @return {val is Record<string, unknown>|Array<unknown>}
 */
function isObjectOrArrayOfUnknownValues(val) {
  return typeof val === 'object' && val !== null;
}

module.exports = {
  isObjectOfUnknownValues,
  isObjectOrArrayOfUnknownValues,
};
