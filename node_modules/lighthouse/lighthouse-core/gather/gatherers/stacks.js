/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Gathers a list of detected JS libraries and their versions.
 */

/* global window */
/* global d41d8cd98f00b204e9800998ecf8427e_LibraryDetectorTests */

const fs = require('fs');
const log = require('lighthouse-logger');
const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');
const libDetectorSource = fs.readFileSync(
  require.resolve('js-library-detector/library/libraries.js'), 'utf8');

/** @typedef {false | {version: string|number|null}} JSLibraryDetectorTestResult */
/**
 * @typedef JSLibraryDetectorTest
 * @property {string} id
 * @property {string} icon
 * @property {string} url
 * @property {string|null} npm npm module name, if applicable to library.
 * @property {function(Window): JSLibraryDetectorTestResult | Promise<JSLibraryDetectorTestResult>} test Returns false if library is not present, otherwise returns an object that contains the library version (set to null if the version is not detected).
 */

/**
 * @typedef JSLibrary
 * @property {string} id
 * @property {string} name
 * @property {string|number|null} version
 * @property {string|null} npm
 */

/**
 * Obtains a list of detected JS libraries and their versions.
 */
/* c8 ignore start */
async function detectLibraries() {
  /** @type {JSLibrary[]} */
  const libraries = [];

  // d41d8cd98f00b204e9800998ecf8427e_ is a consistent prefix used by the detect libraries
  // see https://github.com/HTTPArchive/httparchive/issues/77#issuecomment-291320900
  /** @type {Record<string, JSLibraryDetectorTest>} */
  // @ts-expect-error - injected libDetectorSource var
  const libraryDetectorTests = d41d8cd98f00b204e9800998ecf8427e_LibraryDetectorTests; // eslint-disable-line

  for (const [name, lib] of Object.entries(libraryDetectorTests)) {
    try {
      /** @type {NodeJS.Timeout|undefined} */
      let timeout;
      // Some library detections are async that can never return.
      // Guard ourselves from PROTOCL_TIMEOUT by limiting each detection to a max of 1s.
      // See https://github.com/GoogleChrome/lighthouse/issues/11124.
      const timeoutPromise = new Promise(r => timeout = setTimeout(() => r(false), 1000));

      const result = await Promise.race([lib.test(window), timeoutPromise]);
      if (timeout) clearTimeout(timeout);
      if (result) {
        libraries.push({
          id: lib.id,
          name: name,
          version: result.version,
          npm: lib.npm,
        });
      }
    } catch (e) {}
  }

  return libraries;
}
/* c8 ignore stop */


/** @implements {LH.Gatherer.FRGathererInstance} */
class Stacks extends FRGatherer {
  constructor() {
    super();

    // Because this file uses `fs.readFile` it gets parsed by a different branch of the browserify internals
    // that cannot handle the latest ECMAScript features.
    // See https://github.com/GoogleChrome/lighthouse/issues/12134
    /** @type {LH.Gatherer.GathererMeta} */
    this.meta = {
      supportedModes: ['snapshot', 'navigation'],
    };
  }

  /**
   * @param {LH.Gatherer.FRTransitionalDriver['executionContext']} executionContext
   * @return {Promise<LH.Artifacts['Stacks']>}
   */
  static async collectStacks(executionContext) {
    const status = {msg: 'Collect stacks', id: 'lh:gather:collectStacks'};
    log.time(status);

    const jsLibraries = await executionContext.evaluate(detectLibraries, {
      args: [],
      deps: [libDetectorSource],
    });

    /** @type {LH.Artifacts['Stacks']} */
    const stacks = jsLibraries.map(lib => ({
      detector: 'js',
      id: lib.id,
      name: lib.name,
      version: typeof lib.version === 'number' ? String(lib.version) : (lib.version || undefined),
      npm: lib.npm || undefined,
    }));
    log.timeEnd(status);
    return stacks;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @return {Promise<LH.Artifacts['Stacks']>}
   */
  async snapshot(context) {
    return Stacks.collectStacks(context.driver.executionContext);
  }
}

module.exports = Stacks;
