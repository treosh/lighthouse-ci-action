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
  console.log('audit urls: %s with flags: %j', urls, flags)
  let chrome = null
  try {
    chrome = await chromeLauncher.launch({
      port: 9222,
      logLevel: 'info',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--no-zygote']
    })
    await ensureDir(resultsPath)
    for (const url of urls) {
      const { report, lhr } = await lighthouse(url, { ...flags, port: chrome.port })
      const reportPath = join(resultsPath, getFilenamePrefix(lhr))
      await writeFile(reportPath + '.html', report)
      await writeFile(reportPath + '.json', JSON.stringify(lhr, null, '  '))
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
