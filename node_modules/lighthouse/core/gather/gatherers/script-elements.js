/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import BaseGatherer from '../base-gatherer.js';
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
class ScriptElements extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol},
  };

  /**
   * @param {LH.Gatherer.Context} context
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
      .filter(record => record.sessionTargetType === 'page');

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
   * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    return this._getArtifact(context, networkRecords);
  }
}

export default ScriptElements;
