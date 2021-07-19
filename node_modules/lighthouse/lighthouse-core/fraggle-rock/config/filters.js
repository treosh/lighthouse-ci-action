/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../../audits/audit.js');

/**
 * Filters an array of artifacts down to the set that supports the specified gather mode.
 *
 * @param {LH.Config.FRConfig['artifacts']} artifacts
 * @param {LH.Gatherer.GatherMode} mode
 * @return {LH.Config.FRConfig['artifacts']}
 */
function filterArtifactsByGatherMode(artifacts, mode) {
  if (!artifacts) return null;
  return artifacts.filter(artifact => {
    return artifact.gatherer.instance.meta.supportedModes.includes(mode);
  });
}

/**
 * Filters an array of audits down to the set that can be computed using only the specified artifacts.
 *
 * @param {LH.Config.FRConfig['audits']} audits
 * @param {Array<LH.Config.ArtifactDefn>} availableArtifacts
 * @return {LH.Config.FRConfig['audits']}
 */
function filterAuditsByAvailableArtifacts(audits, availableArtifacts) {
  if (!audits) return null;

  const availableAritfactIds = new Set(availableArtifacts.map(artifact => artifact.id));

  return audits.filter(audit =>
    audit.implementation.meta.requiredArtifacts.every(id => availableAritfactIds.has(id))
  );
}

/**
 * Filters a categories object and their auditRefs down to the set that can be computed using
 * only the specified audits.
 *
 * @param {LH.Config.Config['categories']} categories
 * @param {Array<LH.Config.AuditDefn>} availableAudits
 * @return {LH.Config.Config['categories']}
 */
function filterCategoriesByAvailableAudits(categories, availableAudits) {
  if (!categories) return categories;

  const availableAuditIdToMeta = new Map(
    availableAudits.map(audit => [audit.implementation.meta.id, audit.implementation.meta])
  );

  const categoryEntries = Object.entries(categories)
    .map(([categoryId, category]) => {
      const filteredCategory = {
        ...category,
        auditRefs: category.auditRefs.filter(ref => availableAuditIdToMeta.has(ref.id)),
      };

      const didFilter = filteredCategory.auditRefs.length < category.auditRefs.length;
      const hasOnlyManualAudits = filteredCategory.auditRefs.every(ref => {
        const meta = availableAuditIdToMeta.get(ref.id);
        if (!meta) return false;
        return meta.scoreDisplayMode === Audit.SCORING_MODES.MANUAL;
      });

      // If we filtered out audits and the only ones left are manual, remove them too.
      if (didFilter && hasOnlyManualAudits) filteredCategory.auditRefs = [];

      return [categoryId, filteredCategory];
    })
    .filter(entry => typeof entry[1] === 'object' && entry[1].auditRefs.length);

  return Object.fromEntries(categoryEntries);
}

/**
 * Filters a config's artifacts, audits, and categories down to the set that supports the specified gather mode.
 *
 * @param {LH.Config.FRConfig} config
 * @param {LH.Gatherer.GatherMode} mode
 * @return {LH.Config.FRConfig}
 */
function filterConfigByGatherMode(config, mode) {
  const artifacts = filterArtifactsByGatherMode(config.artifacts, mode);
  const audits = filterAuditsByAvailableArtifacts(config.audits, artifacts || []);
  const categories = filterCategoriesByAvailableAudits(config.categories, audits || []);

  return {
    ...config,
    artifacts,
    audits,
    categories,
  };
}

module.exports = {
  filterConfigByGatherMode,
  filterArtifactsByGatherMode,
  filterAuditsByAvailableArtifacts,
  filterCategoriesByAvailableAudits,
};
