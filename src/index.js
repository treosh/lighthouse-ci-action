require('./support-lh-plugins') // add automatic support for LH Plugins env
const core = require('@actions/core')
const { join } = require('path')
const { exec } = require('@actions/exec')
const lhciCliPath = require.resolve('@lhci/cli/src/cli.js')
const { getInputArgs } = require('./input.js')

// audit urls with Lighthouse CI

async function main() {
  core.setOutput('resultsPath', join(process.cwd(), '.lighthouserc'))
  let assertStatus = 0
  core.startGroup('Action config')
  const input = getInputArgs()
  core.info(`Input args: ${JSON.stringify(input, null, '  ')}`)
  core.endGroup() // Action config

  /*******************************COLLECTING***********************************/
  core.startGroup(`Collecting`)
  const collectArgs = ['collect']

  if (input.staticDistDir) {
    collectArgs.push(`--static-dist-dir=${input.staticDistDir}`)
  } else if (input.urls) {
    for (const url of input.urls) {
      collectArgs.push(`--url=${url}`)
    }
  }
  // else LHCI will panic with a non-zero exit code...

  if (input.rcCollect) {
    collectArgs.push(`--config=${input.configPath}`)
    // This should only happen in local testing, when the default is not sent
  }

  // Command line args should override config files
  if (input.runs) {
    collectArgs.push(`--numberOfRuns=${input.runs}`)
  }
  // else, no args and will default to 3 in LHCI.

  const collectStatus = await exec(lhciCliPath, collectArgs)
  if (collectStatus !== 0) throw new Error(`LHCI 'collect' has encountered a problem.`)
  core.endGroup() // Collecting

  /*******************************ASSERTING************************************/
  if (input.budgetPath || input.rcAssert) {
    core.startGroup(`Asserting`)
    const assertArgs = ['assert']

    if (input.budgetPath) {
      assertArgs.push(`--budgetsFile=${input.budgetPath}`)
    } else {
      assertArgs.push(`--config=${input.configPath}`)
    }

    assertStatus = await exec(lhciCliPath, assertArgs)
    if (assertStatus !== 0) {
      // TODO(exterkamp): Output what urls failed and record a nice rich error.
      core.setFailed(`Assertions have failed.`)
    }

    core.endGroup() // Asserting
  }

  /*******************************UPLOADING************************************/
  if (input.uploadServerBaseUrl || input.temporaryPublicStorage || input.gistUploadToken) {
    core.startGroup(`Uploading`)

    if (input.uploadServerBaseUrl) {
      const uploadStatus = await exec(lhciCliPath, [
        'upload',
        '--target=lhci',
        `--serverBaseUrl=${input.uploadServerBaseUrl}`,
        `--token=${input.uploadToken}`
      ])
      if (uploadStatus !== 0) throw new Error(`LHCI 'upload' failed to upload to LHCI server.`)
    }

    if (input.gistUploadToken) {
      const uploadStatus = await exec(lhciCliPath, ['upload', '--target=temporary-public-storage'])
      if (uploadStatus !== 0) throw new Error(`LHCI 'upload' failed to upload to temporary public storage.`)
    }

    if (input.gistUploadToken) {
      // TODO(alekseykulikov): upload to gists
    }

    core.endGroup() // Uploading
  }

  /*******************************NOTIFYING************************************/
  if ((input.githubToken || input.slackWebhookUrl) && assertStatus > 0) {
    // TODO(alekseykulikov): handle notifications
  }
}

// run `main()`

main()
  .catch(err => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))
