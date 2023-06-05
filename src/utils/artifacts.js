const artifact = require('@actions/artifact')
const fs = require('fs').promises
const { join } = require('path')

/** 
 * @param {string} resultsPath
 * @param {number} [retentionDays]
 */
exports.uploadArtifacts = async function uploadArtifacts(resultsPath, artifactName = 'lighthouse-results', retentionDays) {
  const artifactClient = artifact.create()
  const fileNames = await fs.readdir(resultsPath)
  const files = fileNames.map((fileName) => join(resultsPath, fileName))
  return artifactClient.uploadArtifact(artifactName, files, resultsPath, { continueOnError: true, retentionDays })
}
