/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Capture IssueAdded events
 */

'use strict';

const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');
const NetworkRecords = require('../../computed/network-records.js');
const DevtoolsLog = require('./devtools-log.js');

class InspectorIssues extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['timespan', 'navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol},
  }

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
    const artifact = {
      /** @type {Array<LH.Crdp.Audits.MixedContentIssueDetails>} */
      mixedContent: [],
      /** @type {Array<LH.Crdp.Audits.SameSiteCookieIssueDetails>} */
      sameSiteCookies: [],
      /** @type {Array<LH.Crdp.Audits.BlockedByResponseIssueDetails>} */
      blockedByResponse: [],
      /** @type {Array<LH.Crdp.Audits.HeavyAdIssueDetails>} */
      heavyAds: [],
      /** @type {Array<LH.Crdp.Audits.ContentSecurityPolicyIssueDetails>} */
      contentSecurityPolicy: [],
    };

    for (const issue of this._issues) {
      if (issue.details.mixedContentIssueDetails) {
        const issueDetails = issue.details.mixedContentIssueDetails;
        const issueReqId = issueDetails.request && issueDetails.request.requestId;
        // Duplicate issues can occur for the same request; only use the one with a matching networkRequest.
        if (issueReqId &&
          networkRecords.find(req => req.requestId === issueReqId)) {
          artifact.mixedContent.push(issueDetails);
        }
      }
      if (issue.details.sameSiteCookieIssueDetails) {
        const issueDetails = issue.details.sameSiteCookieIssueDetails;
        const issueReqId = issueDetails.request && issueDetails.request.requestId;
        // Duplicate issues can occur for the same request; only use the one with a matching networkRequest.
        if (issueReqId &&
          networkRecords.find(req => req.requestId === issueReqId)) {
          artifact.sameSiteCookies.push(issueDetails);
        }
      }
      if (issue.details.blockedByResponseIssueDetails) {
        const issueDetails = issue.details.blockedByResponseIssueDetails;
        const issueReqId = issueDetails.request && issueDetails.request.requestId;
        // Duplicate issues can occur for the same request; only use the one with a matching networkRequest.
        if (issueReqId &&
          networkRecords.find(req => req.requestId === issueReqId)) {
          artifact.blockedByResponse.push(issueDetails);
        }
      }
      if (issue.details.heavyAdIssueDetails) {
        artifact.heavyAds.push(issue.details.heavyAdIssueDetails);
      }
      if (issue.details.contentSecurityPolicyIssueDetails) {
        artifact.contentSecurityPolicy.push(issue.details.contentSecurityPolicyIssueDetails);
      }
    }

    return artifact;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   * @returns {Promise<LH.Artifacts['InspectorIssues']>}
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    return this._getArtifact(networkRecords);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @returns {Promise<LH.Artifacts['InspectorIssues']>}
   */
  async afterPass(passContext, loadData) {
    await this.stopInstrumentation({...passContext, dependencies: {}});
    return this._getArtifact(loadData.networkRecords);
  }
}

module.exports = InspectorIssues;
