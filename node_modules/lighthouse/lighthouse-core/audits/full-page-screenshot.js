/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit.js');

class FullPageScreenshot extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'full-page-screenshot',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      title: 'Full-page screenshot',
      description: 'A full-height screenshot of the final rendered page',
      requiredArtifacts: ['FullPageScreenshot'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts) {
    if (!artifacts.FullPageScreenshot) {
      return {score: 0, notApplicable: true};
    }

    return {
      score: 1,
      details: {
        type: 'full-page-screenshot',
        ...artifacts.FullPageScreenshot,
      },
    };
  }
}

module.exports = FullPageScreenshot;
