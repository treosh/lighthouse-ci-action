import './utils/support-lh-plugins.js' // add automatic support for LH Plugins env
import { join } from 'node:path'
import childProcess from 'node:child_process'
import { createRequire } from 'node:module'
import core from '@actions/core'
import { getInput, hasAssertConfig } from './config.js'
import { uploadArtifacts } from './utils/artifacts.js'
import { setAnnotations } from './utils/annotations.js'
import { setOutput } from './utils/output.js'

const require = createRequire(import.meta.url)
const lhciCliPath = require.resolve('@lhci/cli/src/cli.js')
console.log(lhciCliPath)

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

  if (input.authBypassToken) {
    const extraHeaders = `"{\"oxygen-auth-bypass-token\": \"${input.authBypassToken}\" }"`
    collectArgs.push(`--extraHeaders=${extraHeaders}`)
  }

  // else LHCI will panic with a non-zero exit code...

  if (input.configPath) collectArgs.push(`--config=${input.configPath}`)

  const collectStatus = runChildCommand('collect', collectArgs)
  if (collectStatus !== 0) throw new Error(`LHCI 'collect' has encountered a problem.`)

  core.endGroup() // Collecting

  /******************************* 2. ASSERT ************************************/
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
    runChildCommand('assert', assertArgs)
    core.endGroup() // Asserting
  }

  /******************************* 3. UPLOAD ************************************/
  core.startGroup(`Uploading`)

  if (input.serverToken || input.temporaryPublicStorage || input.uploadArtifacts) {
    // upload artifacts as soon as collected
    if (input.uploadArtifacts) {
      await uploadArtifacts(resultsPath, input.artifactName)
    }

    if (input.serverToken || input.temporaryPublicStorage) {
      const uploadParams = []

      if (input.serverToken) {
        uploadParams.push(
          '--target=lhci',
          `--serverBaseUrl=${input.serverBaseUrl}`,
          `--token=${input.serverToken}`,
          '--ignoreDuplicateBuildFailure', // ignore failure on the same commit rerun
        )
      } else if (input.temporaryPublicStorage) {
        uploadParams.push('--target=temporary-public-storage')
      }

      if (input.basicAuthPassword) {
        uploadParams.push(
          `--basicAuth.username=${input.basicAuthUsername}`,
          `--basicAuth.password=${input.basicAuthPassword}`,
        )
      }

      if (input.configPath) uploadParams.push(`--config=${input.configPath}`)

      if (input.uploadExtraArgs) uploadParams.push(input.uploadExtraArgs)

      const uploadStatus = runChildCommand('upload', uploadParams)
      if (uploadStatus !== 0) throw new Error(`LHCI 'upload' failed to upload to LHCI server.`)
    }
  }

  // run again for filesystem target
  const uploadStatus = runChildCommand('upload', ['--target=filesystem', `--outputDir=${resultsPath}`])
  if (uploadStatus !== 0) throw new Error(`LHCI 'upload' failed to upload to fylesystem.`)

  core.endGroup() // Uploading

  await setOutput(resultsPath)
  await setAnnotations(resultsPath) // set failing error/warning annotations
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
