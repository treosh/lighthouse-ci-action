const core = require('@actions/core')
const lighthouse = require('lighthouse/lighthouse-core')

async function main() {
  const url = core.getInput('url')
  const { lhr } = await lighthouse(url)
  core.setOutput('result', JSON.stringify(lhr, null, '  '))
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
