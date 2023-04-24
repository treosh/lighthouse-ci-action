/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {createRequire} from 'module';
import url from 'url';
import path from 'path';

/**
 * Commonjs equivalent of `require.resolve`.
 * @param {string} packageName
 */
function resolveModulePath(packageName) {
  const require = createRequire(import.meta.url);
  return require.resolve(packageName);
}

/**
 * @param {ImportMeta} importMeta
 */
function getModulePath(importMeta) {
  return url.fileURLToPath(importMeta.url);
}

/**
 * @param {ImportMeta} importMeta
 */
function getModuleDirectory(importMeta) {
  return path.dirname(getModulePath(importMeta));
}

export {
  resolveModulePath,
  getModulePath,
  getModuleDirectory,
};
