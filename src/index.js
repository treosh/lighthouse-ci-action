require('./utils/support-lh-plugins') // add automatic support for LH Plugins env
const core = require('@actions/core')
const { join } = require('path')
const { exec } = require('@actions/exec')
const lhciCliPath = require.resolve('@lhci/cli/src/cli')
const { getInput, hasAssertConfig } = require('./config')
const { uploadArtifacts } = require('./utils/artifacts')
const { sendGithubComment } = require('./utils/github')
const { sendSlackNotification } = require('./utils/slack')
const { enableProblemMatcher } = require('./utils/problem-matchers')

/**
 * Audit urls with Lighthouse CI in 3 stages:
 * 1. collect (using lhci collect or the custom PSI runner, store results as artifacts)
 * 2. assert (assert results using budgets or LHCI assertions)
 * 3. upload (upload results to LHCI Server, Temporary Public Storage)
 * 4. notify (create github check or send slack notification)
 */

async function main() {
  core.startGroup('Action config')
  const resultsPath = join(process.cwd(), '.lighthouserc')
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

  // upload artifacts as soon as collected
  if (input.uploadArtifacts) await uploadArtifacts(resultsPath)

  core.endGroup() // Collecting

  /******************************* 2. ASSERT ************************************/
  let isAssertFailed = false
  if (input.budgetPath || hasAssertConfig(input.configPath)) {
    core.startGroup(`Asserting`)
    const assertArgs = ['assert']

    if (input.budgetPath) {
      assertArgs.push(`--budgetsFile=${input.budgetPath}`)
    } else {
      assertArgs.push(`--config=${input.configPath}`)
    }

    // run lhci with problem matcher
    // https://github.com/actions/toolkit/blob/master/docs/commands.md#problem-matchers
    const assertStatus = await exec(lhciCliPath, assertArgs)
    isAssertFailed = assertStatus !== 0
    if (isAssertFailed) enableProblemMatcher(resultsPath)
    core.endGroup() // Asserting
  }

  /******************************* 3. UPLOAD ************************************/
  if (input.serverToken || input.temporaryPublicStorage) {
    core.startGroup(`Uploading`)
    const uploadParams = ['upload']

    if (input.serverToken) {
      uploadParams.push('--target=lhci', `--serverBaseUrl=${input.serverToken}`, `--token=${input.serverToken}`)
    } else if (input.temporaryPublicStorage) {
      uploadParams.push('--target=temporary-public-storage', '--uploadUrlMap=true')
    }

    const uploadStatus = await exec(lhciCliPath, uploadParams)
    if (uploadStatus !== 0) throw new Error(`LHCI 'upload' failed to upload to LHCI server.`)

    core.endGroup() // Uploading
  }

  /******************************* 4. NOTIFY ************************************/
  if ((input.githubToken || input.slackWebhookUrl) && isAssertFailed) {
    core.startGroup(`Notifying`)
    if (input.githubToken) {
      await sendGithubComment({ githubToken: input.githubToken, resultsPath })
    }

    // send slack notification only on error
    if (input.slackWebhookUrl) {
      await sendSlackNotification({ slackWebhookUrl: input.slackWebhookUrl, resultsPath })
    }

    core.endGroup() // Notifying
  }

  // set failing exit code for the action
  if (isAssertFailed) {
    core.setFailed(`Assertions have failed.`)
  }
}

// run `main()`

main()
  .catch(err => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))
