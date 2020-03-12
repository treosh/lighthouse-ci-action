const { join } = require('path')
const { getAssertionsByUrl } = require('./lhci-helpers')

/**
 * Problem matchers allow to add anotatsion to Action output:
 * https://github.com/actions/toolkit/blob/master/docs/problem-matchers.md
 *
 * LHCI assertion output is designed to be readable by humans, not machines, and it's hard to parse with regexp
 * This method enables lhci.json problem matcher for a single string, examples:
 *
 * .github/workflows/LHCI-assert-on-budget.yml|12|error|https://treo.sh/ -> `resource-summary` failure for `maxNumericValue` assertion, expected **<= 51200**, but found **85071**.
 * .github/workflows/LHCI-urls-interpolation.yml|16|warning|https://treo.sh/ -> `resource-summary` failure for `maxNumericValue` assertion, expected **<= 51200**, but found **85071**.
 *
 * @param {string} resultsPath
 */

exports.runProblemMatchers = function enableProblemMatcher(resultsPath) {
  console.log(`::add-matcher::${join(process.cwd(), '.github/matchers.json')}`)
  const assertionsByUrl = getAssertionsByUrl(resultsPath)
  Object.values(assertionsByUrl).forEach(assertions => {
    assertions.forEach(a => {
      const file = `.github/workflow/${process.env.GITHUB_WORKFLOW || 'unknown'}.yml`
      const line = 1
      const severity = a.level === 'error' ? 'error' : 'warning'
      const message =
        `${a.url} -> \`${a.auditId}\` ${a.level === 'error' ? 'failure' : 'warning'} for \`${a.name}\` assertion, ` +
        `expected **${a.operator} ${a.expected}**, but found **${a.actual}**.`
      console.log(`${file}|${line}|${severity}|${message}`)
    })
  })
  console.log('::remove-matcher owner=lighthouse-ci-action::')
}
