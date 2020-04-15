const { groupBy, mapValues, orderBy } = require('lodash')
const { join } = require('path')
const fs = require('fs').promises
const { existsSync } = require('fs')

/**
 * Reads links.json file as LHCI upload artifacts
 * and returns the content of that file.
 *
 * @param {string} resultsPath
 */

exports.getLinksByUrl = async function getLinksByUrl(resultsPath) {
  const linksPath = join(resultsPath, 'links.json')
  if (!existsSync(linksPath)) return {}
  return JSON.parse(await fs.readFile(linksPath, 'utf8'))
}

/**
 * Get assertions grouped by url and sorted with error first.
 *
 * @typedef {{ name: string, expected: number, actual: number, values: number[], operator: string, passed: boolean,
 *             auditId: string, auditProperty: string, level: 'warn' | 'error', url: string, auditTitle: string, auditDocumentationLink: string }} LHCIAssertion
 *
 * @param {string} resultsPath
 */

exports.getAssertionsByUrl = async function getAssertionsByUrl(resultsPath) {
  /** @type {LHCIAssertion[]} **/
  const assertionResults = JSON.parse(await fs.readFile(join(resultsPath, 'assertion-results.json'), 'utf8'))
  return mapValues(groupBy(assertionResults, 'url'), (assertions) => {
    return orderBy(assertions, (a) => (a.level === 'error' ? 0 : 1) + a.auditId)
  })
}
