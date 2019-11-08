const core = require('@actions/core')
const lighthouse = require('lighthouse')
const { getFilenamePrefix } = require('lighthouse/lighthouse-core/lib/file-namer')
const chromeLauncher = require('chrome-launcher')
const { ensureDir } = require('fs-extra')
const { join } = require('path')
const { writeFile } = require('fs').promises
const { readFileSync } = require('fs')

// audit urls with Lighthouse

async function main() {
  const unprocessedURLs = getUrls()
  const urls = interpolateProcessIntoURLs(unprocessedURLs)

  const resultsPath = join(process.cwd(), 'results')
  const flags = {
    output: 'html',
    logLevel: 'info'
  }
  const baseConfig = getConfig()
  const baseSettings = baseConfig.settings || {}
  const config = {
    ...baseConfig,
    settings: {
      ...baseSettings,
      throttlingMethod: core.getInput('throttlingMethod') || baseSettings.throttlingMethod || 'simulate',
      onlyCategories: getOnlyCategories() || baseSettings.onlyCategories,
      budgets: getBudgets() || baseSettings.budgets,
      extraHeaders: getExtraHeaders() || baseSettings.extraHeaders
    }
  }
  core.startGroup('Lighthouse config')
  console.log('urls: %s', urls)
  console.log('config: %s', JSON.stringify(config, null, '  '))
  core.endGroup()

  let chrome = null
  try {
    core.startGroup('Launch Chrome')
    /** @type {import('chrome-launcher').Options} */
    const chromeOpts = {
      port: 9222,
      logLevel: 'info',
      chromeFlags: getChromeFlags()
    }
    console.log('Chrome launch options: %j', chromeOpts)
    chrome = await chromeLauncher.launch(chromeOpts)
    core.endGroup()

    /** @type {string[]} */
    const failedUrls = []

    await ensureDir(resultsPath)
    for (const url of urls) {
      core.startGroup(`Audit ${url}`)
      const { report, lhr } = await lighthouse(url, { ...flags, port: chrome.port }, config)
      const reportPath = join(resultsPath, getFilenamePrefix(lhr))
      await writeFile(reportPath + '.html', report)
      await writeFile(reportPath + '.json', JSON.stringify(lhr, null, '  '))
      // TODO: print table with result
      core.endGroup()
      const perfBudget = lhr.audits['performance-budget']
      if (perfBudget !== undefined) {
        if (isOverBudget(lhr)) failedUrls.push(url)
      }
    }
    core.setOutput('resultsPath', resultsPath)

    // fail last
    if (failedUrls.length) {
      core.setFailed(
        `Performance budget fails for ${failedUrls.length} URL${failedUrls.length === 1 ? '' : 's'}` +
          ` (${failedUrls.join(', ')})`
      )
    }
  } finally {
    if (chrome) await chrome.kill()
  }
}

// run `main()`

main()
  .catch(
    /** @param {Error} err */ err => {
      core.setFailed(err.message)
      process.exit(1)
    }
  )
  .then(() => {
    console.log(`done in ${process.uptime()}s`)
    process.exit()
  })

/**
 * Get urls from `url` or `urls`
 *
 * @return {string[]}
 */

function getUrls() {
  const url = core.getInput('url')
  if (url) return [url]
  const urls = core.getInput('urls')
  return urls.split('\n').map(url => url.trim())
}

/**
 * Takes a set of URL strings and interpolates
 * any declared ENV vars into them
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

/** @return {object} */
function getConfig() {
  const configPath = core.getInput('configPath')
  if (configPath) return require(join(process.cwd(), configPath))
  return {
    extends: 'lighthouse:default',
    settings: {}
  }
}

/** @return {string[] | null} */
function getOnlyCategories() {
  const onlyCategories = core.getInput('onlyCategories')
  if (!onlyCategories) return null
  return onlyCategories.split(',').map(category => category.trim())
}

/** @return {object | null} */
function getBudgets() {
  const budgetPath = core.getInput('budgetPath')
  if (!budgetPath) return null
  return JSON.parse(readFileSync(join(process.cwd(), budgetPath), 'utf8'))
}

/** @return {object | null} */
function getExtraHeaders() {
  const extraHeaders = core.getInput('extraHeaders')
  try {
    const headers = JSON.parse(extraHeaders || '{}')

    return Object.keys(headers).reduce(
      /** @param {any} obj @param {string} key */ (obj, key) => {
        obj[key.toLowerCase()] = headers[key]
        return obj
      },
      {}
    )
  } catch (err) {
    console.error('Error at parsing extra headers:')
    console.error(err)
    return {}
  }
}

/**
 * Parse flags: https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
 * @return {string[]}
 */

function getChromeFlags() {
  const flags = ['--headless', '--disable-gpu', '--no-sandbox', '--no-zygote']
  const chromeFlags = core.getInput('chromeFlags')
  if (chromeFlags) flags.push(...chromeFlags.split(' '))
  return flags
}

/**
 * Check if the performance budget exceed,
 * by looking at `sizeOverBudget` at `lhr.audits['performance-budget'].details.items`
 *
 * @param {object} lhr
 * @return {boolean}
 */

function isOverBudget(lhr) {
  const perfBudget = lhr.audits['performance-budget']
  if (!perfBudget.details || !perfBudget.details.items) return false
  return perfBudget.details.items.some(/** @param {object} item */ item => item.sizeOverBudget)
}
