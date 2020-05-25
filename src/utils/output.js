const core = require('@actions/core')
const { getLinks, getAssertionResults } = require('./lhci-helpers')

/**
 * Set output: {
 *   resultsPath: string
 *   links: Object<url,url> (links.json)
 *   assertionResults: LhciAssertion[] (assertion-results.json)
 *   reports: LhciReportSummary[] (waiting https://github.com/GoogleChrome/lighthouse-ci/issues/142)
 * }
 *
 * @param {string} resultsPath
 */

exports.setOutput = async function setOutput(resultsPath) {
  const links = await getLinks(resultsPath)
  const assertionResults = await getAssertionResults(resultsPath)

  core.setOutput('resultsPath', resultsPath)
  core.setOutput('links', links ? JSON.stringify(links) : '')
  core.setOutput('assertionResults', assertionResults ? JSON.stringify(assertionResults) : '')
}
