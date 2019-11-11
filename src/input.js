const core = require('@actions/core')
const { readFileSync } = require('fs')

function getArgs() {
  // Make sure we don't have LHCI xor API token
  const serverBaseUrl = getArg('upload.serverBaseUrl')
  const token = getArg('upload.token')
  if (!!serverBaseUrl != !!token) {
    // Fail and exit
    core.setFailed(`Need both a LHCI base url and an API token`)
    process.exit(1)
  }

  let rcCollect = false
  let rcAssert = false
  let staticDistDir = undefined
  // Inspect lighthouserc file for malformations
  const configPath = getArg('configPath')
  if (configPath) {
    const contents = readFileSync(configPath, 'utf8')
    const rcFileObj = JSON.parse(contents)
    if (!('ci' in rcFileObj)) {
      // Fail and exit
      core.setFailed(`Config missing top level 'ci' property`)
      process.exit(1)
    }
    rcCollect = 'collect' in rcFileObj.ci
    rcAssert = 'assert' in rcFileObj.ci

    // Check if we have a static-dist-dir
    if (rcCollect) {
      if ('staticDistDir' in rcFileObj.ci.collect) {
        staticDistDir = rcFileObj.ci.collect.staticDistDir
      }
    }
  }

  // Make sure we have either urls or a static-dist-dir
  const urls = getList('urls')
  if (!urls && !staticDistDir) {
    // Fail and exit
    core.setFailed(`Need either 'urls' in action parameters or a 'static_dist_dir' in lighthouserc file`)
    process.exit(1)
  }

  // Warn if specifying both
  if (urls && staticDistDir) {
    core.warning(
      `Setting both 'url' and 'static_dist_dir' will ignore urls in 'url' since 'static_dist_dir' has higher priority`
    )
  }

  return {
    urls,
    staticDistDir,
    canUpload: getArg('temporaryPublicStorage') ? true : false,
    budgetPath: getArg('budgetPath'),
    numberOfRuns: getIntArg('runs'),
    serverBaseUrl,
    token,
    rcCollect,
    rcAssert,
    configPath
  }
}

/**
 * Wrapper for core.getInput.
 *
 * @param {string} arg
 * @return {string | undefined}
 */
function getArg(arg) {
  return core.getInput(arg) || undefined
}

/**
 * Wrapper for core.getInput for a numeric input.
 *
 * @param {string} arg
 * @return {number | undefined}
 */
function getIntArg(arg) {
  return parseInt(core.getInput(arg)) || undefined
}

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 * @return {string[] | undefined}
 */
function getList(arg, separator = '\n') {
  const input = getArg(arg)
  if (!input) return undefined
  return input.split(separator).map(url => url.trim())
}

module.exports = getArgs()
