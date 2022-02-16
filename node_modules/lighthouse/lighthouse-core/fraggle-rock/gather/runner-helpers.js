/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @typedef CollectPhaseArtifactOptions
 * @property {import('./driver.js')} driver
 * @property {Array<LH.Config.AnyArtifactDefn>} artifactDefinitions
 * @property {ArtifactState} artifactState
 * @property {LH.FRBaseArtifacts} baseArtifacts
 * @property {LH.Gatherer.FRGatherPhase} phase
 * @property {LH.Gatherer.GatherMode} gatherMode
 * @property {Map<string, LH.ArbitraryEqualityMap>} computedCache
 * @property {LH.Config.Settings} settings
 */

/** @typedef {Record<string, Promise<any>>} IntermediateArtifacts */

/** @typedef {Record<CollectPhaseArtifactOptions['phase'], IntermediateArtifacts>} ArtifactState */

/** @typedef {LH.Gatherer.FRTransitionalContext<LH.Gatherer.DependencyKey>['dependencies']} Dependencies */

const log = require('lighthouse-logger');

/**
 *
 * @param {{id: string}} dependency
 * @param {Error} error
 */
function createDependencyError(dependency, error) {
  return new Error(`Dependency "${dependency.id}" failed with exception: ${error.message}`);
}

/** @return {ArtifactState} */
function getEmptyArtifactState() {
  return {
    startInstrumentation: {},
    startSensitiveInstrumentation: {},
    stopSensitiveInstrumentation: {},
    stopInstrumentation: {},
    getArtifact: {},
  };
}


// We make this an explicit record instead of array, so it's easily type checked.
/** @type {Record<CollectPhaseArtifactOptions['phase'], CollectPhaseArtifactOptions['phase'] | undefined>} */
const phaseToPriorPhase = {
  startInstrumentation: undefined,
  startSensitiveInstrumentation: 'startInstrumentation',
  stopSensitiveInstrumentation: 'startSensitiveInstrumentation',
  stopInstrumentation: 'stopSensitiveInstrumentation',
  getArtifact: 'stopInstrumentation',
};

/**
 * Runs the gatherer methods for a particular navigation phase (startInstrumentation/getArtifact/etc).
 * All gatherer method return values are stored on the artifact state object, organized by phase.
 * This method collects required dependencies, runs the applicable gatherer methods, and saves the
 * result on the artifact state object that was passed as part of `options`.
 *
 * @param {CollectPhaseArtifactOptions} options
 */
async function collectPhaseArtifacts(options) {
  const {
    driver,
    artifactDefinitions,
    artifactState,
    baseArtifacts,
    phase,
    gatherMode,
    computedCache,
    settings,
  } = options;
  const priorPhase = phaseToPriorPhase[phase];
  const priorPhaseArtifacts = (priorPhase && artifactState[priorPhase]) || {};

  for (const artifactDefn of artifactDefinitions) {
    const logLevel = phase === 'getArtifact' ? 'log' : 'verbose';
    log[logLevel](`artifacts:${phase}`, artifactDefn.id);
    const gatherer = artifactDefn.gatherer.instance;

    const priorArtifactPromise = priorPhaseArtifacts[artifactDefn.id] || Promise.resolve();
    const artifactPromise = priorArtifactPromise.then(async () => {
      const dependencies = phase === 'getArtifact'
        ? await collectArtifactDependencies(artifactDefn, artifactState.getArtifact)
        : /** @type {Dependencies} */ ({});

      return gatherer[phase]({
        url: await driver.url(),
        gatherMode,
        driver,
        baseArtifacts,
        dependencies,
        computedCache,
        settings,
      });
    });

    await artifactPromise.catch(() => {});
    artifactState[phase][artifactDefn.id] = artifactPromise;
  }
}

/**
 * @param {LH.Config.AnyArtifactDefn} artifact
 * @param {Record<string, LH.Gatherer.PhaseResult>} artifactsById
 * @return {Promise<Dependencies>}
 */
async function collectArtifactDependencies(artifact, artifactsById) {
  if (!artifact.dependencies) return /** @type {Dependencies} */ ({});

  const dependencyPromises = Object.entries(artifact.dependencies).map(
    async ([dependencyName, dependency]) => {
      const dependencyArtifact = artifactsById[dependency.id];
      if (dependencyArtifact === undefined) throw new Error(`"${dependency.id}" did not run`);
      if (dependencyArtifact instanceof Error) {
        throw createDependencyError(dependency, dependencyArtifact);
      }

      const dependencyPromise = Promise.resolve()
        .then(() => dependencyArtifact)
        .catch(err => Promise.reject(createDependencyError(dependency, err)));

      return [dependencyName, await dependencyPromise];
    }
  );

  return Object.fromEntries(await Promise.all(dependencyPromises));
}

/**
 * Awaits the result of artifact, catching errors to set the artifact to an error instead.
 *
 * @param {ArtifactState} artifactState
 * @return {Promise<Partial<LH.GathererArtifacts>>}
 */
async function awaitArtifacts(artifactState) {
  /** @type {IntermediateArtifacts} */
  const artifacts = {};

  for (const [id, promise] of Object.entries(artifactState.getArtifact)) {
    const artifact = await promise.catch(err => err);
    if (artifact !== undefined) artifacts[id] = artifact;
  }

  return artifacts;
}

module.exports = {
  getEmptyArtifactState,
  awaitArtifacts,
  collectPhaseArtifacts,
  collectArtifactDependencies,
};
