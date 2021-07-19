/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const path = require('path');
const log = require('lighthouse-logger');
const Runner = require('../../runner.js');
const defaultConfig = require('./default-config.js');
const {defaultNavigationConfig} = require('../../config/constants.js');
const {
  isFRGathererDefn,
  throwInvalidDependencyOrder,
  isValidArtifactDependency,
  throwInvalidArtifactDependency,
  assertArtifactTopologicalOrder,
} = require('./validation.js');
const {filterConfigByGatherMode} = require('./filters.js');
const {
  deepCloneConfigJson,
  resolveSettings,
  resolveAuditsToDefns,
  resolveGathererToDefn,
} = require('../../config/config-helpers.js');
const defaultConfigPath = path.join(__dirname, './default-config.js');

/**
 * @param {LH.Config.Json|undefined} configJSON
 * @param {{configPath?: string}} context
 * @return {{configWorkingCopy: LH.Config.Json, configDir?: string, configPath?: string}}
 */
function resolveWorkingCopy(configJSON, context) {
  let {configPath} = context;

  if (configPath && !path.isAbsolute(configPath)) {
    throw new Error('configPath must be an absolute path');
  }

  if (!configJSON) {
    configJSON = defaultConfig;
    configPath = defaultConfigPath;
  }

  // The directory of the config path, if one was provided.
  const configDir = configPath ? path.dirname(configPath) : undefined;

  return {
    configWorkingCopy: deepCloneConfigJson(configJSON),
    configPath,
    configDir,
  };
}

/**
 * Looks up the required artifact IDs for each dependency, throwing if no earlier artifact satisfies the dependency.
 *
 * @param {LH.Config.ArtifactJson} artifact
 * @param {LH.Config.FRGathererDefn} gatherer
 * @param {Map<Symbol, LH.Config.ArtifactDefn>} artifactDefnsBySymbol
 * @return {LH.Config.ArtifactDefn['dependencies']}
 */
function resolveArtifactDependencies(artifact, gatherer, artifactDefnsBySymbol) {
  if (!('dependencies' in gatherer.instance.meta)) return undefined;

  const dependencies = Object.entries(gatherer.instance.meta.dependencies).map(
      ([dependencyName, artifactSymbol]) => {
        const dependency = artifactDefnsBySymbol.get(artifactSymbol);

        // Check that dependency was defined before us.
        if (!dependency) throwInvalidDependencyOrder(artifact.id, dependencyName);

        // Check that the phase relationship is OK too.
        const validDependency = isValidArtifactDependency(gatherer, dependency.gatherer);
        if (!validDependency) throwInvalidArtifactDependency(artifact.id, dependencyName);

        return [dependencyName, {id: dependency.id}];
      }
  );

  return Object.fromEntries(dependencies);
}

/**
 *
 * @param {LH.Config.ArtifactJson[]|null|undefined} artifacts
 * @param {string|undefined} configDir
 * @return {LH.Config.ArtifactDefn[] | null}
 */
function resolveArtifactsToDefns(artifacts, configDir) {
  if (!artifacts) return null;

  const status = {msg: 'Resolve artifact definitions', id: 'lh:config:resolveArtifactsToDefns'};
  log.time(status, 'verbose');

  /** @type {Map<Symbol, LH.Config.ArtifactDefn>} */
  const artifactDefnsBySymbol = new Map();

  const coreGathererList = Runner.getGathererList();
  const artifactDefns = artifacts.map(artifactJson => {
    /** @type {LH.Config.GathererJson} */
    // @ts-expect-error FR-COMPAT - eventually move the config-helpers to support new types
    const gathererJson = artifactJson.gatherer;

    const gatherer = resolveGathererToDefn(gathererJson, coreGathererList, configDir);
    if (!isFRGathererDefn(gatherer)) {
      throw new Error(`${gatherer.instance.name} gatherer does not support Fraggle Rock`);
    }

    /** @type {LH.Config.ArtifactDefn<LH.Gatherer.DependencyKey>} */
    const artifact = {
      id: artifactJson.id,
      gatherer,
      dependencies: resolveArtifactDependencies(artifactJson, gatherer, artifactDefnsBySymbol),
    };

    const symbol = artifact.gatherer.instance.meta.symbol;
    if (symbol) artifactDefnsBySymbol.set(symbol, artifact);
    return artifact;
  });

  log.timeEnd(status);
  return artifactDefns;
}

/**
 *
 * @param {LH.Config.NavigationJson[]|null|undefined} navigations
 * @param {LH.Config.ArtifactDefn[]|null|undefined} artifactDefns
 * @return {LH.Config.NavigationDefn[] | null}
 */
function resolveNavigationsToDefns(navigations, artifactDefns) {
  if (!navigations) return null;
  if (!artifactDefns) throw new Error('Cannot use navigations without defining artifacts');

  const status = {msg: 'Resolve navigation definitions', id: 'lh:config:resolveNavigationsToDefns'};
  log.time(status, 'verbose');

  const artifactsById = new Map(artifactDefns.map(defn => [defn.id, defn]));

  const navigationDefns = navigations.map(navigation => {
    const navigationWithDefaults = {...defaultNavigationConfig, ...navigation};
    const navId = navigationWithDefaults.id;
    const artifacts = navigationWithDefaults.artifacts.map(id => {
      const artifact = artifactsById.get(id);
      if (!artifact) throw new Error(`Unrecognized artifact "${id}" in navigation "${navId}"`);
      return artifact;
    });

    // TODO(FR-COMPAT): enforce navigation throttling invariants

    return {...navigationWithDefaults, artifacts};
  });

  assertArtifactTopologicalOrder(navigationDefns);

  log.timeEnd(status);
  return navigationDefns;
}

/**
 * @param {LH.Config.Json|undefined} configJSON
 * @param {{gatherMode: LH.Gatherer.GatherMode, configPath?: string, settingsOverrides?: LH.SharedFlagsSettings}} context
 * @return {{config: LH.Config.FRConfig, warnings: string[]}}
 */
function initializeConfig(configJSON, context) {
  const status = {msg: 'Initialize config', id: 'lh:config'};
  log.time(status, 'verbose');

  const {configWorkingCopy, configDir} = resolveWorkingCopy(configJSON, context);

  // TODO(FR-COMPAT): handle config extension
  // TODO(FR-COMPAT): handle config plugins

  const settings = resolveSettings(configWorkingCopy.settings || {}, context.settingsOverrides);
  const artifacts = resolveArtifactsToDefns(configWorkingCopy.artifacts, configDir);
  const navigations = resolveNavigationsToDefns(configWorkingCopy.navigations, artifacts);

  /** @type {LH.Config.FRConfig} */
  let config = {
    artifacts,
    navigations,
    audits: resolveAuditsToDefns(configWorkingCopy.audits, configDir),
    categories: configWorkingCopy.categories || null,
    groups: configWorkingCopy.groups || null,
    settings,
  };

  // TODO(FR-COMPAT): validate navigations
  // TODO(FR-COMPAT): validate audits
  // TODO(FR-COMPAT): validate categories
  // TODO(FR-COMPAT): filter config using onlyAudits/onlyCategories
  // TODO(FR-COMPAT): always keep base/shared artifacts/audits (Stacks, FullPageScreenshot, etc)

  config = filterConfigByGatherMode(config, context.gatherMode);

  log.timeEnd(status);
  return {config, warnings: []};
}

module.exports = {resolveWorkingCopy, initializeConfig};
