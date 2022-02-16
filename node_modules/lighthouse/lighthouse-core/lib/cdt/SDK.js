/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
const SDK = {
  TextSourceMap: require('./generated/SourceMap.js'),
};

// Add `lastColumnNumber` to mappings. This will eventually be added to CDT.
// @ts-expect-error
SDK.TextSourceMap.prototype.computeLastGeneratedColumns = function() {
  const mappings = this.mappings();
  if (mappings.length && mappings[0].lastColumnNumber !== undefined) return;

  for (let i = 0; i < mappings.length - 1; i++) {
    const mapping = mappings[i];
    const nextMapping = mappings[i + 1];
    if (mapping.lineNumber === nextMapping.lineNumber) {
      mapping.lastColumnNumber = nextMapping.columnNumber;
    }
  }

  // Now, all but the last mapping on each line will have 'lastColumnNumber' set to a number.
};

module.exports = SDK;
