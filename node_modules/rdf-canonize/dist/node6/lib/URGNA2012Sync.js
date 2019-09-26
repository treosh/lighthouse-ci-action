/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const URDNA2015Sync = require('./URDNA2015Sync');

const util = require('./util');

module.exports = class URDNA2012Sync extends URDNA2015Sync {
  constructor() {
    super();
    this.name = 'URGNA2012';
    this.hashAlgorithm = 'sha1';
  } // helper for modifying component during Hash First Degree Quads


  modifyFirstDegreeComponent(id, component, key) {
    if (component.termType !== 'BlankNode') {
      return component;
    }

    component = util.clone(component);

    if (key === 'name') {
      component.value = '_:g';
    } else {
      component.value = component.value === id ? '_:a' : '_:z';
    }

    return component;
  } // helper for getting a related predicate


  getRelatedPredicate(quad) {
    return quad.predicate.value;
  } // helper for creating hash to related blank nodes map


  createHashToRelated(id, issuer) {
    const self = this; // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.

    const hashToRelated = {}; // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.

    const quads = self.blankNodeInfo[id].quads; // 3) For each quad in quads:

    for (let i = 0; i < quads.length; ++i) {
      // 3.1) If the quad's subject is a blank node that does not match
      // identifier, set hash to the result of the Hash Related Blank Node
      // algorithm, passing the blank node identifier for subject as related,
      // quad, path identifier issuer as issuer, and p as position.
      const quad = quads[i];
      let position;
      let related;

      if (quad.subject.termType === 'BlankNode' && quad.subject.value !== id) {
        related = quad.subject.value;
        position = 'p';
      } else if (quad.object.termType === 'BlankNode' && quad.object.value !== id) {
        // 3.2) Otherwise, if quad's object is a blank node that does not match
        // identifier, to the result of the Hash Related Blank Node algorithm,
        // passing the blank node identifier for object as related, quad, path
        // identifier issuer as issuer, and r as position.
        related = quad.object.value;
        position = 'r';
      } else {
        // 3.3) Otherwise, continue to the next quad.
        continue;
      } // 3.4) Add a mapping of hash to the blank node identifier for the
      // component that matched (subject or object) to hash to related blank
      // nodes map, adding an entry as necessary.


      const hash = self.hashRelatedBlankNode(related, quad, issuer, position);

      if (hash in hashToRelated) {
        hashToRelated[hash].push(related);
      } else {
        hashToRelated[hash] = [related];
      }
    }

    return hashToRelated;
  }

};