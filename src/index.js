const core = require('@actions/core')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const noRun = true

async function main() {
  const urls = getUrls()
  console.log('urls: %s', urls)
  if (noRun) return
  let chrome = null
  const url = core.getInput('url')
  try {
    chrome = await chromeLauncher.launch({
      port: 9222,
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--no-zygote']
    })
    const { lhr } = await lighthouse(url, { port: chrome.port })
    core.setOutput('result', JSON.stringify(lhr, null, '  '))
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
    core.debug(`done in ${process.uptime()}s`)
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
