const core = require('@actions/core')

try {
  const pages = core.getInput('pages')
  console.log(pages)
  /** @type {string[]} */
  const results = []
  core.setOutput('results', JSON.stringify(results))
} catch (error) {
  core.setFailed(error.message)
}
