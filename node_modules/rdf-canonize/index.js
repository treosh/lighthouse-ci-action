/**
 * An implementation of the RDF Dataset Normalization specification.
 *
 * @author Dave Longley
 *
 * Copyright 2010-2017 Digital Bazaar, Inc.
 */
if(require('semver').gte(process.version, '8.0.0')) {
  module.exports = require('./lib');
} else {
  module.exports = require('./dist/node6/lib');
}
