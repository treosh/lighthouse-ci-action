/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');

const Audit = require('../../audits/audit.js');

/** @type {Record<keyof LH.FRBaseArtifacts, string>} */
const baseArtifactKeySource = {
  fetchTime: '',
  LighthouseRunWarnings: '',
  BenchmarkIndex: '',
  settings: '',
  Timing: '',
  URL: '',
  PageLoadError: '',
  HostFormFactor: '',
  HostUserAgent: '',
  GatherContext: '',
};

const baseArtifactKeys = Object.keys(baseArtifactKeySource);

// Some audits are used by the report for additional information.
// Keep these audits unless they are *directly* skipped with `skipAudits`.
const filterResistantAuditIds = ['full-page-screenshot'];

// Some artifacts are used by the report for additional information.
// Always run these artifacts even if audits do not request them.
const filterResistantArtifactIds = ['HostUserAgent', 'HostFormFactor', 'Stacks', 'GatherContext'];

/**
 * Returns the set of audit IDs used in the list of categories.
 * If `onlyCategories` is not set, this function returns the list of all audit IDs across all
 * categories.
 *
 * @param {LH.Config.FRConfig['categories']} allCategories
 * @param {string[] | undefined} onlyCategories
 * @return {Set<string>}
 */
function getAuditIdsInCategories(allCategories, onlyCategories) {
  if (!allCategories) return new Set();

  onlyCategories = onlyCategories || Object.keys(allCategories);
  const categories = onlyCategories.map(categoryId => allCategories[categoryId]);
  const auditRefs = categories.flatMap(category => category?.auditRefs || []);
  return new Set(auditRefs.map(auditRef => auditRef.id));
}

/**
 * Filters an array of artifacts down to the set that's required by the specified audits.
 *
 * @param {LH.Config.FRConfig['artifacts']} artifacts
 * @param {LH.Config.FRConfig['audits']} audits
 * @return {LH.Config.FRConfig['artifacts']}
 */
function filterArtifactsByAvailableAudits(artifacts, audits) {
  if (!artifacts) return null;
  if (!audits) return artifacts;

  const artifactsById = new Map(artifacts.map(artifact => [artifact.id, artifact]));

  /** @type {Set<string>} */
  const artifactIdsToKeep = new Set([
    ...filterResistantArtifactIds,
    ...audits.flatMap(audit => audit.implementation.meta.requiredArtifacts),
  ]);

  // Keep all artifacts in the dependency tree of required artifacts.
  // Iterate through all kept artifacts, adding their dependencies along the way, until the set does not change.
  let previousSize = 0;
  while (previousSize !== artifactIdsToKeep.size) {
    previousSize = artifactIdsToKeep.size;
    for (const artifactId of artifactIdsToKeep) {
      const artifact = artifactsById.get(artifactId);
      // This shouldn't happen because the config has passed validation by this point.
      if (!artifact) continue;
      // If the artifact doesn't have any dependencies, we can move on.
      if (!artifact.dependencies) continue;
      // Add all of the artifact's dependencies to our set.
      for (const dep of Object.values(artifact.dependencies)) {
        artifactIdsToKeep.add(dep.id);
      }
    }
  }

  return artifacts.filter(artifact => artifactIdsToKeep.has(artifact.id));
}

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
 * Filters an array of navigations down to the set supported by the available artifacts.
 *
 * @param {LH.Config.FRConfig['navigations']} navigations
 * @param {Array<LH.Config.AnyArtifactDefn>} availableArtifacts
 * @return {LH.Config.FRConfig['navigations']}
 */
function filterNavigationsByAvailableArtifacts(navigations, availableArtifacts) {
  if (!navigations) return navigations;

  const availableArtifactIds = new Set(
    availableArtifacts.map(artifact => artifact.id).concat(baseArtifactKeys)
  );

  return navigations
    .map(navigation => {
      return {
        ...navigation,
        artifacts: navigation.artifacts.filter((artifact) => availableArtifactIds.has(artifact.id)),
      };
    })
    .filter(navigation => navigation.artifacts.length);
}

/**
 * Filters an array of audits down to the set that can be computed using only the specified artifacts.
 *
 * @param {LH.Config.FRConfig['audits']} audits
 * @param {Array<LH.Config.AnyArtifactDefn>} availableArtifacts
 * @return {LH.Config.FRConfig['audits']}
 */
function filterAuditsByAvailableArtifacts(audits, availableArtifacts) {
  if (!audits) return null;

  const availableArtifactIds = new Set(
    availableArtifacts.map(artifact => artifact.id).concat(baseArtifactKeys)
  );
  return audits.filter(audit => {
    const meta = audit.implementation.meta;
    return meta.requiredArtifacts.every(id => availableArtifactIds.has(id));
  });
}

/**
 * Optional `supportedModes` property can explicitly exclude an audit even if all required artifacts are available.
 *
 * @param {LH.Config.FRConfig['audits']} audits
 * @param {LH.Gatherer.GatherMode} mode
 * @return {LH.Config.FRConfig['audits']}
 */
function filterAuditsByGatherMode(audits, mode) {
  if (!audits) return null;

  return audits.filter(audit => {
    const meta = audit.implementation.meta;
    return !meta.supportedModes || meta.supportedModes.includes(mode);
  });
}

/**
 * Optional `supportedModes` property can explicitly exclude a category even if some audits are available.
 *
 * @param {LH.Config.Config['categories']} categories
 * @param {LH.Gatherer.GatherMode} mode
 * @return {LH.Config.Config['categories']}
 */
function filterCategoriesByGatherMode(categories, mode) {
  if (!categories) return null;

  const categoriesToKeep = Object.entries(categories)
    .filter(([_, category]) => {
      return !category.supportedModes || category.supportedModes.includes(mode);
    });
  return Object.fromEntries(categoriesToKeep);
}

/**
 * Filters a categories object and their auditRefs down to the specified category ids.
 *
 * @param {LH.Config.Config['categories']} categories
 * @param {string[] | null | undefined} onlyCategories
 * @return {LH.Config.Config['categories']}
 */
function filterCategoriesByExplicitFilters(categories, onlyCategories) {
  if (!categories || !onlyCategories) return categories;

  const categoriesToKeep = Object.entries(categories)
    .filter(([categoryId]) => onlyCategories.includes(categoryId));
  return Object.fromEntries(categoriesToKeep);
}

/**
 * Logs a warning if any specified onlyCategory is not a known category that can
 * be included.
 *
 * @param {LH.Config.Config['categories']} allCategories
 * @param {string[] | null} onlyCategories
 * @return {void}
 */
function warnOnUnknownOnlyCategories(allCategories, onlyCategories) {
  if (!onlyCategories) return;

  for (const onlyCategoryId of onlyCategories) {
    if (!allCategories?.[onlyCategoryId]) {
      log.warn('config', `unrecognized category in 'onlyCategories': ${onlyCategoryId}`);
    }
  }
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
  const supportedAudits = filterAuditsByGatherMode(config.audits, mode);
  const audits = filterAuditsByAvailableArtifacts(supportedAudits, artifacts || []);
  const supportedCategories = filterCategoriesByGatherMode(config.categories, mode);
  const categories = filterCategoriesByAvailableAudits(supportedCategories, audits || []);

  return {
    ...config,
    artifacts,
    audits,
    categories,
  };
}

/**
 * Filters a config's artifacts, audits, and categories down to the requested set.
 * Skip audits overrides inclusion via `onlyAudits`/`onlyCategories`.
 *
 * @param {LH.Config.FRConfig} config
 * @param {Pick<LH.Config.Settings, 'onlyAudits'|'onlyCategories'|'skipAudits'>} filters
 * @return {LH.Config.FRConfig}
 */
function filterConfigByExplicitFilters(config, filters) {
  const {onlyAudits, onlyCategories, skipAudits} = filters;

  warnOnUnknownOnlyCategories(config.categories, onlyCategories);

  let baseAuditIds = getAuditIdsInCategories(config.categories, undefined);
  if (onlyCategories) {
    baseAuditIds = getAuditIdsInCategories(config.categories, onlyCategories);
  } else if (onlyAudits) {
    baseAuditIds = new Set();
  }

  const auditIdsToKeep = new Set(
    [
      ...baseAuditIds, // Start with our base audits.
      ...(onlyAudits || []), // Additionally include the opt-in audits from `onlyAudits`.
      ...filterResistantAuditIds, // Always include our filter-resistant audits (full-page-screenshot).
    ].filter(auditId => !skipAudits || !skipAudits.includes(auditId))
  );

  const audits = auditIdsToKeep.size && config.audits ?
    config.audits.filter(audit => auditIdsToKeep.has(audit.implementation.meta.id)) :
    config.audits;

  const availableCategories = filterCategoriesByAvailableAudits(config.categories, audits || []);
  const categories = filterCategoriesByExplicitFilters(availableCategories, onlyCategories);
  const artifacts = filterArtifactsByAvailableAudits(config.artifacts, audits);
  const navigations = filterNavigationsByAvailableArtifacts(config.navigations, artifacts || []);

  return {
    ...config,
    artifacts,
    navigations,
    audits,
    categories,
  };
}

module.exports = {
  filterConfigByGatherMode,
  filterConfigByExplicitFilters,
  filterArtifactsByGatherMode,
  filterArtifactsByAvailableAudits,
  filterNavigationsByAvailableArtifacts,
  filterAuditsByAvailableArtifacts,
  filterAuditsByGatherMode,
  filterCategoriesByAvailableAudits,
  filterCategoriesByExplicitFilters,
  filterCategoriesByGatherMode,
};
