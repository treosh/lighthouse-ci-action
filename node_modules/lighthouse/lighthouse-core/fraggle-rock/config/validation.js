/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @param {LH.Config.GathererDefn | LH.Config.FRGathererDefn} gathererDefn
 * @return {gathererDefn is LH.Config.FRGathererDefn}
 */
function isFRGathererDefn(gathererDefn) {
  return 'meta' in gathererDefn.instance;
}

/**
 * Determines if the artifact dependency direction is valid. The dependency's minimum supported mode
 * must be less than or equal to the dependent's.
 *
 * @param {LH.Config.FRGathererDefn} dependent The artifact that depends on the other.
 * @param {LH.Config.FRGathererDefn} dependency The artifact that is being depended on by the other.
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
  assertArtifactTopologicalOrder,
  throwInvalidDependencyOrder,
  throwInvalidArtifactDependency,
};
