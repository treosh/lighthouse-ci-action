// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from 'node:fs';
import zlib from 'node:zlib';

/** @typedef {import('./models/trace/trace.ts')} Trace */

// For types... see Connor's manual hack here:
// https://github.com/GoogleChrome/lighthouse/pull/15703/files#diff-ec7e073cf0e6135d4f2af9bc04fe6100ec0df80ad1686bee2da53871be5f1a7b
// and https://github.com/GoogleChrome/lighthouse/pull/15703/files#diff-6dab4507247217209f5ab0f6c343ca2b00af1300878abba81fb74d51cdfbedf9
// But maybe all this kinda works, too?

/** @type {Trace} */
import * as Trace from './models/trace/trace.js';

polyfillDOMRect();

/**
 * @param {Trace.Types.Events.Event[]} traceEvents
 * @return {Promise<{parsedTrace: Trace.Handlers.Types.ParsedTrace, insights: Trace.Insights.Types.TraceInsightSets, model: Trace.TraceModel.Model}>}
 */
export async function analyzeEvents(traceEvents) {
  const model = Trace.TraceModel.Model.createWithAllHandlers();
  await model.parse(traceEvents);
  const parsedTrace = model.parsedTrace();
  const insights = model.traceInsights();

  if (!parsedTrace) {
    throw new Error('No data');
  }
  if (!insights) {
    throw new Error('No insights');
  }
  return {parsedTrace, insights, model};
}

/**
 * @param {string} filename
 * @returns {ReturnType<analyzeEvents>}
 */
export async function analyzeTrace(filename) {
  const traceEvents = loadTraceEventsFromFile(filename);
  return analyzeEvents(traceEvents);
}

// If run as CLI, parse the argv trace (or a fallback)
if (import.meta.url.endsWith(process?.argv[1])) {
  cli();
}

async function cli() {
  const filename = process.argv.at(2);
  if (!filename)
    throw new Error('Provide filename');
  const TraceEngine = await analyzeTrace(filename);
  console.log(TraceEngine);
}


/**
 * @param {string} filename
 * @returns TraceEvent[]
 */
function loadTraceEventsFromFile(filename) {
  const fileBuf = fs.readFileSync(filename);
  let data;
  if (isGzip(fileBuf)) {
    data = zlib.gunzipSync(fileBuf).toString();
  } else {
    data = fileBuf.toString('utf8');
  }
  const json = JSON.parse(data);
  const traceEvents = json.traceEvents ?? json;
  console.assert(Array.isArray(traceEvents));
  return traceEvents;
}

/**
 * Read the first 3 bytes looking for the gzip signature in the file header
 * https://www.rfc-editor.org/rfc/rfc1952#page-6
 * @param {ArrayBuffer} ab
 * @returns boolean
 */
function isGzip(ab) {
  const buf = new Uint8Array(ab);
  if (!buf || buf.length < 3) {
    return false;
  }
  return buf[0] === 0x1F && buf[1] === 0x8B && buf[2] === 0x08;
}

export function polyfillDOMRect() {
  // devtools assumes clientside :(

  // Everything else in here is the DOMRect polyfill
  // https://raw.githubusercontent.com/JakeChampion/polyfill-library/master/polyfills/DOMRect/polyfill.js

  (function(global) {
    /** @param {number=} v */
    function number(v) {
      return v === undefined ? 0 : Number(v);
    }
    /**
     * @param {number} u
     * @param {number} v
     */
    function different(u, v) {
      return u !== v && !(isNaN(u) && isNaN(v));
    }

    /**
     * @param {number} xArg
     * @param {number} yArg
     * @param {number} wArg
     * @param {number} hArg
     * @this {DOMRect}
     */
    function DOMRect(xArg, yArg, wArg, hArg) {
      let /** @type {number} */ x;
      let /** @type {number} */ y;
      let /** @type {number} */ width;
      let /** @type {number} */ height;
      let /** @type {number=} */ left;
      let /** @type {number=} */ right;
      let /** @type {number=} */ top;
      let /** @type {number=} */ bottom;

      x = number(xArg);
      y = number(yArg);
      width = number(wArg);
      height = number(hArg);

      Object.defineProperties(this, {
        x: {
          get: function() {
            return x;
          },
          /** @param {number} newX */
          set: function(newX) {
            if (different(x, newX)) {
              x = newX;
              left = right = undefined;
            }
          },
          enumerable: true
        },
        y: {
          get: function() {
            return y;
          },
          set: function(newY) {
            if (different(y, newY)) {
              y = newY;
              top = bottom = undefined;
            }
          },
          enumerable: true
        },
        width: {
          get: function() {
            return width;
          },
          set: function(newWidth) {
            if (different(width, newWidth)) {
              width = newWidth;
              left = right = undefined;
            }
          },
          enumerable: true
        },
        height: {
          get: function() {
            return height;
          },
          set: function(newHeight) {
            if (different(height, newHeight)) {
              height = newHeight;
              top = bottom = undefined;
            }
          },
          enumerable: true
        },
        left: {
          get: function() {
            if (left === undefined) {
              left = x + Math.min(0, width);
            }
            return left;
          },
          enumerable: true
        },
        right: {
          get: function() {
            if (right === undefined) {
              right = x + Math.max(0, width);
            }
            return right;
          },
          enumerable: true
        },
        top: {
          get: function() {
            if (top === undefined) {
              top = y + Math.min(0, height);
            }
            return top;
          },
          enumerable: true
        },
        bottom: {
          get: function() {
            if (bottom === undefined) {
              bottom = y + Math.max(0, height);
            }
            return bottom;
          },
          enumerable: true
        }
      });
    }

    // @ts-expect-error It's not identical.
    globalThis.DOMRect = DOMRect;
  })(globalThis);
}
