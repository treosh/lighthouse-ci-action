const { flatten } = require('lodash')
const { IncomingWebhook } = require('@slack/webhook')
const core = require('@actions/core')
const { getLinksByUrl, getAssertionsByUrl } = require('./lhci-helpers')

/**
 * Send Slack Notification as an incoming webhook.
 *
 * @param {{ slackWebhookUrl: string, resultsPath: string }} params
 */

exports.sendSlackNotification = function sendSlackNotification({ slackWebhookUrl, resultsPath }) {
  core.info('Send Slack notification')

  const webhook = new IncomingWebhook(slackWebhookUrl, {
    username: 'Lighthouse CI Action',
    icon_emoji: ':small_red_triangle:'
  })
  const params = {
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: generateIntro(resultsPath) } },
      ...generateAssertionBlocks(resultsPath)
    ]
  }

  core.info(JSON.stringify(params, null, '  '))
  return webhook.send(params)
}

/**
 * Generate intro text, using env variables:
 * https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables
 *
 * @param {string} resultsPath
 */

function generateIntro(resultsPath) {
  const totalUrls = Object.keys(getAssertionsByUrl(resultsPath)).length
  const repo = process.env.GITHUB_REPOSITORY || 'unknown/repository'
  const runId = process.env.GITHUB_RUN_ID || 0
  const runIndex = process.env.GITHUB_RUN_NUMBER || 1
  const workflow = process.env.GITHUB_WORKFLOW || 'Workflow'
  const actionId = process.env.GITHUB_ACTION || 'no-id'
  const author = process.env.GITHUB_ACTOR || 'no-name'
  const ref = process.env.GITHUB_REF || 'refs/heads/master'
  const branch = ref.substr(ref.lastIndexOf('/') + 1)
  return (
    `Failed to check assertions against of ${totalUrls} URL${totalUrls === 1 ? '' : 's'}\n\n` +
    `Action: <https://github.com/${repo}/runs/${runId} | ${workflow}/${actionId} #${runIndex}>\n` +
    `Repository: <https://github.com/${repo} | ${repo} (${branch})>\n` +
    `Author: ${author}`
  )
}

const errorImgUrl = 'https://user-images.githubusercontent.com/158189/76324191-ef4c2880-62e5-11ea-8bf1-ac5ff7571eef.png'
const warnImgurl = 'https://user-images.githubusercontent.com/158189/76411224-a356bd80-6391-11ea-8a58-8003213a7afa.png'

/**
 * Generate Blocks for each assertion
 * https://api.slack.com/reference/block-kit/block-elements
 *
 * @param {string} resultsPath
 */

function generateAssertionBlocks(resultsPath) {
  const linksByUrl = getLinksByUrl(resultsPath)
  const assertionsByUrl = getAssertionsByUrl(resultsPath)

  return flatten(
    Object.entries(assertionsByUrl).map(([url, assertions]) => {
      const link = linksByUrl[url]
      return [
        { type: 'divider' },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${assertions.length} result${assertions.length === 1 ? '' : 's'} for ${url}`
          },
          ...(link
            ? {
                accessory: { type: 'button', text: { type: 'plain_text', text: 'View Report', emoji: true }, url: link }
              }
            : {})
        },
        ...assertions.map(a => {
          const text =
            `*${a.auditId}* ${a.level === 'error' ? 'failure' : 'warning'} for *${a.name}* assertion\n` +
            `${a.auditTitle} <${a.auditDocumentationLink} | [...]>\n` +
            `Expected * ${a.operator} ${a.expected}*, but found *${a.actual}*`
          return {
            type: 'section',
            text: { type: 'mrkdwn', text },
            accessory: {
              type: 'image',
              image_url: a.level === 'error' ? errorImgUrl : warnImgurl,
              alt_text: a.level
            }
          }
        })
      ]
    })
  )
}
