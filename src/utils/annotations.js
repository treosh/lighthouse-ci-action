const core = require('@actions/core')
const { getLinksByUrl, getAssertionsByUrl } = require('./lhci-helpers')

/**
 * Set annotations for each failed URL.
 * 
 * Example text output (no markdown support, https://{link to gh-issue where this is being fixed/issue in this repo}):

2 results for https://treo.sh/
Report: https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1583834596726-91444.report.html

❌ `offscreen-images` failure for `maxLength` assertion (defer offscreen images: https://web.dev/offscreen-images)
Expected <= 0, but found 1

⚠️ `mainthread-work-breakdown` warning for `minScore` assertion (minimize main-thread work: https://web.dev/mainthread-work-breakdown)
Expected >= 0.9, but found 0.83
 
 * @param {string} resultsPath
 */

exports.setFailedAnnotations = async function setFailedAnnotations(resultsPath) {
  const linksByUrl = await getLinksByUrl(resultsPath)
  const assertionsByUrl = await getAssertionsByUrl(resultsPath)

  Object.entries(assertionsByUrl).forEach(([url, assertions]) => {
    const link = linksByUrl[url]
    const assertionsText = assertions.map(a => {
      const emoji = a.level === 'error' ? '🔴' : '🟡'
      return (
        `${emoji} \`${a.auditId}.${a.auditProperty}\` ${a.level === 'error' ? 'failure' : 'warning'} for \`${
          a.name
        }\` assertion` +
        `${a.auditTitle ? ` (${a.auditTitle}: ${a.auditDocumentationLink})` : ''}\n` +
        `Expected ${a.operator} ${a.expected}, but found ${a.actual}`
      )
    })
    const text =
      `${assertions.length} result${assertions.length === 1 ? '' : 's'} for ${url}\n` +
      `${link ? `Report: ${link}\n` : ''}\n` +
      assertionsText.join('\n\n')
    core.setFailed(text)
  })
}
