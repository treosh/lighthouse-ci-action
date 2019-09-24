const core = require('@actions/core')
const lighthouse = require('lighthouse')
const { getFilenamePrefix } = require('lighthouse/lighthouse-core/lib/file-namer')
const chromeLauncher = require('chrome-launcher')
const { ensureDir } = require('fs-extra')
const { join } = require('path')
const { writeFile } = require('fs').promises

// audit urls with Lighthouse

async function main() {
  const urls = getUrls()
  const resultsPath = join(process.cwd(), 'results')
  const flags = {
    output: 'html',
    logLevel: 'info'
  }
  const config = {
    extends: 'lighthouse:default',
    settings: {
      throttlingMethod: core.getInput('throttlingMethod') || 'simulate',
      onlyCategories: getOnlyCategories()
    }
  }
  console.log('audit urls: %s flags: %j config: %j', urls, flags, config)
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

    await ensureDir(resultsPath)
    for (const url of urls) {
      core.startGroup(`Audit ${url}`)
      const { report, lhr } = await lighthouse(url, { ...flags, port: chrome.port }, config)
      const reportPath = join(resultsPath, getFilenamePrefix(lhr))
      await writeFile(reportPath + '.html', report)
      await writeFile(reportPath + '.json', JSON.stringify(lhr, null, '  '))
      core.endGroup()
    }
    core.setOutput('resultsPath', resultsPath)
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

/** @return {string[] | null} */
function getOnlyCategories() {
  const onlyCategories = core.getInput('onlyCategories')
  if (!onlyCategories) return null
  return onlyCategories.split(',').map(category => category.trim())
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
