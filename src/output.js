const { groupBy, find, get, findLast, isEmpty } = require('lodash')
const { IncomingWebhook } = require('@slack/webhook')
const github = require('@actions/github')
const { readFile, readdirSync, existsSync } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const input = require('./input')

const pReadFile = promisify(readFile)

/**
 * @typedef {Object} ChangesURL
 * @property {string} sha
 * @property {string} pullRequest
 *
 * @typedef {Object} Gist
 * @property {string} [id]
 * @property {string} [sha]
 *
 * @typedef {Object} LHResult
 * @property {string} auditId
 * @property {string} auditProperty
 * @property {string} auditTitle
 * @property {string} expected
 * @property {string} operator
 * @property {string} actual
 * @property {string} url
 *
 * @tod fix the type
 * @typedef {*} LHResultsByURL
 */

/** @type {string} */
const githubRepo = get(process.env, 'GITHUB_REPOSITORY', '')
const githubSHA = get(process.env, 'GITHUB_SHA', '')
const reportTitle = 'Lighthouse Report'
const resultsDirPath = join(process.cwd(), '.lighthouseci')
const lhAssertResultsPath = join(resultsDirPath, 'assertion-results.json')

/**
 * @param {{ status: number }} params
 */
async function run({ status }) {
  try {
    const {
      slackWebhookUrl,
      githubToken,
      githubNotification: githubNotificationEnabled,
      slackNotification: slackNotificationEnabled
    } = input
    const shouldRunOutput = input.logLevel === 'info' || (input.logLevel === 'error' && status)

    if (!shouldRunOutput) {
      return Promise.resolve()
    }

    const slackEnabled = slackNotificationEnabled && slackWebhookUrl
    const githubEnabled = githubNotificationEnabled && githubToken

    /**
     * @type {[ LHResultsByURL, ChangesURL, Gist ]}
     */
    const [groupedResults, changesURL, gist] = await Promise.all([
      getGroupedAssertionResultsByURL(),
      getChangesUrl({ githubToken }),
      // keep uploading as part of Promise all instead of separate request
      uploadResultsToGist({ githubToken })
    ])

    const slackData = { status, slackWebhookUrl, changesURL, gist, groupedResults }
    const githubData = { status, githubToken, changesURL, gist, groupedResults }

    if (githubEnabled && slackEnabled) {
      await Promise.all([slackNotification(slackData), githubNotification(githubData)])
    } else if (githubEnabled) {
      await githubNotification(githubData)
    } else if (slackEnabled) {
      await slackNotification(slackData)
    } else {
      // @todo log notification and link to doc?
    }
  } catch (e) {
    console.log(e)
    throw e
  }
}

/**
 * @param {{status: number, slackWebhookUrl?: string, changesURL: ChangesURL, gist: Gist, groupedResults: LHResultsByURL }} params
 * @return {Promise<*>}
 */
async function slackNotification({ status, slackWebhookUrl = '', changesURL, groupedResults, gist }) {
  console.log('Running Slack notification')

  const webhook = new IncomingWebhook(slackWebhookUrl)
  const color = status === 0 ? 'good' : 'danger'
  const conclusion = status === 0 ? 'success' : 'failure'
  const changesTitle = changesURL.pullRequest
    ? `Pull Request ${conclusion} - <${changesURL.pullRequest} | View on GitHub>`
    : `Changes ${conclusion} - <${changesURL.sha} | View SHA Changes>`
  const attachments = formatAssertResults({ groupedResults, status })
  const reportURL = getLHReportURL(gist)
  const reportUrlAttachment = reportURL
    ? {
        title: `View Detailed Lighthouse Report`,
        title_link: reportURL,
        color
      }
    : {}

  return webhook.send({
    attachments: [
      {
        pretext: `GitHub Actions / ${reportTitle}`,
        title: changesTitle,
        color
      },
      ...attachments,
      { ...reportUrlAttachment }
    ]
  })
}

/**
 * @param {{status: number, githubToken?: string, changesURL: ChangesURL, gist: Gist, groupedResults: LHResultsByURL }} params
 * @return {Promise<*>}
 */
async function githubNotification({ status, githubToken = '', changesURL, gist, groupedResults }) {
  console.log('Running Github notification')

  const conclusion = status === 0 ? 'success' : 'failure'
  const octokit = new github.GitHub(githubToken)
  const checkBody = {
    owner: githubRepo.split('/')[0],
    repo: githubRepo.split('/')[1],
    head_sha: githubSHA,
    name: reportTitle,
    status: 'completed',
    conclusion,
    output: getSummaryMarkdownOutput({ status, changesURL, groupedResults, gist })
  }

  await octokit.checks.createSuite({
    owner: githubRepo.split('/')[0],
    repo: githubRepo.split('/')[1],
    head_sha: githubSHA
  })

  await octokit.checks.create(checkBody)
}

/**
 * @return {Promise<*>}
 */
async function getGroupedAssertionResultsByURL() {
  if (!existsSync(lhAssertResultsPath)) return []

  const assertionResultsBuffer = await pReadFile(lhAssertResultsPath)
  /** @type {[LHResult]} **/
  const assertionResults = JSON.parse(assertionResultsBuffer.toString())
  return groupBy(assertionResults, 'url')
}

/**
 * @param {{ githubToken?: string }} params
 * @return {Promise<Gist>}
 */
async function uploadResultsToGist({ githubToken }) {
  if (!githubToken) {
    return {}
  }

  const LHRNameFromPath = getLHRNameFromPath(resultsDirPath)
  const results = await pReadFile(join(resultsDirPath, LHRNameFromPath))

  const gistName = `lhci-action-lhr-${githubRepo.split('/').join('-')}.json`
  const octokit = new github.GitHub(githubToken)
  const gists = await octokit.gists.list()
  const existingGist = findLast(gists.data, gist => Object.keys(gist.files).filter(filename => filename === gistName))

  /** @type {{gist_id?: string, files: {[p: string]: {content: string}}}} */
  const gistParams = {
    files: {
      [gistName]: {
        content: results.toString()
      }
    }
  }
  existingGist && (gistParams['gist_id'] = get(existingGist, 'id'))
  /** @type {'update' | 'create'} */
  const gistAction = existingGist ? 'update' : 'create'
  const gist = await octokit.gists[gistAction](gistParams)

  return {
    id: get(gist, 'data.id', '').split('/'),
    sha: get(gist, ['data', 'history', 0, 'version'], '')
  }
}

/**
 * @param {{ githubToken?: string }} params
 * @return {Promise<ChangesURL>}
 */
async function getChangesUrl({ githubToken }) {
  const shaChangesURL = ['https://github.com', githubRepo, 'commit', githubSHA].join('/')

  if (!githubToken) {
    return {
      pullRequest: '',
      sha: shaChangesURL
    }
  }

  const octokit = new github.GitHub(githubToken)

  const pulls = await octokit.pulls.list({
    owner: githubRepo.split('/')[0],
    repo: githubRepo.split('/')[1]
  })

  const pullRequest = find(get(pulls, 'data', []), ['head.sha', githubSHA])

  return {
    pullRequest: get(pullRequest, 'html_url', ''),
    sha: shaChangesURL
  }
}

/**
 * @param {{ groupedResults: LHResultsByURL, status: number }} params
 * @return {{color: *, text: string, fields: *}[]}
 */
function formatAssertResults({ groupedResults, status }) {
  const color = status === 0 ? 'good' : 'danger'

  return Object.values(groupedResults).map(groupedResult => {
    const results = groupedResult.map(
      /**
       * @param {LHResult} res
       * @todo typedef for return object
       * @return {{title: string, value: string}}
       */
      res => ({
        title: `${res.auditId}.${res.auditProperty}`,
        value: `${res.auditTitle} \n _Expected ${res.expected} ${
          res.operator === '<=' ? ' less then' : ' greater than'
        } actual ${res.actual}_`
      })
    )

    const fields = results.slice(0, 2)
    fields.length > 0 &&
      fields.push({
        title: '...',
        value: ''
      })

    return {
      text: `${groupedResult.length + 1} result(s) for ${groupedResult[0].url}`,
      color,
      fields
    }
  })
}

/**
 * @param {{ status: number, changesURL: ChangesURL, gist: Gist, groupedResults: LHResultsByURL }} params
 * @return {{summary: string, title: string}}
 */
function getSummaryMarkdownOutput({ status, changesURL, groupedResults, gist }) {
  const title = changesURL.pullRequest
    ? `Pull Request - [View on GitHub](${changesURL.pullRequest})`
    : `Changes - [View SHA Changes](${changesURL.sha})`
  const summaryResults = formatAssertResults({ groupedResults, status })
  /**
   * @param {{ title: string, value: string }[]} fields
   * @return {string}
   */
  const fieldsTemplate = fields => {
    return fields.map(field => `**${field.title}**\n${field.value}`.trim()).join('\n')
  }
  /**
   *
   * @param {{ text: string, fields: { title: string, value: string}[] }[]} summaryResults
   * @return {string}
   */
  const summaryResultsTempalte = summaryResults => {
    return summaryResults.map(result => `${result.text}\n${fieldsTemplate(result.fields)}`.trim()).join('')
  }
  const reportURL = getLHReportURL(gist)
  const detailsTemplate = `${reportURL ? `\n[View Detailed Lighthouse Report](${reportURL})` : '\n'}`

  const summary = `
${summaryResultsTempalte(summaryResults)}
${detailsTemplate}
`

  return {
    title,
    summary
  }
}

/**
 * @param { Gist } gist
 * @return {string}
 */
function getLHReportURL(gist) {
  return isEmpty(gist) ? '' : `https://googlechrome.github.io/lighthouse/viewer/?gist=${gist.id}/${gist.sha}`
}

/**
 * @param {string} path
 * @return {string}
 */
function getLHRNameFromPath(path = '') {
  let dir = readdirSync(path)
  return (
    dir.find(
      /**
       * @param {string} fileName
       * @return { RegExpMatchArray | null }
       */
      (fileName = '') => {
        return fileName.match(/lhr-\d+\.json/g)
      }
    ) || ''
  )
}

module.exports = {
  run
}
