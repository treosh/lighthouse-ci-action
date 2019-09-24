const core = require('@actions/core')

try {
  console.log('url: %s, device: %s', core.getInput('url'), core.getInput('device') || 'mobile')
  /** @type {string[]} */
  const results = []
  core.setOutput('results', JSON.stringify(results))
} catch (error) {
  core.setFailed(error.message)
}
