require('./utils/support-lh-plugins') // add automatic support for LH Plugins env
const core = require('@actions/core')
const { join } = require('path')
const { exec } = require('@actions/exec')
const lhciCliPath = require.resolve('@lhci/cli/src/cli')
const { getInput, hasAssertConfig } = require('./config')
const { uploadArtifacts } = require('./utils/upload-artifacts')

/**
 * Audit urls with Lighthouse CI in 3 stages:
 * 1. collect (using lhci collect or the custom PSI runner, store results as artifacts)
 * 2. upload (upload results to LHCI Server, Temporary Public Storage, or Github Gist for more convinient preview)
 * 3. assert (assert results and send notification if the build failed)
 */

async function main() {
  core.startGroup('Action config')
  const input = getInput()
  core.info(`Input args: ${JSON.stringify(input, null, '  ')}`)
  core.endGroup() // Action config

  /******************************* 1. COLLECT ***********************************/
  core.startGroup(`Collecting`)
  const collectArgs = ['collect', `--numberOfRuns=${input.runs}`]

  if (input.staticDistDir) {
    collectArgs.push(`--static-dist-dir=${input.staticDistDir}`)
  } else if (input.urls) {
    for (const url of input.urls) {
      collectArgs.push(`--url=${url}`)
    }
  } else {
    // LHCI will panic with a non-zero exit code...
  }
  if (input.configPath) collectArgs.push(`--config=${input.configPath}`)

  const collectStatus = await exec(lhciCliPath, collectArgs)
  if (collectStatus !== 0) throw new Error(`LHCI 'collect' has encountered a problem.`)

  const resultsPath = join(process.cwd(), '.lighthouserc')
  core.setOutput('resultsPath', resultsPath)
  if (input.uploadArtifacts) await uploadArtifacts(resultsPath)

  core.endGroup() // Collecting

  /******************************* 2. UPLOAD ************************************/
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

  /******************************* 3. ASSERT ************************************/
  if (input.budgetPath || hasAssertConfig(input.configPath)) {
    core.startGroup(`Asserting`)
    const assertArgs = ['assert']

    if (input.budgetPath) {
      assertArgs.push(`--budgetsFile=${input.budgetPath}`)
    } else {
      assertArgs.push(`--config=${input.configPath}`)
    }

    const assertStatus = await exec(lhciCliPath, assertArgs)
    if (assertStatus !== 0) {
      // TODO(exterkamp): Output what urls failed and record a nice rich error.
      core.setFailed(`Assertions have failed.`)
    }

    if ((input.githubToken || input.slackWebhookUrl) && assertStatus !== 0) {
      // TODO(alekseykulikov): handle notifications
    }

    core.endGroup() // Asserting
  }
}

// run `main()`

main()
  .catch(err => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))
