const core = require('@actions/core')
const { readFileSync } = require('fs')

function getArgs() {
  // Make sure we have either urls or a static-dist-dir
  const urls = getList('urls')
  const staticDistDir = getArg('static_dist_dir')
  if (!urls && !staticDistDir) {
    // Fail and exit
    core.setFailed(`Need either 'urls' or a 'static_dist_dir'`)
    process.exit(1)
  }
  // Warn if specifying both
  if (urls && staticDistDir) {
    core.warning(
      `Setting both 'url' and 'static_dist_dir' will ignore urls in 'url' since 'static_dist_dir' has higher priority`
    )
  }

  // Make sure we don't have LHCI xor API token
  const lhciServer = getArg('lhci_server')
  const apiToken = getArg('api_token')
  if (!!lhciServer != !!apiToken) {
    // Fail and exit
    core.setFailed(`Need both an LHCI address and API token`)
    process.exit(1)
  }

  let rcCollect = false
  let rcAssert = false
  // Inspect lighthouserc file for malformations
  const rcPath = getArg('rc_path')
  if (rcPath) {
    const contents = readFileSync(rcPath, 'utf8')
    const rcFileObj = JSON.parse(contents)
    if (!('ci' in rcFileObj)) {
      // Fail and exit
      core.setFailed(`rc-file missing top level 'ci' property`)
      process.exit(1)
    }
    rcCollect = 'collect' in rcFileObj.ci
    rcAssert = 'assert' in rcFileObj.ci
  }

  return {
    urls,
    staticDistDir,
    canUpload: getArg('disable_temporary_public_storage') ? false : true,
    budgetPath: getArg('budget_path'),
    numberOfRuns: getIntArg('runs'),
    lhciServer,
    apiToken,
    rcCollect,
    rcAssert,
    rcPath
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
