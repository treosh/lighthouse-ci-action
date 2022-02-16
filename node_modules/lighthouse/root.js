/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

// import {dirname} from 'path';
// import {fileURLToPath} from 'url';

module.exports = {
  LH_ROOT: __dirname,
  /**
   * Return parsed json object.
   * Resolves path relative to importMeta.url (if provided) or LH_ROOT (if not provided).
   * @param {string} filePath Can be an absolute or relative path.
   * @param {ImportMeta=} importMeta
   */
  readJson(filePath, importMeta) {
    const dir = importMeta ? path.dirname(url.fileURLToPath(importMeta.url)) : __dirname;
    filePath = path.resolve(dir, filePath);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  },
};
