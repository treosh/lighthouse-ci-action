import { groupBy, mapValues, orderBy } from 'lodash-es'
import core from '@actions/core'
import { getLinks, getAssertionResults } from './lhci-helpers.js'

/**
 * Set annotations for each failed URL.
 * 
 * Example text output (no markdown support, https://github.com/treosh/lighthouse-ci-action/actions/runs/114711383):

3 results for https://exterkamp.codes/

❌ `maskable-icon` failure for `minScore` assertion (Manifest doesn't have a maskable icon: https://web.dev/maskable-icon-audit/)
Expected >= 0.9, but found 0

⚠️ `render-blocking-resources` warning for `maxLength` assertion (Eliminate render-blocking resources: https://web.dev/render-blocking-resources)
Expected <= 0, but found 1

⚠️ `uses-long-cache-ttl` warning for `maxLength` assertion (Uses efficient cache policy on static assets: https://web.dev/uses-long-cache-ttl)
Expected <= 0, but found 1
 
 * @param {string} resultsPath
 */

export async function setAnnotations(resultsPath) {
  const links = await getLinks(resultsPath)
  const assertionResults = await getAssertionResults(resultsPath)
  const failedAssertions = assertionResults?.filter((a) => !a.passed)
  if (!failedAssertions) return

  const assertionResultsByUrl = mapValues(groupBy(failedAssertions, 'url'), (assertions) => {
    return orderBy(assertions, (a) => (a.level === 'error' ? 0 : 1) + a.auditId)
  })

  Object.entries(assertionResultsByUrl).forEach(([url, assertions]) => {
    const link = (links || {})[url]
    const assertionsText = assertions.map((a) => {
      const emoji = a.level === 'error' ? '❌' : '⚠️'
      return (
        `${emoji} \`${a.auditId}${a.auditProperty ? '.' + a.auditProperty : ''}\` ` +
        `${a.level === 'error' ? 'failure' : 'warning'} for \`${a.name}\` assertion` +
        `${a.auditTitle ? ` (${a.auditTitle}: ${a.auditDocumentationLink} )` : ''}\n` +
        `Expected ${a.operator} ${a.expected}, but found ${a.actual}`
      )
    })
    const text =
      `${assertions.length} result${assertions.length === 1 ? '' : 's'} for ${url}\n` +
      `${link ? `Report: ${link}\n` : ''}\n` +
      assertionsText.join('\n\n')

    const hasFailed = assertions.some((a) => a.level === 'error')
    if (hasFailed) {
      core.setFailed(text)
    } else {
      core.warning(text)
    }
  })
}
