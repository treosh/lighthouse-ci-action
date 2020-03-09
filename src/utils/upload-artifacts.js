const artifact = require('@actions/artifact')
const fs = require('fs')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)

/** @param {string} rootDirectory */
exports.uploadArtifacts = async function uploadArtifacts(rootDirectory) {
  const artifactClient = artifact.create()
  const artifactName = 'lighthouse-results'
  const files = await readdir(rootDirectory)
  return artifactClient.uploadArtifact(artifactName, files, rootDirectory, { continueOnError: true })
}
