const { groupBy, fromPairs } = require('lodash')
const { join } = require('path')
const fs = require('fs')

/**
 * Get links by url.
 *
 * @param {string} resultsPath
 * @return {Object<string,string>}
 */

exports.getLinksByUrl = function getLinksByUrl(resultsPath) {
  return JSON.parse(fs.readFileSync(join(resultsPath, 'links.json'), 'utf8'))
}

/**
 * Get assertions grouped by url.
 *
 * @typedef {{ name: string, expected: number, actual: number, values: number[], operator: string, passed: boolean,
 *             auditId: string, level: 'warn' | 'error', url: string, auditTitle: string, auditDocumentationLink: string }} LHCIAssertion
 *
 * @param {string} resultsPath
 * @return {Object<string,LHCIAssertion[]>}
 */

exports.getAssertionsByUrl = function getAssertionsByUrl(resultsPath) {
  /** @type {LHCIAssertion[]} **/
  const assertionResults = JSON.parse(fs.readFileSync(join(resultsPath, 'assertion-results.json'), 'utf8'))
  return groupBy(assertionResults, 'url')
}

/**
 * Get Lighthouse results by url.
 *
 * @typedef {{ requestedUrl: string }} LHResult
 *
 * @param {string} resultsPath
 * @return {Object<string,LHResult>}
 */

exports.getResultsByUrl = function getResultsByUrl(resultsPath) {
  const lhrFileNames = fs
    .readdirSync(resultsPath)
    .filter(fileName => fileName.startsWith('lhr-') && fileName.endsWith('.json'))
  return fromPairs(
    lhrFileNames.map(fileName => {
      /** @type {LHResult} **/
      const lhr = JSON.parse(fs.readFileSync(join(resultsPath, fileName), 'utf8'))
      const url = lhr.requestedUrl || ''
      return [url, lhr]
    })
  )
}
