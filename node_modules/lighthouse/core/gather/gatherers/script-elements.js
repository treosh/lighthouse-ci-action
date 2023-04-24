/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import FRGatherer from '../base-gatherer.js';
import {NetworkRecords} from '../../computed/network-records.js';
import {NetworkRequest} from '../../lib/network-request.js';
import {pageFunctions} from '../../lib/page-functions.js';
import DevtoolsLog from './devtools-log.js';

/* global getNodeDetails */

/**
 * @return {LH.Artifacts['ScriptElements']}
 */
/* c8 ignore start */
function collectAllScriptElements() {
  /** @type {HTMLScriptElement[]} */
  // @ts-expect-error - getElementsInDocument put into scope via stringification
  const scripts = getElementsInDocument('script'); // eslint-disable-line no-undef

  return scripts.map(script => {
    return {
      type: script.type || null,
      src: script.src || null,
      id: script.id || null,
      async: script.async,
      defer: script.defer,
      source: script.closest('head') ? 'head' : 'body',
      // @ts-expect-error - getNodeDetails put into scope via stringification
      node: getNodeDetails(script),
    };
  });
}
/* c8 ignore stop */

/**
 * @fileoverview Gets JavaScript file contents.
 */
class ScriptElements extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol},
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @param {LH.Artifacts.NetworkRequest[]} networkRecords
   * @return {Promise<LH.Artifacts['ScriptElements']>}
   */
  async _getArtifact(context, networkRecords) {
    const executionContext = context.driver.executionContext;

    const scripts = await executionContext.evaluate(collectAllScriptElements, {
      args: [],
      useIsolation: true,
      deps: [
        pageFunctions.getNodeDetails,
        pageFunctions.getElementsInDocument,
      ],
    });

    const scriptRecords = networkRecords
      .filter(record => record.resourceType === NetworkRequest.TYPES.Script)
      // Ignore records from OOPIFs
      .filter(record => !record.sessionId);

    for (let i = 0; i < scriptRecords.length; i++) {
      const record = scriptRecords[i];

      const matchedScriptElement = scripts.find(script => script.src === record.url);
      if (!matchedScriptElement) {
        scripts.push({
          type: null,
          src: record.url,
          id: null,
          async: false,
          defer: false,
          source: 'network',
          node: null,
        });
      }
    }

    return scripts;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    return this._getArtifact(context, networkRecords);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   */
  async afterPass(passContext, loadData) {
    const networkRecords = loadData.networkRecords;
    return this._getArtifact({...passContext, dependencies: {}}, networkRecords);
  }
}

export default ScriptElements;
