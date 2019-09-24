/**
 * An implementation of the RDF Dataset Normalization specification.
 * This library works in the browser and node.js.
 *
 * BSD 3-Clause License
 * Copyright (c) 2016-2017 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

const util = require('./util');
const URDNA2015 = require('./URDNA2015');
const URGNA2012 = require('./URGNA2012');
const URDNA2015Sync = require('./URDNA2015Sync');
const URGNA2012Sync = require('./URGNA2012Sync');

// optional native support
let rdfCanonizeNative;
try {
  rdfCanonizeNative = require('rdf-canonize-native');
} catch(e) {}

const api = {};
module.exports = api;

// expose helpers
api.NQuads = require('./NQuads');
api.IdentifierIssuer = require('./IdentifierIssuer');

/**
 * Get or set native API.
 *
 * @param api the native API.
 *
 * @return the currently set native API.
 */
api._rdfCanonizeNative = function(api) {
  if(api) {
    rdfCanonizeNative = api;
  }
  return rdfCanonizeNative;
};

/**
 * Asynchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param options the options to use:
 *          algorithm the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012`.
 *          [useNative] use native implementation (default: false).
 * @param [callback(err, canonical)] called once the operation completes.
 *
 * @return a Promise that resolves to the canonicalized RDF Dataset.
 */
api.canonize = util.callbackify(async function(dataset, options) {
  let callback;
  const promise = new Promise((resolve, reject) => {
    callback = (err, canonical) => {
      if(err) {
        return reject(err);
      }

      /*if(options.format === 'application/n-quads') {
        canonical = canonical.join('');
      }
      canonical = _parseNQuads(canonical.join(''));*/

      resolve(canonical);
    };
  });

  // back-compat with legacy dataset
  if(!Array.isArray(dataset)) {
    dataset = api.NQuads.legacyDatasetToQuads(dataset);
  }

  // TODO: convert algorithms to Promise-based async
  if(options.useNative) {
    if(rdfCanonizeNative) {
      rdfCanonizeNative.canonize(dataset, options, callback);
    } else {
      throw new Error('rdf-canonize-native not available');
    }
  } else {
    if(options.algorithm === 'URDNA2015') {
      new URDNA2015(options).main(dataset, callback);
    } else if(options.algorithm === 'URGNA2012') {
      new URGNA2012(options).main(dataset, callback);
    } else if(!('algorithm' in options)) {
      throw new Error('No RDF Dataset Canonicalization algorithm specified.');
    } else {
      throw new Error(
        'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
    }
  }

  return promise;
});

/**
 * Synchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param options the options to use:
 *          algorithm the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012`.
 *          [useNative] use native implementation (default: false).
 *
 * @return the RDF dataset in canonical form.
 */
api.canonizeSync = function(dataset, options) {
  // back-compat with legacy dataset
  if(!Array.isArray(dataset)) {
    dataset = api.NQuads.legacyDatasetToQuads(dataset);
  }

  if(options.useNative) {
    if(rdfCanonizeNative) {
      return rdfCanonizeNative.canonizeSync(dataset, options);
    }
    throw new Error('rdf-canonize-native not available');
  }
  if(options.algorithm === 'URDNA2015') {
    return new URDNA2015Sync(options).main(dataset);
  } else if(options.algorithm === 'URGNA2012') {
    return new URGNA2012Sync(options).main(dataset);
  }
  if(!('algorithm' in options)) {
    throw new Error('No RDF Dataset Canonicalization algorithm specified.');
  }
  throw new Error(
    'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
};
