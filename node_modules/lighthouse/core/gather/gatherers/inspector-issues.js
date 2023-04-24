/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Capture IssueAdded events
 */


import FRGatherer from '../base-gatherer.js';
import {NetworkRecords} from '../../computed/network-records.js';
import DevtoolsLog from './devtools-log.js';

class InspectorIssues extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol},
  };

  constructor() {
    super();
    /** @type {Array<LH.Crdp.Audits.InspectorIssue>} */
    this._issues = [];
    this._onIssueAdded = this.onIssueAdded.bind(this);
  }

  /**
   * @param {LH.Crdp.Audits.IssueAddedEvent} entry
   */
  onIssueAdded(entry) {
    this._issues.push(entry.issue);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async startInstrumentation(context) {
    const session = context.driver.defaultSession;
    session.on('Audits.issueAdded', this._onIssueAdded);
    await session.sendCommand('Audits.enable');
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async stopInstrumentation(context) {
    const session = context.driver.defaultSession;
    session.off('Audits.issueAdded', this._onIssueAdded);
    await session.sendCommand('Audits.disable');
  }

  /**
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Promise<LH.Artifacts['InspectorIssues']>}
   */
  async _getArtifact(networkRecords) {
    /** @type {LH.Artifacts.InspectorIssues} */
    const artifact = {
      attributionReportingIssue: [],
      blockedByResponseIssue: [],
      clientHintIssue: [],
      contentSecurityPolicyIssue: [],
      corsIssue: [],
      deprecationIssue: [],
      federatedAuthRequestIssue: [],
      genericIssue: [],
      heavyAdIssue: [],
      lowTextContrastIssue: [],
      mixedContentIssue: [],
      navigatorUserAgentIssue: [],
      quirksModeIssue: [],
      cookieIssue: [],
      sharedArrayBufferIssue: [],
      twaQualityEnforcement: [],
    };
    const keys = /** @type {Array<keyof LH.Artifacts['InspectorIssues']>} */(Object.keys(artifact));
    for (const key of keys) {
      /** @type {`${key}Details`} */
      const detailsKey = `${key}Details`;
      const allDetails = this._issues.map(issue => issue.details[detailsKey]);
      for (const detail of allDetails) {
        if (!detail) {
          continue;
        }
        // Duplicate issues can occur for the same request; only use the one with a matching networkRequest.
        const requestId = 'request' in detail && detail.request && detail.request.requestId;
        if (requestId) {
          if (networkRecords.find(req => req.requestId === requestId)) {
            // @ts-expect-error - detail types are not all compatible
            artifact[key].push(detail);
          }
        } else {
          // @ts-expect-error - detail types are not all compatible
          artifact[key].push(detail);
        }
      }
    }

    return artifact;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   * @return {Promise<LH.Artifacts['InspectorIssues']>}
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    return this._getArtifact(networkRecords);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['InspectorIssues']>}
   */
  async afterPass(passContext, loadData) {
    await this.stopInstrumentation({...passContext, dependencies: {}});
    return this._getArtifact(loadData.networkRecords);
  }
}

export default InspectorIssues;
