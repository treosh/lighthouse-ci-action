/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @type {import('./index.js')['default']} */
const lighthouse = async function lighthouse(...args) {
  const {default: lighthouse} = await import('./index.js');
  return lighthouse(...args);
};

/** @type {import('./index.js')['legacyNavigation']} */
const legacyNavigation = async function legacyNavigation(...args) {
  const {legacyNavigation} = await import('./index.js');
  return legacyNavigation(...args);
};

module.exports = lighthouse;
module.exports.legacyNavigation = legacyNavigation;
