/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const crypto = require('crypto');

module.exports = class MessageDigest {
  /**
   * Creates a new MessageDigest.
   *
   * @param algorithm the algorithm to use.
   */
  constructor(algorithm) {
    this.md = crypto.createHash(algorithm);
  }

  update(msg) {
    this.md.update(msg, 'utf8');
  }

  digest() {
    return this.md.digest('hex');
  }

};