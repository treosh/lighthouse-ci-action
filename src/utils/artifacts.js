import fs from 'node:fs/promises'
import { join } from 'node:path'
import { DefaultArtifactClient } from '@actions/artifact'

/** @param {string} resultsPath */
export async function uploadArtifacts(resultsPath, artifactName = 'lighthouse-results') {
  const artifactClient = new DefaultArtifactClient()
  const fileNames = await fs.readdir(resultsPath)
  const files = fileNames.map((fileName) => join(resultsPath, fileName))
  return artifactClient.uploadArtifact(artifactName, files, resultsPath)
}
