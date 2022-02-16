/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../../audits/audit.js');
const BaseFRGatherer = require('../gather/base-gatherer.js');
const i18n = require('../../lib/i18n/i18n.js');

/**
 * @param {LH.Config.GathererDefn | LH.Config.AnyFRGathererDefn} gathererDefn
 * @return {gathererDefn is LH.Config.AnyFRGathererDefn}
 */
function isFRGathererDefn(gathererDefn) {
  return 'meta' in gathererDefn.instance;
}

/**
 * Determines if the artifact dependency direction is valid. The dependency's minimum supported mode
 * must be less than or equal to the dependent's.
 *
 * @param {LH.Config.AnyFRGathererDefn} dependent The artifact that depends on the other.
 * @param {LH.Config.AnyFRGathererDefn} dependency The artifact that is being depended on by the other.
 * @return {boolean}
 */
function isValidArtifactDependency(dependent, dependency) {
  const levels = {timespan: 0, snapshot: 1, navigation: 2};
  const dependentLevel = Math.min(...dependent.instance.meta.supportedModes.map(l => levels[l]));
  const dependencyLevel = Math.min(...dependency.instance.meta.supportedModes.map(l => levels[l]));

  // A timespan artifact cannot depend on a snapshot/navigation artifact because it might run without a snapshot.
  if (dependentLevel === levels.timespan) return dependencyLevel === levels.timespan;
  // A snapshot artifact cannot depend on a timespan/navigation artifact because it might run without a timespan.
  if (dependentLevel === levels.snapshot) return dependencyLevel === levels.snapshot;
  // A navigation artifact can depend on anything.
  return true;
}

/**
 * Throws if pluginName is invalid or (somehow) collides with a category in the
 * configJSON being added to.
 * @param {LH.Config.Json} configJSON
 * @param {string} pluginName
 */
function assertValidPluginName(configJSON, pluginName) {
  if (!pluginName.startsWith('lighthouse-plugin-')) {
    throw new Error(`plugin name '${pluginName}' does not start with 'lighthouse-plugin-'`);
  }

  if (configJSON.categories?.[pluginName]) {
    throw new Error(`plugin name '${pluginName}' not allowed because it is the id of a category already found in config`); // eslint-disable-line max-len
  }
}

/**
 * Throws an error if the provided object does not implement the required Fraggle Rock gatherer interface.
 * @param {LH.Config.AnyFRGathererDefn} gathererDefn
 */
function assertValidFRGatherer(gathererDefn) {
  const gatherer = gathererDefn.instance;
  const gathererName = gatherer.name;

  if (typeof gatherer.meta !== 'object') {
    throw new Error(`${gathererName} gatherer did not provide a meta object.`);
  }

  if (gatherer.meta.supportedModes.length === 0) {
    throw new Error(`${gathererName} gatherer did not support any gather modes.`);
  }

  if (
    typeof gatherer.getArtifact !== 'function' ||
    gatherer.getArtifact === BaseFRGatherer.prototype.getArtifact
  ) {
    throw new Error(`${gathererName} gatherer did not define a "getArtifact" method.`);
  }
}

/**
 * Throws an error if the provided object does not implement the required navigations interface.
 * @param {LH.Config.FRConfig['navigations']} navigationsDefn
 * @return {{warnings: string[]}}
 */
function assertValidFRNavigations(navigationsDefn) {
  if (!navigationsDefn || !navigationsDefn.length) return {warnings: []};

  /** @type {string[]} */
  const warnings = [];

  // Assert that the first navigation has loadFailureMode fatal.
  const firstNavigation = navigationsDefn[0];
  if (firstNavigation.loadFailureMode !== 'fatal') {
    const currentMode = firstNavigation.loadFailureMode;
    const warning = [
      `"${firstNavigation.id}" is the first navigation but had a failure mode of ${currentMode}.`,
      `The first navigation will always be treated as loadFailureMode=fatal.`,
    ].join(' ');

    warnings.push(warning);
    firstNavigation.loadFailureMode = 'fatal';
  }

  // Assert that navigations have unique IDs.
  const navigationIds = navigationsDefn.map(navigation => navigation.id);
  const duplicateId = navigationIds.find(
    (id, i) => navigationIds.slice(i + 1).some(other => id === other)
  );

  if (duplicateId) {
    throw new Error(`Navigation must have unique identifiers, but "${duplicateId}" was repeated.`);
  }

  return {warnings};
}

/**
 * Throws an error if the provided object does not implement the required properties of an audit
 * definition.
 * @param {LH.Config.AuditDefn} auditDefinition
 */
function assertValidAudit(auditDefinition) {
  const {implementation, path: auditPath} = auditDefinition;
  const auditName = auditPath ||
    implementation?.meta?.id ||
    'Unknown audit';

  if (typeof implementation.audit !== 'function' || implementation.audit === Audit.audit) {
    throw new Error(`${auditName} has no audit() method.`);
  }

  if (typeof implementation.meta.id !== 'string') {
    throw new Error(`${auditName} has no meta.id property, or the property is not a string.`);
  }

  if (!i18n.isStringOrIcuMessage(implementation.meta.title)) {
    throw new Error(`${auditName} has no meta.title property, or the property is not a string.`);
  }

  // If it'll have a ✔ or ✖ displayed alongside the result, it should have failureTitle
  const scoreDisplayMode = implementation.meta.scoreDisplayMode || Audit.SCORING_MODES.BINARY;
  if (
    !i18n.isStringOrIcuMessage(implementation.meta.failureTitle) &&
    scoreDisplayMode === Audit.SCORING_MODES.BINARY
  ) {
    throw new Error(`${auditName} has no meta.failureTitle and should.`);
  }

  if (!i18n.isStringOrIcuMessage(implementation.meta.description)) {
    throw new Error(
      `${auditName} has no meta.description property, or the property is not a string.`
    );
  } else if (implementation.meta.description === '') {
    throw new Error(
      `${auditName} has an empty meta.description string. Please add a description for the UI.`
    );
  }

  if (!Array.isArray(implementation.meta.requiredArtifacts)) {
    throw new Error(
      `${auditName} has no meta.requiredArtifacts property, or the property is not an array.`
    );
  }
}

/**
 * @param {LH.Config.FRConfig['categories']} categories
 * @param {LH.Config.FRConfig['audits']} audits
 * @param {LH.Config.FRConfig['groups']} groups
 */
function assertValidCategories(categories, audits, groups) {
  if (!categories) {
    return;
  }

  /** @type {Map<string, LH.Config.AuditDefn>} */
  const auditsKeyedById = new Map((audits || []).map(audit => {
    return [audit.implementation.meta.id, audit];
  }));

  Object.keys(categories).forEach(categoryId => {
    categories[categoryId].auditRefs.forEach((auditRef, index) => {
      if (!auditRef.id) {
        throw new Error(`missing an audit id at ${categoryId}[${index}]`);
      }

      const audit = auditsKeyedById.get(auditRef.id);
      if (!audit) {
        throw new Error(`could not find ${auditRef.id} audit for category ${categoryId}`);
      }

      const auditImpl = audit.implementation;
      const isManual = auditImpl.meta.scoreDisplayMode === 'manual';
      if (categoryId === 'accessibility' && !auditRef.group && !isManual) {
        throw new Error(`${auditRef.id} accessibility audit does not have a group`);
      }

      if (auditRef.weight > 0 && isManual) {
        throw new Error(`${auditRef.id} is manual but has a positive weight`);
      }

      if (auditRef.group && (!groups || !groups[auditRef.group])) {
        throw new Error(`${auditRef.id} references unknown group ${auditRef.group}`);
      }
    });
  });
}

/**
 * Validate the settings after they've been built.
 * @param {LH.Config.Settings} settings
 */
function assertValidSettings(settings) {
  if (!settings.formFactor) {
    throw new Error(`\`settings.formFactor\` must be defined as 'mobile' or 'desktop'. See https://github.com/GoogleChrome/lighthouse/blob/master/docs/emulation.md`);
  }

  if (!settings.screenEmulation.disabled) {
    // formFactor doesn't control emulation. So we don't want a mismatch:
    //   Bad mismatch A: user wants mobile emulation but scoring is configured for desktop
    //   Bad mismtach B: user wants everything desktop and set formFactor, but accidentally not screenEmulation
    if (settings.screenEmulation.mobile !== (settings.formFactor === 'mobile')) {
      throw new Error(`Screen emulation mobile setting (${settings.screenEmulation.mobile}) does not match formFactor setting (${settings.formFactor}). See https://github.com/GoogleChrome/lighthouse/blob/master/docs/emulation.md`);
    }
  }
}

/**
 * Asserts that artifacts are in a valid dependency order that can be computed.
 *
 * @param {Array<LH.Config.NavigationDefn>} navigations
 */
function assertArtifactTopologicalOrder(navigations) {
  const availableArtifacts = new Set();

  for (const navigation of navigations) {
    for (const artifact of navigation.artifacts) {
      availableArtifacts.add(artifact.id);
      if (!artifact.dependencies) continue;

      for (const [dependencyKey, {id: dependencyId}] of Object.entries(artifact.dependencies)) {
        if (availableArtifacts.has(dependencyId)) continue;
        throwInvalidDependencyOrder(artifact.id, dependencyKey);
      }
    }
  }
}

/**
 * @param {LH.Config.FRConfig} config
 * @return {{warnings: string[]}}
 */
function assertValidConfig(config) {
  const {warnings} = assertValidFRNavigations(config.navigations);

  for (const artifactDefn of config.artifacts || []) {
    assertValidFRGatherer(artifactDefn.gatherer);
  }

  for (const auditDefn of config.audits || []) {
    assertValidAudit(auditDefn);
  }

  assertValidCategories(config.categories, config.audits, config.groups);
  assertValidSettings(config.settings);
  return {warnings};
}

/**
 * @param {string} artifactId
 * @param {string} dependencyKey
 * @return {never}
 */
function throwInvalidDependencyOrder(artifactId, dependencyKey) {
  throw new Error(
    [
      `Failed to find dependency "${dependencyKey}" for "${artifactId}" artifact`,
      `Check that...`,
      `  1. A gatherer exposes a matching Symbol that satisfies "${dependencyKey}".`,
      `  2. "${dependencyKey}" is configured to run before "${artifactId}"`,
    ].join('\n')
  );
}

/**
 * @param {string} artifactId
 * @param {string} dependencyKey
 * @return {never}
 */
function throwInvalidArtifactDependency(artifactId, dependencyKey) {
  throw new Error(
    [
      `Dependency "${dependencyKey}" for "${artifactId}" artifact is invalid.`,
      `The dependency must be collected before the dependent.`,
    ].join('\n')
  );
}

module.exports = {
  isFRGathererDefn,
  isValidArtifactDependency,
  assertValidPluginName,
  assertValidFRGatherer,
  assertValidFRNavigations,
  assertValidAudit,
  assertValidCategories,
  assertValidSettings,
  assertArtifactTopologicalOrder,
  assertValidConfig,
  throwInvalidDependencyOrder,
  throwInvalidArtifactDependency,
};
