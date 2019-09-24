/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const util = require('./util');

module.exports = class IdentifierIssuer {
  /**
   * Creates a new IdentifierIssuer. A IdentifierIssuer issues unique
   * identifiers, keeping track of any previously issued identifiers.
   *
   * @param prefix the prefix to use ('<prefix><counter>').
   */
  constructor(prefix) {
    this.prefix = prefix;
    this.counter = 0;
    this.existing = {};
  }
  /**
   * Copies this IdentifierIssuer.
   *
   * @return a copy of this IdentifierIssuer.
   */


  clone() {
    const copy = new IdentifierIssuer(this.prefix);
    copy.counter = this.counter;
    copy.existing = util.clone(this.existing);
    return copy;
  }
  /**
   * Gets the new identifier for the given old identifier, where if no old
   * identifier is given a new identifier will be generated.
   *
   * @param [old] the old identifier to get the new identifier for.
   *
   * @return the new identifier.
   */


  getId(old) {
    // return existing old identifier
    if (old && old in this.existing) {
      return this.existing[old];
    } // get next identifier


    const identifier = this.prefix + this.counter;
    this.counter += 1; // save mapping

    if (old) {
      this.existing[old] = identifier;
    }

    return identifier;
  }
  /**
   * Returns true if the given old identifer has already been assigned a new
   * identifier.
   *
   * @param old the old identifier to check.
   *
   * @return true if the old identifier has been assigned a new identifier,
   *   false if not.
   */


  hasId(old) {
    return old in this.existing;
  }

};