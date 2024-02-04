const { DefaultArtifactClient } = require('@actions/artifact')
const fs = require('fs').promises
const { join } = require('path')

/** @param {string} resultsPath */
exports.uploadArtifacts = async function uploadArtifacts(resultsPath, artifactName = 'lighthouse-results') {
  const artifactClient = new DefaultArtifactClient()
  const fileNames = await fs.readdir(resultsPath)
  const files = fileNames.map((fileName) => join(resultsPath, fileName))
  return artifactClient.uploadArtifact(artifactName, files, resultsPath)
}
