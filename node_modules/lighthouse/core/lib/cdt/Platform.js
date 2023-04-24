// @ts-nocheck
/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// Functions manually copied from:
// https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/core/platform/array-utilities.ts#L125

/**
 * @param {any[]} array
 * @param {any} needle
 * @param {any} comparator
 */
function lowerBound(array, needle, comparator, left, right) {
  let l = left || 0;
  let r = right !== undefined ? right : array.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (comparator(needle, array[m]) > 0) {
      l = m + 1;
    } else {
      r = m;
    }
  }
  return r;
}

/**
 * @param {any[]} array
 * @param {any} needle
 * @param {any} comparator
 */
function upperBound(array, needle, comparator, left, right) {
  let l = left || 0;
  let r = right !== undefined ? right : array.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (comparator(needle, array[m]) >= 0) {
      l = m + 1;
    } else {
      r = m;
    }
  }
  return r;
}

module.exports = {
  ArrayUtilities: {
    lowerBound,
    upperBound,
  },
  DevToolsPath: {
    EmptyUrlString: '',
  },
};
