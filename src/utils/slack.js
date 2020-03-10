const { IncomingWebhook } = require('@slack/webhook')
const core = require('@actions/core')
const { join } = require('path')
const fs = require('fs')
const { groupBy } = require('lodash')

/** @typedef {{ name: string, expected: number, actual: number, values: number[], operator: string, passed: boolean,
                auditId: string, level: 'warn' | 'error', url: string, auditTitle: string, auditDocumentationLink: string }} LHCIAssertResult */

/**
 * Send Slack Notification as an incoming webhook.
 *
 * @param {{ slackWebhookUrl: string, resultsPath: string, isSuccess: boolean }} params
 */

exports.sendSlackNotification = async function sendSlackNotification(params) {
  core.info('Running Slack notification')
  const { slackWebhookUrl, isSuccess, resultsPath } = params
  if (!isSuccess) return // ignore success checks for now

  const webhook = new IncomingWebhook(slackWebhookUrl, {
    username: 'Lighthouse CI Action',
    icon_url: 'https://user-images.githubusercontent.com/54980164/75099367-8bc5b980-55c9-11ea-9e10-2a6ee69e8e70.png' // action Logo
  })

  /** @type {Object<string,string>} **/
  const links = JSON.parse(fs.readFileSync(join(resultsPath, 'links.json'), 'utf8'))
  /** @type {LHCIAssertResult[]} **/
  const assertionResults = JSON.parse(fs.readFileSync(join(resultsPath, 'assertion-results.json'), 'utf8'))
  const assertionResultsByUrl = groupBy(assertionResults, 'url')

  // const color = 'danger'
  // const conclusion = 'failure'
  // const changesTitle = changesURL.pullRequest
  //   ? `Pull Request ${conclusion} - <${changesURL.pullRequest} | View on GitHub>`
  //   : `Changes ${conclusion} - <${changesURL.sha} | View SHA Changes>`
  // const attachments = formatAssertResults({ groupedResults, status, gists })

  return webhook.send({
    blocks: [
      {
        type: 'section'
      }
    ]
  })
}
