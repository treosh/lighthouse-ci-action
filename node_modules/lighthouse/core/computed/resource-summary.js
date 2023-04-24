/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {EntityClassification} from './entity-classification.js';
import {makeComputedArtifact} from './computed-artifact.js';
import {NetworkRecords} from './network-records.js';
import {NetworkRequest} from '../lib/network-request.js';
import {Budget} from '../config/budget.js';
import {Util} from '../../shared/util.js';

/** @typedef {{count: number, resourceSize: number, transferSize: number}} ResourceEntry */

class ResourceSummary {
  /**
   * @param {LH.Artifacts.NetworkRequest} record
   * @return {LH.Budget.ResourceType}
   */
  static determineResourceType(record) {
    if (!record.resourceType) return 'other';
    /** @type {Partial<Record<LH.Crdp.Network.ResourceType, LH.Budget.ResourceType>>} */
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
   * @param {LH.Artifacts.URL} URLArtifact
   * @param {LH.Util.ImmutableObject<LH.Budget[]|null>} budgets
   * @param {LH.Artifacts.EntityClassification} classifiedEntities
   * @return {Record<LH.Budget.ResourceType, ResourceEntry>}
   */
  static summarize(networkRecords, URLArtifact, budgets, classifiedEntities) {
    /** @type {Record<LH.Budget.ResourceType, ResourceEntry>} */
    const resourceSummary = {
      'stylesheet': {count: 0, resourceSize: 0, transferSize: 0},
      'image': {count: 0, resourceSize: 0, transferSize: 0},
      'media': {count: 0, resourceSize: 0, transferSize: 0},
      'font': {count: 0, resourceSize: 0, transferSize: 0},
      'script': {count: 0, resourceSize: 0, transferSize: 0},
      'document': {count: 0, resourceSize: 0, transferSize: 0},
      'other': {count: 0, resourceSize: 0, transferSize: 0},
      'total': {count: 0, resourceSize: 0, transferSize: 0},
      'third-party': {count: 0, resourceSize: 0, transferSize: 0},
    };
    const budget = Budget.getMatchingBudget(budgets, URLArtifact.mainDocumentUrl);
    /** @type {ReadonlyArray<string>} */
    let firstPartyHosts = [];
    if (budget?.options?.firstPartyHostnames) {
      firstPartyHosts = budget.options.firstPartyHostnames;
    } else {
      firstPartyHosts = classifiedEntities.firstParty?.domains.map(domain => `*.${domain}`) ||
        [`*.${Util.getRootDomain(URLArtifact.finalDisplayedUrl)}`];
    }

    networkRecords.filter(record => {
      // Ignore favicon.co
      // Headless Chrome does not request /favicon.ico, so don't consider this request.
      // Makes resource summary consistent across LR / other channels.
      const type = this.determineResourceType(record);
      if (type === 'other' && record.url.endsWith('/favicon.ico')) {
        return false;
      }
      // Ignore non-network protocols
      if (NetworkRequest.isNonNetworkRequest(record)) return false;
      return true;
    }).forEach((record) => {
      const type = this.determineResourceType(record);
      resourceSummary[type].count++;
      resourceSummary[type].resourceSize += record.resourceSize;
      resourceSummary[type].transferSize += record.transferSize;

      resourceSummary.total.count++;
      resourceSummary.total.resourceSize += record.resourceSize;
      resourceSummary.total.transferSize += record.transferSize;

      const isFirstParty = firstPartyHosts.some((hostExp) => {
        const url = new URL(record.url);
        if (hostExp.startsWith('*.')) {
          return url.hostname.endsWith(hostExp.slice(2));
        }
        return url.hostname === hostExp;
      });

      if (!isFirstParty) {
        resourceSummary['third-party'].count++;
        resourceSummary['third-party'].resourceSize += record.resourceSize;
        resourceSummary['third-party'].transferSize += record.transferSize;
      }
    });
    return resourceSummary;
  }

  /**
   * @param {{URL: LH.Artifacts['URL'], devtoolsLog: LH.DevtoolsLog, budgets: LH.Util.ImmutableObject<LH.Budget[]|null>}} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<Record<LH.Budget.ResourceType,ResourceEntry>>}
   */
  static async compute_(data, context) {
    const networkRecords = await NetworkRecords.request(data.devtoolsLog, context);
    const classifiedEntities = await EntityClassification.request(
      {URL: data.URL, devtoolsLog: data.devtoolsLog}, context);
    return ResourceSummary.summarize(networkRecords, data.URL, data.budgets, classifiedEntities);
  }
}

const ResourceSummaryComputed =
  makeComputedArtifact(ResourceSummary, ['URL', 'devtoolsLog', 'budgets']);
export {ResourceSummaryComputed as ResourceSummary};
