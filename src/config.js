import { resolve } from 'node:path'
import core from '@actions/core'
import { loadRcFile } from '@lhci/utils/src/lighthouserc.js'
import { get } from 'lodash-es'

export function getInput() {
  // fallback to upload.serverBaseUrl + upload.token for previous API support
  const serverBaseUrl = core.getInput('serverBaseUrl') || core.getInput('upload.serverBaseUrl')
  const serverToken = core.getInput('serverToken') || core.getInput('upload.token')

  // Make sure we don't have LHCI xor API token
  if (!!serverBaseUrl != !!serverToken) {
    // Fail and exit
    core.setFailed(`Need both a LHCI server url and an API token.`)
    process.exit(1)
  }

  const temporaryPublicStorage = core.getInput('temporaryPublicStorage') === 'true' ? true : false
  if (serverBaseUrl && temporaryPublicStorage) {
    core.setFailed(`Both LHCI server and Temporary storage are set, choose one upload method.`)
    process.exit(1)
  }

  let staticDistDir = null
  let urls = null
  let numberOfRuns = null

  // Inspect lighthouserc file for malformations
  const configPath = core.getInput('configPath') ? resolve(core.getInput('configPath')) : null
  if (configPath) {
    const rcFileObj = loadRcFile(configPath)
    if (!rcFileObj.ci) {
      // Fail and exit
      core.setFailed(`Config missing top level 'ci' property`)
      process.exit(1)
    }

    // Check if we have a static-dist-dir
    if (rcFileObj.ci.collect) {
      if (rcFileObj.ci.collect.url) {
        urls = rcFileObj.ci.collect.url
      }

      if (rcFileObj.ci.collect.staticDistDir) {
        staticDistDir = rcFileObj.ci.collect.staticDistDir
      }

      if (rcFileObj.ci.collect.numberOfRuns) {
        numberOfRuns = rcFileObj.ci.collect.numberOfRuns
      }
    }
  }

  // Get and interpolate URLs
  urls = interpolateProcessIntoUrls(getList('urls')) || urls

  // Make sure we have either urls or a static-dist-dir
  if (!urls && !staticDistDir) {
    // Fail and exit
    core.setFailed(`Need either 'urls' in action parameters or a 'static_dist_dir' in lighthouserc file`)
    process.exit(1)
  }

  return {
    // collect
    urls,
    runs: core.getInput('runs') ? parseInt(core.getInput('runs'), 10) : numberOfRuns || 1, // `runs`, check config, and fallback to 1
    staticDistDir,
    // assert
    budgetPath: core.getInput('budgetPath') || '',
    configPath,
    // upload
    serverBaseUrl,
    serverToken,
    temporaryPublicStorage,
    uploadArtifacts: core.getInput('uploadArtifacts') === 'true' ? true : false,
    uploadExtraArgs: core.getInput('uploadExtraArgs') || '',
    basicAuthUsername: core.getInput('basicAuthUsername') || 'lighthouse',
    basicAuthPassword: core.getInput('basicAuthPassword'),
    artifactName: core.getInput('artifactName'),
    authBypassToken: core.getInput('authBypassToken')
  }
}

/**
 * Check if the file under `configPath` has `assert` params set.
 *
 * @param {string | null} configPath
 */

export function hasAssertConfig(configPath) {
  if (!configPath) return false
  const rcFileObj = loadRcFile(configPath)
  return Boolean(get(rcFileObj, 'ci.assert'))
}

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */

function getList(arg, separator = '\n') {
  const input = core.getInput(arg)
  if (!input) return []
  return input.split(separator).map((url) => url.trim())
}

/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
 *
 * @param {string[]} urls
 */

function interpolateProcessIntoUrls(urls) {
  return urls.map((url) => {
    if (!url.includes('$')) return url
    Object.keys(process.env).forEach((key) => {
      if (url.includes(`${key}`)) {
        url = url.replace(`$${key}`, `${process.env[key]}`)
      }
    })
    return url
  })
}
