require('./utils/support-lh-plugins') // add automatic support for LH Plugins env
const core = require('@actions/core')
const { join } = require('path')
const childProcess = require('child_process')
const lhciCliPath = require.resolve('@lhci/cli/src/cli')
const { getInput, hasAssertConfig } = require('./config')
const { uploadArtifacts } = require('./utils/artifacts')
const { setFailedAnnotations } = require('./utils/annotations')

/**
 * Audit urls with Lighthouse CI in 3 stages:
 * 1. collect (using lhci collect or the custom PSI runner, store results as artifacts)
 * 2. assert (assert results using budgets or LHCI assertions)
 * 3. upload (upload results to LHCI Server, Temporary Public Storage)
 */

async function main() {
  core.startGroup('Action config')
  const resultsPath = join(process.cwd(), '.lighthouseci')
  const input = getInput()
  core.info(`Input args: ${JSON.stringify(input, null, '  ')}`)
  core.endGroup() // Action config

  /******************************* 1. COLLECT ***********************************/
  core.startGroup(`Collecting`)
  const collectArgs = [`--numberOfRuns=${input.runs}`]

  if (input.staticDistDir) {
    collectArgs.push(`--static-dist-dir=${input.staticDistDir}`)
  } else if (input.urls) {
    for (const url of input.urls) {
      collectArgs.push(`--url=${url}`)
    }
  }
  // else LHCI will panic with a non-zero exit code...

  if (input.configPath) collectArgs.push(`--config=${input.configPath}`)

  const collectStatus = runChildCommand('collect', collectArgs)
  if (collectStatus !== 0) throw new Error(`LHCI 'collect' has encountered a problem.`)

  core.endGroup() // Collecting

  /******************************* 2. ASSERT ************************************/
  let hasAssertFailed = false
  if (input.budgetPath || hasAssertConfig(input.configPath)) {
    core.startGroup(`Asserting`)
    const assertArgs = []

    if (input.budgetPath) {
      assertArgs.push(`--budgetsFile=${input.budgetPath}`)
    } else {
      assertArgs.push(`--config=${input.configPath}`)
    }

    // run lhci with problem matcher
    // https://github.com/actions/toolkit/blob/master/docs/commands.md#problem-matchers
    const assertStatus = runChildCommand('assert', assertArgs)
    hasAssertFailed = assertStatus !== 0
    console.log(assertStatus);
    core.endGroup() // Asserting
  }

  /******************************* 3. UPLOAD ************************************/
  if (input.serverToken || input.temporaryPublicStorage || input.uploadArtifacts) {
    core.startGroup(`Uploading`)

    // upload artifacts as soon as collected
    if (input.uploadArtifacts) {
      await uploadArtifacts(resultsPath)
    }

    if (input.serverToken || input.temporaryPublicStorage) {
      const uploadParams = []

      if (input.serverToken) {
        uploadParams.push(
          '--target=lhci',
          `--serverBaseUrl=${input.serverBaseUrl}`,
          `--token=${input.serverToken}`,
          '--ignoreDuplicateBuildFailure' // ignore failure on the same commit rerun
        )
      } else if (input.temporaryPublicStorage) {
        uploadParams.push('--target=temporary-public-storage')
      }

      const uploadStatus = runChildCommand('upload', uploadParams)
      if (uploadStatus !== 0) throw new Error(`LHCI 'upload' failed to upload to LHCI server.`)
    }

    core.endGroup() // Uploading
  }

  // set failing exit code for the action, and set annotations
  if (hasAssertFailed) {
    await setFailedAnnotations(resultsPath)
  }
}

// run `main()`

main()
  .catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`done in ${process.uptime()}s`))

/**
 * Run a child command synchronously.
 *
 * @param {'collect'|'assert'|'upload'} command
 * @param {string[]} [args]
 * @return {number}
 */

function runChildCommand(command, args = []) {
  const combinedArgs = [lhciCliPath, command, ...args]
  const { status = -1 } = childProcess.spawnSync(process.argv[0], combinedArgs, {
    stdio: 'inherit',
  })
  return status || 0
}
