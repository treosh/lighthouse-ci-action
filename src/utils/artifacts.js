const artifact = require('@actions/artifact')
const fs = require('fs')
const { join } = require('path')

/** @param {string} rootDirectory */
exports.uploadArtifacts = function uploadArtifacts(rootDirectory) {
  const artifactClient = artifact.create()
  const artifactName = 'lighthouse-results'
  const files = fs.readdirSync(rootDirectory).map(fileName => join(rootDirectory, fileName))
  return artifactClient.uploadArtifact(artifactName, files, rootDirectory, { continueOnError: true })
}
