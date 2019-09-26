/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('./computed-artifact.js');
const NetworkRecords = require('./network-records.js');
const MainResource = require('./main-resource.js');
const URL = require('../lib/url-shim.js');

/** @typedef {{count: number, size: number}} ResourceEntry */
class ResourceSummary {
  /**
   * @param {LH.Artifacts.NetworkRequest} record
   * @return {LH.Budget.ResourceType}
   */
  static determineResourceType(record) {
    if (!record.resourceType) return 'other';
    /** @type {Partial<Record<LH.Crdp.Page.ResourceType, LH.Budget.ResourceType>>} */
    const requestToResourceType = {
      'Stylesheet': 'stylesheet',
      'Image': 'image',
      'Media': 'media',
      'Font': 'font',
      'Script': 'script',
      'Document': 'document',
    };
    return requestToResourceType[record.resourceType] || 'other';
  }

  /**
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @param {string} mainResourceURL
   * @return {Record<LH.Budget.ResourceType,ResourceEntry>}
   */
  static summarize(networkRecords, mainResourceURL) {
    /** @type {Record<LH.Budget.ResourceType,ResourceEntry>} */
    const resourceSummary = {
      'stylesheet': {count: 0, size: 0},
      'image': {count: 0, size: 0},
      'media': {count: 0, size: 0},
      'font': {count: 0, size: 0},
      'script': {count: 0, size: 0},
      'document': {count: 0, size: 0},
      'other': {count: 0, size: 0},
      'total': {count: 0, size: 0},
      'third-party': {count: 0, size: 0},
    };

    for (const record of networkRecords) {
      const type = this.determineResourceType(record);
      resourceSummary[type].count++;
      resourceSummary[type].size += record.transferSize;

      resourceSummary.total.count++;
      resourceSummary.total.size += record.transferSize;

      // Ignores subdomains: i.e. blog.example.com & example.com would match
      if (!URL.rootDomainsMatch(record.url, mainResourceURL)) {
        resourceSummary['third-party'].count++;
        resourceSummary['third-party'].size += record.transferSize;
      }
    }
    return resourceSummary;
  }

  /**
   * @param {{URL: LH.Artifacts['URL'], devtoolsLog: LH.DevtoolsLog}} data
   * @param {LH.Audit.Context} context
   * @return {Promise<Record<LH.Budget.ResourceType,ResourceEntry>>}
   */
  static async compute_(data, context) {
    const [networkRecords, mainResource] = await Promise.all([
      NetworkRecords.request(data.devtoolsLog, context),
      MainResource.request(data, context),
    ]);

    return ResourceSummary.summarize(networkRecords, mainResource.url);
  }
}

module.exports = makeComputedArtifact(ResourceSummary);
