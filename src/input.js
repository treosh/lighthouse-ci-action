const core = require('@actions/core')
const { loadRcFile } = require('@lhci/utils/src/lighthouserc.js')

exports.getInputArgs = function getInputArgs() {
  // Make sure we don't have LHCI xor API token
  const uploadServerBaseUrl = getArg('upload.serverBaseUrl')
  const uploadToken = getArg('upload.token')
  if (!!uploadServerBaseUrl != !!uploadToken) {
    // Fail and exit
    core.setFailed(`Need both a LHCI server url and an API token`)
    process.exit(1)
  }

  let rcCollect = false
  let rcAssert = false
  let staticDistDir = undefined
  let urls = undefined

  // Inspect lighthouserc file for malformations
  const configPath = getArg('configPath')
  if (configPath) {
    const rcFileObj = loadRcFile(configPath)
    if (!rcFileObj.ci) {
      // Fail and exit
      core.setFailed(`Config missing top level 'ci' property`)
      process.exit(1)
    }
    rcCollect = 'collect' in rcFileObj.ci
    rcAssert = 'assert' in rcFileObj.ci

    // Check if we have a static-dist-dir
    if (rcFileObj.ci.collect) {
      if ('url' in rcFileObj.ci.collect) {
        urls = rcFileObj.ci.collect.url
      }

      if ('staticDistDir' in rcFileObj.ci.collect) {
        staticDistDir = rcFileObj.ci.collect.staticDistDir
      }
    }
  }

  // Get and interpolate URLs
  urls = urls || interpolateProcessIntoURLs(getList('urls'))

  // Make sure we have either urls or a static-dist-dir
  if (!urls && !staticDistDir) {
    // Fail and exit
    core.setFailed(`Need either 'urls' in action parameters or a 'static_dist_dir' in lighthouserc file`)
    process.exit(1)
  }

  // Warn if specifying both
  if (urls.length > 0 && staticDistDir) {
    core.warning(
      `Setting both 'url' and 'static_dist_dir' will ignore urls in 'url' since 'static_dist_dir' has higher priority`
    )
  }

  return {
    urls,
    staticDistDir,
    temporaryPublicStorage: getArg('temporaryPublicStorage') === 'true' ? true : false,
    budgetPath: getArg('budgetPath'),
    configPath,
    slackWebhookUrl: getArg('slackWebhookUrl'),
    runs: getIntArg('runs'),
    githubToken: getArg('githubToken'),
    gistUploadToken: getArg('gistUploadToken'),
    uploadServerBaseUrl,
    uploadToken,
    rcCollect,
    rcAssert
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
 * @return {string[]}
 */
function getList(arg, separator = '\n') {
  const input = getArg(arg)
  if (!input) return []
  return input.split(separator).map(url => url.trim())
}

/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
 *
 * @param {string[]} urls
 * @return {string[]}
 */
function interpolateProcessIntoURLs(urls) {
  return urls.map(url => {
    if (!url.includes('$')) return url
    Object.keys(process.env).forEach(key => {
      if (url.includes(`${key}`)) {
        url = url.replace(`$${key}`, `${process.env[key]}`)
      }
    })
    return url
  })
}
