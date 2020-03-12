const artifact = require('@actions/artifact')
const fs = require('fs').promises
const { join } = require('path')

/** @param {string} resultsPath */
exports.uploadArtifacts = async function uploadArtifacts(resultsPath) {
  const artifactClient = artifact.create()
  const artifactName = 'lighthouse-results'
  const fileNames = await fs.readdir(resultsPath)
  const files = fileNames.map(fileName => join(resultsPath, fileName))
  return artifactClient.uploadArtifact(artifactName, files, resultsPath, { continueOnError: true })
}
