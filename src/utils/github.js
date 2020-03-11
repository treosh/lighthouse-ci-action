const { orderBy } = require('lodash')
const github = require('@actions/github')
const core = require('@actions/core')
const { getLinksByUrl, getAssertionsByUrl } = require('./lhci-helpers')

/**
 * Create Github Comment.
 * https://github.com/actions/toolkit/blob/master/docs/github-package.md#sending-requests-to-the-github-api
 *
 * @param {{ githubToken: string, resultsPath: string }} params
 */

exports.sendGithubComment = function sendGithubComment({ githubToken, resultsPath }) {
  core.info('Running Github notification')
  core.info('Context: ' + JSON.stringify(github.context, null, '  '))
  const client = new github.GitHub(githubToken)
  const { issue } = github.context

  if (github.context.payload.action !== 'opened') {
    core.info('No issue or pull request was opened, skipping')
    return
  }

  const params = {
    owner: issue.owner,
    repo: issue.repo,
    issue_number: issue.number,
    body: generateWelcomeMessage(resultsPath)
  }

  core.info(JSON.stringify(params, null, '  '))
  return client.issues.createComment(params)
}

const emojiTab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

/**
 * Generate
 * 
 * Current format:

Failed to check assertions against of 1 URL.
#### 2 results for https://treo.sh/ – [[report]()] [[compare]()]
❌ `offscreen-images` failure for `maxLength` assertion: defer offscreen images [[...]](https://web.dev/offscreen-images)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Expected **<= 0**, but found **1**

⚠️ `mainthread-work-breakdown` warning for `minScore` assertion: minimize main-thread work [[...]](https://web.dev/mainthread-work-breakdown)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Expected **>=0.9**, but found **0.83**

* @param {string} resultsPath
*/

function generateWelcomeMessage(resultsPath) {
  const linksByUrl = getLinksByUrl(resultsPath)
  const assertionsByUrl = getAssertionsByUrl(resultsPath)
  const totalUrls = Object.keys(assertionsByUrl).length

  const assertionTexts = Object.entries(assertionsByUrl).map(([url, assertions]) => {
    const link = linksByUrl[url]
    const sortedAssertions = orderBy(assertions, a => (a.level === 'error' ? 0 : 1))
    const assertionsText = sortedAssertions.map(a => {
      const emoji = a.level === 'error' ? '❌' : '⚠️'
      return (
        `${emoji} \`${a.auditId}\` ${a.level === 'error' ? 'failure' : 'warning'} for \`${a.name}\` assertion – ` +
        `${emojiTab}${a.auditTitle} [[...]](${a.auditDocumentationLink})\n` +
        `${emojiTab}Expected **${a.operator} ${a.expected}**, but found **${a.actual}**`
      )
    })
    return (
      `#### ${assertions.length} result${assertions.length === 1 ? '' : 's'} for ${url}` +
      `${link ? `– [[report](${link})]` : ''}\n` +
      assertionsText.join('\n')
    )
  })

  return (
    `Failed to check assertions against of ${totalUrls} URL${totalUrls === 1 ? '' : 's'}.\n` + assertionTexts.join('\n')
  )
}
