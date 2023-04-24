/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import path from 'path';

import log from 'lighthouse-logger';

import {Runner} from '../runner.js';
import defaultConfig from './default-config.js';
import {defaultNavigationConfig, nonSimulatedPassConfigOverrides} from './constants.js'; // eslint-disable-line max-len
import {
  isFRGathererDefn,
  throwInvalidDependencyOrder,
  isValidArtifactDependency,
  throwInvalidArtifactDependency,
  assertArtifactTopologicalOrder,
  assertValidConfig,
} from './validation.js';
import {filterConfigByGatherMode, filterConfigByExplicitFilters} from './filters.js';
import {
  deepCloneConfigJson,
  resolveSettings,
  resolveAuditsToDefns,
  resolveGathererToDefn,
  mergePlugins,
  mergeConfigFragment,
  mergeConfigFragmentArrayByKey,
} from './config-helpers.js';
import {getModuleDirectory} from '../../esm-utils.js';
import * as format from '../../shared/localization/format.js';

const defaultConfigPath = path.join(
  getModuleDirectory(import.meta),
  '../../config/default-config.js'
);

/**
 * Certain gatherers are destructive to the page state.
 * We should ensure that these gatherers run after any custom gatherers.
 * The default priority should be 0.
 * TODO: Make this an official part of the config or design a different solution.
 * @type {Record<string, number|undefined>}
 */
const internalArtifactPriorities = {
  FullPageScreenshot: 1,
  BFCacheFailures: 1,
};

/**
 * @param {LH.Config|undefined} config
 * @param {{configPath?: string}} context
 * @return {{configWorkingCopy: LH.Config, configDir?: string, configPath?: string}}
 */
function resolveWorkingCopy(config, context) {
  let {configPath} = context;

  if (configPath && !path.isAbsolute(configPath)) {
    throw new Error('configPath must be an absolute path');
  }

  if (!config) {
    config = defaultConfig;
    configPath = defaultConfigPath;
  }

  // The directory of the config path, if one was provided.
  const configDir = configPath ? path.dirname(configPath) : undefined;

  return {
    configWorkingCopy: deepCloneConfigJson(config),
    configPath,
    configDir,
  };
}

/**
 * @param {LH.Config} config
 * @return {LH.Config}
 */
function resolveExtensions(config) {
  if (!config.extends) return config;

  if (config.extends !== 'lighthouse:default') {
    throw new Error('`lighthouse:default` is the only valid extension method.');
  }

  const {artifacts, ...extensionJSON} = config;
  const defaultClone = deepCloneConfigJson(defaultConfig);
  const mergedConfig = mergeConfigFragment(defaultClone, extensionJSON);

  mergedConfig.artifacts = mergeConfigFragmentArrayByKey(
    defaultClone.artifacts,
    artifacts,
    artifact => artifact.id
  );

  return mergedConfig;
}

/**
 * Looks up the required artifact IDs for each dependency, throwing if no earlier artifact satisfies the dependency.
 *
 * @param {LH.Config.ArtifactJson} artifact
 * @param {LH.Config.AnyFRGathererDefn} gatherer
 * @param {Map<Symbol, LH.Config.AnyArtifactDefn>} artifactDefnsBySymbol
 * @return {LH.Config.AnyArtifactDefn['dependencies']}
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
 * @return {Promise<LH.Config.AnyArtifactDefn[] | null>}
 */
async function resolveArtifactsToDefns(artifacts, configDir) {
  if (!artifacts) return null;

  const status = {msg: 'Resolve artifact definitions', id: 'lh:config:resolveArtifactsToDefns'};
  log.time(status, 'verbose');

  const sortedArtifacts = [...artifacts];
  sortedArtifacts.sort((a, b) => {
    const aPriority = internalArtifactPriorities[a.id] || 0;
    const bPriority = internalArtifactPriorities[b.id] || 0;
    return aPriority - bPriority;
  });

  /** @type {Map<Symbol, LH.Config.AnyArtifactDefn>} */
  const artifactDefnsBySymbol = new Map();

  const coreGathererList = Runner.getGathererList();
  const artifactDefns = [];
  for (const artifactJson of sortedArtifacts) {
    /** @type {LH.Config.GathererJson} */
    // @ts-expect-error - remove when legacy runner path is removed.
    const gathererJson = artifactJson.gatherer;

    const gatherer = await resolveGathererToDefn(gathererJson, coreGathererList, configDir);
    if (!isFRGathererDefn(gatherer)) {
      throw new Error(`${gatherer.instance.name} gatherer does not have a Fraggle Rock meta obj`);
    }

    /** @type {LH.Config.AnyArtifactDefn} */
    // @ts-expect-error - Typescript can't validate the gatherer and dependencies match
    // even though it knows that they're each valid on their own.
    const artifact = {
      id: artifactJson.id,
      gatherer,
      dependencies: resolveArtifactDependencies(artifactJson, gatherer, artifactDefnsBySymbol),
    };

    const symbol = artifact.gatherer.instance.meta.symbol;
    if (symbol) artifactDefnsBySymbol.set(symbol, artifact);
    artifactDefns.push(artifact);
  }

  log.timeEnd(status);
  return artifactDefns;
}

/**
 * Overrides the settings that may not apply to the chosen gather mode.
 *
 * @param {LH.Config.Settings} settings
 * @param {LH.Gatherer.GatherMode} gatherMode
 */
function overrideSettingsForGatherMode(settings, gatherMode) {
  if (gatherMode === 'timespan') {
    if (settings.throttlingMethod === 'simulate') {
      settings.throttlingMethod = 'devtools';
    }
  }
}

/**
 * Overrides the quiet windows when throttlingMethod requires observation.
 *
 * @param {LH.Config.NavigationDefn} navigation
 * @param {LH.Config.Settings} settings
 */
function overrideNavigationThrottlingWindows(navigation, settings) {
  if (navigation.disableThrottling) return;
  if (settings.throttlingMethod === 'simulate') return;

  navigation.cpuQuietThresholdMs = Math.max(
    navigation.cpuQuietThresholdMs || 0,
    nonSimulatedPassConfigOverrides.cpuQuietThresholdMs
  );
  navigation.networkQuietThresholdMs = Math.max(
    navigation.networkQuietThresholdMs || 0,
    nonSimulatedPassConfigOverrides.networkQuietThresholdMs
  );
  navigation.pauseAfterFcpMs = Math.max(
    navigation.pauseAfterFcpMs || 0,
    nonSimulatedPassConfigOverrides.pauseAfterFcpMs
  );
  navigation.pauseAfterLoadMs = Math.max(
    navigation.pauseAfterLoadMs || 0,
    nonSimulatedPassConfigOverrides.pauseAfterLoadMs
  );
}

/**
 * @param {LH.Config.AnyArtifactDefn[]|null|undefined} artifactDefns
 * @param {LH.Config.Settings} settings
 * @return {LH.Config.NavigationDefn[] | null}
 */
function resolveFakeNavigations(artifactDefns, settings) {
  if (!artifactDefns) return null;

  const status = {msg: 'Resolve navigation definitions', id: 'lh:config:resolveNavigationsToDefns'};
  log.time(status, 'verbose');

  const resolvedNavigation = {
    ...defaultNavigationConfig,
    artifacts: artifactDefns,
    pauseAfterFcpMs: settings.pauseAfterFcpMs,
    pauseAfterLoadMs: settings.pauseAfterLoadMs,
    networkQuietThresholdMs: settings.networkQuietThresholdMs,
    cpuQuietThresholdMs: settings.cpuQuietThresholdMs,
    blankPage: settings.blankPage,
  };

  overrideNavigationThrottlingWindows(resolvedNavigation, settings);

  const navigations = [resolvedNavigation];
  assertArtifactTopologicalOrder(navigations);

  log.timeEnd(status);
  return navigations;
}

/**
 * @param {LH.Gatherer.GatherMode} gatherMode
 * @param {LH.Config=} config
 * @param {LH.Flags=} flags
 * @return {Promise<{resolvedConfig: LH.Config.ResolvedConfig, warnings: string[]}>}
 */
async function initializeConfig(gatherMode, config, flags = {}) {
  const status = {msg: 'Initialize config', id: 'lh:config'};
  log.time(status, 'verbose');

  let {configWorkingCopy, configDir} = resolveWorkingCopy(config, flags);

  configWorkingCopy = resolveExtensions(configWorkingCopy);
  configWorkingCopy = await mergePlugins(configWorkingCopy, configDir, flags);

  const settings = resolveSettings(configWorkingCopy.settings || {}, flags);
  overrideSettingsForGatherMode(settings, gatherMode);

  const artifacts = await resolveArtifactsToDefns(configWorkingCopy.artifacts, configDir);

  const navigations = resolveFakeNavigations(artifacts, settings);

  /** @type {LH.Config.ResolvedConfig} */
  let resolvedConfig = {
    artifacts,
    navigations,
    audits: await resolveAuditsToDefns(configWorkingCopy.audits, configDir),
    categories: configWorkingCopy.categories || null,
    groups: configWorkingCopy.groups || null,
    settings,
  };

  const {warnings} = assertValidConfig(resolvedConfig);

  resolvedConfig = filterConfigByGatherMode(resolvedConfig, gatherMode);
  resolvedConfig = filterConfigByExplicitFilters(resolvedConfig, settings);

  log.timeEnd(status);
  return {resolvedConfig, warnings};
}

/**
 * @param {LH.Config.ResolvedConfig} resolvedConfig
 * @return {string}
 */
function getConfigDisplayString(resolvedConfig) {
  /** @type {LH.Config.ResolvedConfig} */
  const resolvedConfigCopy = JSON.parse(JSON.stringify(resolvedConfig));

  if (resolvedConfigCopy.navigations) {
    for (const navigation of resolvedConfigCopy.navigations) {
      for (let i = 0; i < navigation.artifacts.length; ++i) {
        // @ts-expect-error Breaking the Config.AnyArtifactDefn type.
        navigation.artifacts[i] = navigation.artifacts[i].id;
      }
    }
  }

  if (resolvedConfigCopy.artifacts) {
    for (const artifactDefn of resolvedConfigCopy.artifacts) {
      // @ts-expect-error Breaking the Config.AnyArtifactDefn type.
      artifactDefn.gatherer = artifactDefn.gatherer.path;
      // Dependencies are not declared on Config JSON
      artifactDefn.dependencies = undefined;
    }
  }

  if (resolvedConfigCopy.audits) {
    for (const auditDefn of resolvedConfigCopy.audits) {
      // @ts-expect-error Breaking the Config.AuditDefn type.
      auditDefn.implementation = undefined;
      if (Object.keys(auditDefn.options).length === 0) {
        // @ts-expect-error Breaking the Config.AuditDefn type.
        auditDefn.options = undefined;
      }
    }
  }

  // Printed config is more useful with localized strings.
  format.replaceIcuMessages(resolvedConfigCopy, resolvedConfigCopy.settings.locale);

  return JSON.stringify(resolvedConfigCopy, null, 2);
}

export {
  resolveWorkingCopy,
  initializeConfig,
  getConfigDisplayString,
};
