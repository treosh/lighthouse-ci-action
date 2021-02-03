/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview
 * Creates treemap data for treemap app.
 */

/**
 * Ex: https://gist.github.com/connorjclark/0ef1099ae994c075e36d65fecb4d26a7
 * @typedef {LH.Treemap.RootNodeContainer[]} TreemapData
 */

/**
 * @typedef {Omit<LH.Treemap.Node, 'name'|'children'>} SourceData
 */

const Audit = require('./audit.js');
const JsBundles = require('../computed/js-bundles.js');
const UnusedJavaScriptSummary = require('../computed/unused-javascript-summary.js');
const ModuleDuplication = require('../computed/module-duplication.js');

class ScriptTreemapDataAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'script-treemap-data',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      title: 'Script Treemap Data',
      description: 'Used for treemap app',
      requiredArtifacts:
        ['traces', 'devtoolsLogs', 'SourceMaps', 'ScriptElements', 'JsUsage', 'URL'],
    };
  }

  /**
   * Returns a tree data structure where leaf nodes are sources (ie. real files from source tree)
   * from a source map, and non-leaf nodes are directories. Leaf nodes have data
   * for bytes, coverage, etc., when available, and non-leaf nodes have the
   * same data as the sum of all descendant leaf nodes.
   * @param {string} sourceRoot
   * @param {Record<string, SourceData>} sourcesData
   * @return {LH.Treemap.Node}
   */
  static prepareTreemapNodes(sourceRoot, sourcesData) {
    /**
     * @param {string} name
     * @return {LH.Treemap.Node}
     */
    function newNode(name) {
      return {
        name,
        resourceBytes: 0,
      };
    }

    const topNode = newNode(sourceRoot);

    /**
     * Given a slash-delimited path, traverse the Node structure and increment
     * the data provided for each node in the chain. Creates nodes as needed.
     * Ex: path/to/file.js will find or create "path" on `node`, increment the data fields,
     *     and continue with "to", and so on.
     * @param {string} source
     * @param {SourceData} data
     */
    function addAllNodesInSourcePath(source, data) {
      let node = topNode;

      // Apply the data to the topNode.
      topNode.resourceBytes += data.resourceBytes;
      if (data.unusedBytes) topNode.unusedBytes = (topNode.unusedBytes || 0) + data.unusedBytes;

      // Strip off the shared root.
      const sourcePathSegments = source.replace(sourceRoot, '').split(/\/+/);
      sourcePathSegments.forEach((sourcePathSegment, i) => {
        const isLeaf = i === sourcePathSegments.length - 1;

        let child = node.children && node.children.find(child => child.name === sourcePathSegment);
        if (!child) {
          child = newNode(sourcePathSegment);
          node.children = node.children || [];
          node.children.push(child);
        }
        node = child;

        // Now that we've found or created the next node in the path, apply the data.
        node.resourceBytes += data.resourceBytes;
        if (data.unusedBytes) node.unusedBytes = (node.unusedBytes || 0) + data.unusedBytes;

        // Only leaf nodes might have duplication data.
        if (isLeaf && data.duplicatedNormalizedModuleName !== undefined) {
          node.duplicatedNormalizedModuleName = data.duplicatedNormalizedModuleName;
        }
      });
    }

    // For every source file, apply the data to all components
    // of the source path, creating nodes as necessary.
    for (const [source, data] of Object.entries(sourcesData)) {
      addAllNodesInSourcePath(source, data);
    }

    /**
     * Collapse nodes that have only one child.
     * @param {LH.Treemap.Node} node
     */
    function collapseAll(node) {
      while (node.children && node.children.length === 1) {
        node.name += '/' + node.children[0].name;
        node.children = node.children[0].children;
      }

      if (node.children) {
        for (const child of node.children) {
          collapseAll(child);
        }
      }
    }
    collapseAll(topNode);

    return topNode;
  }

  /**
   * Returns root node containers where the first level of nodes are script URLs.
   * If a script has a source map, that node will be set by prepareTreemapNodes.
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<TreemapData>}
   */
  static async makeRootNodes(artifacts, context) {
    /** @type {LH.Treemap.RootNodeContainer[]} */
    const rootNodeContainers = [];

    let inlineScriptLength = 0;
    for (const scriptElement of artifacts.ScriptElements) {
      // No src means script is inline.
      // Combine these ScriptElements so that inline scripts show up as a single root node.
      if (!scriptElement.src) {
        inlineScriptLength += (scriptElement.content || '').length;
      }
    }
    if (inlineScriptLength) {
      const name = artifacts.URL.finalUrl;
      rootNodeContainers.push({
        name,
        node: {
          name,
          resourceBytes: inlineScriptLength,
        },
      });
    }

    const bundles = await JsBundles.request(artifacts, context);
    const duplicationByPath = await ModuleDuplication.request(artifacts, context);

    for (const scriptElement of artifacts.ScriptElements) {
      if (!scriptElement.src) continue;

      const name = scriptElement.src;
      const bundle = bundles.find(bundle => scriptElement.src === bundle.script.src);
      const scriptCoverages = artifacts.JsUsage[scriptElement.src] || [];
      if (!bundle && scriptCoverages.length === 0) {
        // No bundle and no coverage information, so simply make a single node
        // detailing how big the script is.

        rootNodeContainers.push({
          name,
          node: {
            name,
            resourceBytes: scriptElement.src.length,
          },
        });
        continue;
      }

      const unusedJavascriptSummary = await UnusedJavaScriptSummary.request(
        {url: scriptElement.src, scriptCoverages, bundle}, context);

      /** @type {LH.Treemap.Node} */
      let node;
      if (bundle && !('errorMessage' in bundle.sizes)) {
        // Create nodes for each module in a bundle.

        /** @type {Record<string, SourceData>} */
        const sourcesData = {};
        for (const source of Object.keys(bundle.sizes.files)) {
          /** @type {SourceData} */
          const sourceData = {
            resourceBytes: bundle.sizes.files[source],
          };

          if (unusedJavascriptSummary.sourcesWastedBytes) {
            sourceData.unusedBytes = unusedJavascriptSummary.sourcesWastedBytes[source];
          }

          // ModuleDuplication uses keys without the source root prepended, but
          // bundle.sizes uses keys with it prepended, so we remove the source root before
          // using it with duplicationByPath.
          let sourceWithoutSourceRoot = source;
          if (bundle.rawMap.sourceRoot && source.startsWith(bundle.rawMap.sourceRoot)) {
            sourceWithoutSourceRoot = source.replace(bundle.rawMap.sourceRoot, '');
          }

          const key = ModuleDuplication.normalizeSource(sourceWithoutSourceRoot);
          if (duplicationByPath.has(key)) sourceData.duplicatedNormalizedModuleName = key;

          sourcesData[source] = sourceData;
        }

        node = this.prepareTreemapNodes(bundle.rawMap.sourceRoot || '', sourcesData);
      } else {
        // No valid source map for this script, so we can only produce a single node.

        node = {
          name,
          resourceBytes: unusedJavascriptSummary.totalBytes,
          unusedBytes: unusedJavascriptSummary.wastedBytes,
        };
      }

      rootNodeContainers.push({
        name,
        node,
      });
    }

    return rootNodeContainers;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const treemapData = await ScriptTreemapDataAudit.makeRootNodes(artifacts, context);

    // TODO: when out of experimental should make a new detail type.
    /** @type {LH.Audit.Details.DebugData} */
    const details = {
      type: 'debugdata',
      treemapData,
    };

    return {
      score: 1,
      details,
    };
  }
}

module.exports = ScriptTreemapDataAudit;
