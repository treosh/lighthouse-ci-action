/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
/**
 * @fileoverview
 *   Identifies stylesheets, HTML Imports, and scripts that potentially block
 *   the first paint of the page by running several scripts in the page context.
 *   Candidate blocking tags are collected by querying for all script tags in
 *   the head of the page and all link tags that are either matching media
 *   stylesheets or non-async HTML imports. These are then compared to the
 *   network requests to ensure they were initiated by the parser and not
 *   injected with script. To avoid false positives from strategies like
 *   (http://filamentgroup.github.io/loadCSS/test/preload.html), a separate
 *   script is run to flag all links that at one point were rel=preload.
 */


import {NetworkRecords} from '../../../computed/network-records.js';
import DevtoolsLog from '../devtools-log.js';
import FRGatherer from '../../base-gatherer.js';

/* global document, window, HTMLLinkElement, SVGScriptElement */

/** @typedef {{href: string, media: string, msSinceHTMLEnd: number, matches: boolean}} MediaChange */
/** @typedef {{tagName: 'LINK', url: string, href: string, rel: string, media: string, disabled: boolean, mediaChanges: Array<MediaChange>}} LinkTag */
/** @typedef {{tagName: 'SCRIPT', url: string, src: string}} ScriptTag */

/* c8 ignore start */
function installMediaListener() {
  // @ts-expect-error - inserted in page to track media changes.
  window.___linkMediaChanges = [];
  Object.defineProperty(HTMLLinkElement.prototype, 'media', {
    set: function(val) {
      /** @type {MediaChange} */
      const mediaChange = {
        href: this.href,
        media: val,
        msSinceHTMLEnd: Date.now() - performance.timing.responseEnd,
        matches: window.matchMedia(val).matches,
      };
      // @ts-expect-error - `___linkMediaChanges` created above.
      window.___linkMediaChanges.push(mediaChange);

      this.setAttribute('media', val);
    },
  });
}
/* c8 ignore stop */

/**
 * @return {Promise<Array<LinkTag | ScriptTag>>}
 */
/* c8 ignore start */
async function collectTagsThatBlockFirstPaint() {
  /** @type {Array<MediaChange>} */
  // @ts-expect-error - `___linkMediaChanges` created in `installMediaListener`.
  const linkMediaChanges = window.___linkMediaChanges;

  try {
    /** @type {Array<LinkTag>} */
    const linkTags = [...document.querySelectorAll('link')]
      .filter(linkTag => {
        // Filter stylesheet/HTML imports that block rendering.
        // https://www.igvita.com/2012/06/14/debunking-responsive-css-performance-myths/
        // https://www.w3.org/TR/html-imports/#dfn-import-async-attribute
        const blockingStylesheet = linkTag.rel === 'stylesheet' &&
          window.matchMedia(linkTag.media).matches && !linkTag.disabled;
        const blockingImport = linkTag.rel === 'import' && !linkTag.hasAttribute('async');
        return blockingStylesheet || blockingImport;
      })
      .map(tag => {
        return {
          tagName: 'LINK',
          url: tag.href,
          href: tag.href,
          rel: tag.rel,
          media: tag.media,
          disabled: tag.disabled,
          mediaChanges: linkMediaChanges.filter(item => item.href === tag.href),
        };
      });

    /** @type {Array<ScriptTag>} */
    const scriptTags = [...document.querySelectorAll('head script[src]')]
      .filter(/** @return {scriptTag is HTMLScriptElement} */ scriptTag => {
        // SVGScriptElement can't appear in <head> (it'll be kicked to <body>), but keep tsc happy.
        // https://html.spec.whatwg.org/multipage/semantics.html#the-head-element
        if (scriptTag instanceof SVGScriptElement) return false;

        return (
          !scriptTag.hasAttribute('async') &&
          !scriptTag.hasAttribute('defer') &&
          !/^data:/.test(scriptTag.src) &&
          !/^blob:/.test(scriptTag.src) &&
          scriptTag.getAttribute('type') !== 'module'
        );
      })
      .map(tag => {
        return {
          tagName: 'SCRIPT',
          url: tag.src,
          src: tag.src,
        };
      });

    return [...linkTags, ...scriptTags];
  } catch (e) {
    const friendly = 'Unable to gather Scripts/Stylesheets/HTML Imports on the page';
    throw new Error(`${friendly}: ${e.message}`);
  }
}
/* c8 ignore stop */

class TagsBlockingFirstPaint extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
  meta = {
    supportedModes: ['navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol},
  };

  /**
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Map<string, LH.Artifacts.NetworkRequest>}
   */
  static _filteredAndIndexedByUrl(networkRecords) {
    /** @type {Map<string, LH.Artifacts.NetworkRequest>} */
    const result = new Map();

    for (const record of networkRecords) {
      if (!record.finished) continue;

      const isParserGenerated = record.initiator.type === 'parser';
      // A stylesheet only blocks script if it was initiated by the parser
      // https://html.spec.whatwg.org/multipage/semantics.html#interactions-of-styling-and-scripting
      const isParserScriptOrStyle = /(css|script)/.test(record.mimeType) && isParserGenerated;
      const isFailedRequest = record.failed;
      const isHtml = record.mimeType && record.mimeType.includes('html');

      // Filter stylesheet, javascript, and html import mimetypes.
      // Include 404 scripts/links generated by the parser because they are likely blocking.
      if (isHtml || isParserScriptOrStyle || (isFailedRequest && isParserGenerated)) {
        result.set(record.url, record);
      }
    }

    return result;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalDriver} driver
   * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
   * @return {Promise<Array<LH.Artifacts.TagBlockingFirstPaint>>}
   */
  static async findBlockingTags(driver, networkRecords) {
    const firstRequestEndTime = networkRecords.reduce(
      (min, record) => Math.min(min, record.networkEndTime),
      Infinity
    );
    const tags = await driver.executionContext.evaluate(collectTagsThatBlockFirstPaint, {args: []});
    const requests = TagsBlockingFirstPaint._filteredAndIndexedByUrl(networkRecords);

    /** @type {Array<LH.Artifacts.TagBlockingFirstPaint>} */
    const result = [];
    for (const tag of tags) {
      const request = requests.get(tag.url);
      if (!request || request.isLinkPreload) continue;

      let endTime = request.networkEndTime;
      let mediaChanges;

      if (tag.tagName === 'LINK') {
        // Even if the request was initially blocking or appeared to be blocking once the
        // page was loaded, the media attribute could have been changed during load, capping the
        // amount of time it was render blocking. See https://github.com/GoogleChrome/lighthouse/issues/2832.
        const timesResourceBecameNonBlocking = tag.mediaChanges
          .filter(change => !change.matches)
          .map(change => change.msSinceHTMLEnd);
        if (timesResourceBecameNonBlocking.length > 0) {
          const earliestNonBlockingTime = Math.min(...timesResourceBecameNonBlocking);
          const lastTimeResourceWasBlocking = Math.max(
            request.networkRequestTime,
            firstRequestEndTime + earliestNonBlockingTime / 1000
          );
          endTime = Math.min(endTime, lastTimeResourceWasBlocking);
        }

        mediaChanges = tag.mediaChanges;
      }

      const {tagName, url} = tag;

      result.push({
        tag: {tagName, url, mediaChanges},
        transferSize: request.transferSize,
        startTime: request.networkRequestTime,
        endTime,
      });

      // Prevent duplicates from showing up again
      requests.delete(tag.url);
    }

    return result;
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   */
  async startSensitiveInstrumentation(context) {
    const {executionContext} = context.driver;
    // Don't return return value of `evaluateOnNewDocument`.
    await executionContext.evaluateOnNewDocument(installMediaListener, {args: []});
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'>} context
   * @return {Promise<LH.Artifacts['TagsBlockingFirstPaint']>}
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const networkRecords = await NetworkRecords.request(devtoolsLog, context);
    return TagsBlockingFirstPaint.findBlockingTags(context.driver, networkRecords);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['TagsBlockingFirstPaint']>}
   */
  afterPass(passContext, loadData) {
    return TagsBlockingFirstPaint.findBlockingTags(passContext.driver, loadData.networkRecords);
  }
}

export default TagsBlockingFirstPaint;
