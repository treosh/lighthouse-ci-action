/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {makeComputedArtifact} from './computed-artifact.js';
import {NetworkRecords} from './network-records.js';
import {Util} from '../../shared/util.js';
import UrlUtils from '../lib/url-utils.js';
import thirdPartyWeb from '../lib/third-party-web.js';

/** @typedef {Map<string, LH.Artifacts.Entity>} EntityCache */

class EntityClassification {
  /**
   * @param {EntityCache} entityCache
   * @param {string} url
   * @return {LH.Artifacts.Entity | undefined}
   */
  static makeUpAnEntity(entityCache, url) {
    if (!UrlUtils.isValid(url)) return;
    // We can make up an entity only for those URLs with a valid domain attached.
    // So we further restrict from allowed URLs to (http/https).
    if (!Util.createOrReturnURL(url).protocol.startsWith('http')) return;

    const rootDomain = Util.getRootDomain(url);
    if (!rootDomain) return;
    if (entityCache.has(rootDomain)) return entityCache.get(rootDomain);

    const unrecognizedEntity = {
      name: rootDomain,
      company: rootDomain,
      category: '',
      categories: [],
      domains: [rootDomain],
      averageExecutionTime: 0,
      totalExecutionTime: 0,
      totalOccurrences: 0,
      isUnrecognized: true,
    };
    entityCache.set(rootDomain, unrecognizedEntity);
    return unrecognizedEntity;
  }

  /**
   * @param {{URL: LH.Artifacts['URL'], devtoolsLog: LH.DevtoolsLog}} data
   * @param {LH.Artifacts.ComputedContext} context
   * @return {Promise<LH.Artifacts.EntityClassification>}
   */
  static async compute_(data, context) {
    const networkRecords = await NetworkRecords.request(data.devtoolsLog, context);
    /** @type {EntityCache} */
    const madeUpEntityCache = new Map();
    /** @type {Map<string, LH.Artifacts.Entity>} */
    const entityByUrl = new Map();
    /** @type {Map<LH.Artifacts.Entity, Set<string>>} */
    const urlsByEntity = new Map();

    for (const record of networkRecords) {
      const {url} = record;
      if (entityByUrl.has(url)) continue;

      const entity = thirdPartyWeb.getEntity(url) ||
        EntityClassification.makeUpAnEntity(madeUpEntityCache, url);
      if (!entity) continue;

      const entityURLs = urlsByEntity.get(entity) || new Set();
      entityURLs.add(url);
      urlsByEntity.set(entity, entityURLs);
      entityByUrl.set(url, entity);
    }

    // When available, first party identification will be done via
    // `mainDocumentUrl` (for navigations), and falls back to `finalDisplayedUrl` (for timespan/snapshot).
    // See https://github.com/GoogleChrome/lighthouse/issues/13706
    const firstPartyUrl = data.URL.mainDocumentUrl || data.URL.finalDisplayedUrl;
    const firstParty = thirdPartyWeb.getEntity(firstPartyUrl) ||
      EntityClassification.makeUpAnEntity(madeUpEntityCache, firstPartyUrl);

    /**
     * Convenience function to check if a URL belongs to first party.
     * @param {string} url
     * @return {boolean}
     */
    function isFirstParty(url) {
      const entityUrl = entityByUrl.get(url);
      if (!entityUrl) throw new Error('A url not in devtoolsLog was used for first-party check.');
      return entityUrl === firstParty;
    }

    return {
      entityByUrl,
      urlsByEntity,
      firstParty,
      isFirstParty,
    };
  }
}

const EntityClassificationComputed = makeComputedArtifact(EntityClassification,
  ['URL', 'devtoolsLog']);
export {EntityClassificationComputed as EntityClassification};
