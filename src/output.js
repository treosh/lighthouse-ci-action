const { groupBy, find, get, isEmpty, head } = require('lodash')
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
 * @property {string} [url]
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
const reportTitle = 'Lighthouse CI Action'
const resultsDirPath = join(process.cwd(), '.lighthouseci')
const lhAssertResultsPath = join(resultsDirPath, 'assertion-results.json')

/**
 * @param {{ status: number }} params
 */
async function sendNotifications({ status }) {
  try {
    const { slackWebhookUrl, applicationGithubToken, personalGithubToken } = input
    const shouldRunOutput = input.logLevel === 'info' || (input.logLevel === 'error' && status)

    if (!shouldRunOutput) {
      return Promise.resolve()
    }

    const slackEnabled = slackWebhookUrl
    const githubEnabled = applicationGithubToken

    /**
     * @type {[ LHResultsByURL, ChangesURL, Gist[] ]}
     */
    const [groupedResults, changesURL, gists] = await Promise.all([
      getGroupedAssertionResultsByURL(),
      getChangesUrl({ githubToken: personalGithubToken }),
      // keep uploading as part of Promise all instead of separate request
      uploadResultsToGist({ githubToken: personalGithubToken })
    ])

    const slackData = { status, slackWebhookUrl, changesURL, gists, groupedResults }
    const githubData = { status, githubToken: applicationGithubToken, changesURL, gists, groupedResults }

    if (githubEnabled) {
      try {
        await githubNotification(githubData)
        console.log('Github notification successfully sent')
      } catch (e) {
        console.log('Failed to send Github notification', e)
      }
    }

    if (slackEnabled) {
      try {
        await slackNotification(slackData)
        console.log('Slack notification successfully sent')
      } catch (e) {
        console.log('Failed to send Slack notification', e)
      }
    }
  } catch (e) {
    console.log(e)
    throw e
  }
}

/**
 * @param {{status: number, slackWebhookUrl?: string, changesURL: ChangesURL, gists: Gist[], groupedResults: LHResultsByURL }} params
 * @return {Promise<*>}
 */
async function slackNotification({ status, slackWebhookUrl = '', changesURL, groupedResults, gists }) {
  console.log('Running Slack notification')

  const webhook = new IncomingWebhook(slackWebhookUrl, {
    icon_url: 'https://user-images.githubusercontent.com/54980164/75099367-8bc5b980-55c9-11ea-9e10-2a6ee69e8e70.png'
  })
  const color = status === 0 ? 'good' : 'danger'
  const conclusion = status === 0 ? 'success' : 'failure'
  const changesTitle = changesURL.pullRequest
    ? `Pull Request ${conclusion} - <${changesURL.pullRequest} | View on GitHub>`
    : `Changes ${conclusion} - <${changesURL.sha} | View SHA Changes>`
  const attachments = formatAssertResults({ groupedResults, status, gists })

  return webhook.send({
    attachments: [
      {
        pretext: reportTitle,
        title: changesTitle,
        color
      },
      ...attachments
    ]
  })
}

/**
 * @param {{status: number, githubToken?: string, changesURL: ChangesURL, gists: Gist[], groupedResults: LHResultsByURL }} params
 * @return {Promise<*>}
 */
async function githubNotification({ status, githubToken = '', changesURL, gists, groupedResults }) {
  console.log('Running Github notification')

  const octokit = new github.GitHub(githubToken)
  const checkBody = {
    owner: githubRepo.split('/')[0],
    repo: githubRepo.split('/')[1],
    head_sha: githubSHA,
    name: reportTitle,
    status: /** @type {'completed'} */ ('completed'),
    conclusion: /** @type {'success' | 'failure'} */ (status === 0 ? 'success' : 'failure'),
    output: getSummaryMarkdownOutput({ status, changesURL, groupedResults, gists })
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
  if (!existsSync(lhAssertResultsPath)) {
    console.log(`No LH Assert results in ${lhAssertResultsPath}`)
    return []
  }

  const assertionResultsBuffer = await pReadFile(lhAssertResultsPath)
  /** @type {[LHResult]} **/
  const assertionResults = JSON.parse(assertionResultsBuffer.toString())
  return groupBy(assertionResults, 'url')
}

/**
 * @param {{ githubToken?: string }} params
 * @return {Promise<Gist[]>}
 */
function uploadResultsToGist({ githubToken }) {
  if (!githubToken) {
    return Promise.resolve([{}])
  }

  const LHRNamesFromPath = getLHRNameFromPath(resultsDirPath)
  return Promise.all(
    LHRNamesFromPath.map(
      async LHRNameFromPath => await uploadResultToGist({ githubToken, resultPath: LHRNameFromPath })
    )
  )
}

/**
 * @param {{ githubToken?: string, resultPath: string }} params
 * @return {Promise<Gist>}
 */
async function uploadResultToGist({ githubToken, resultPath }) {
  if (!githubToken || !resultPath) {
    return {}
  }

  const resultsBuffer = await pReadFile(join(resultsDirPath, resultPath))
  const results = JSON.parse(resultsBuffer.toString())
  const url = get(results, 'finalUrl', '')
  const urlPrefixName = url.replace(/(^\w+:|^)\/\//, '')
  const gistName = `lhci-action-lhr-${githubRepo.split('/').join('-')}-${urlPrefixName
    .split('/')
    .filter(Boolean)
    .join('-')}.json`
  const octokit = new github.GitHub(githubToken)
  const gists = await octokit.gists.list()
  const existingGist = find(
    gists.data,
    gist => Object.keys(gist.files).filter(filename => filename === gistName).length
  )
  const gistParams = {
    files: {
      [gistName]: {
        content: resultsBuffer.toString()
      }
    }
  }
  const gist = await (existingGist
    ? octokit.gists.update({ ...gistParams, gist_id: get(existingGist, 'id') })
    : octokit.gists.create(gistParams))

  return {
    url,
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
 * @param {{ groupedResults: LHResultsByURL, gists: Gist[], status: number }} params
 * @return {{color: *, text: string, fields: *}[]}
 */
function formatAssertResults({ groupedResults, status, gists }) {
  const color = status === 0 ? 'good' : 'danger'

  return Object.values(groupedResults).reduce((acc, groupedResult) => {
    const resultUrl = get(head(groupedResult), 'url', '')
    const gist = find(gists, ({ url }) => url === resultUrl) || {}

    const fields = groupedResult.map(
      /**
       * @param {LHResult} res
       * @todo typedef for return object
       * @return {{title: string, value: string}}
       */
      res => {
        const title = res.auditProperty ? `${res.auditId}.${res.auditProperty}` : res.auditId
        return {
          title,
          value: `${res.auditTitle} \n _Expected ${res.expected} ${
            res.operator === '<=' ? ' less then' : ' greater than'
          } actual ${res.actual}_`
        }
      }
    )

    const reportURL = getLHReportURL(gist)
    const reportUrlField = reportURL
      ? {
          title: `View Detailed Lighthouse Report`,
          title_link: reportURL,
          color
        }
      : {}

    acc.push({
      text: `${groupedResult.length} result(s) for ${resultUrl}`,
      color,
      fields
    })
    acc.push(reportUrlField)
    return acc
  }, [])
}

/**
 * @param {{ status: number, changesURL: ChangesURL, gists: Gist[], groupedResults: LHResultsByURL }} params
 * @return {{summary: string, title: string}}
 */
function getSummaryMarkdownOutput({ status, changesURL, groupedResults, gists }) {
  const conclusion = status === 0 ? 'success' : 'failure'
  const title = changesURL.pullRequest ? `Pull Request ${conclusion}` : `Changes ${conclusion}`
  const changesLink = changesURL.pullRequest
    ? `[View on GitHub](${changesURL.pullRequest})`
    : `[View SHA Changes](${changesURL.sha})`
  const summaryResults = formatAssertResults({ groupedResults, gists, status })

  /**
   * @param {{ fields?: { title: string, value: string}[], title_link?: string, title?: string }} params
   * @return {string}
   */
  const fieldsTemplate = ({ fields, title_link, title }) => {
    if (fields) {
      let details = ''
      if (fields.length > 2) {
        const detailsFields = [...fields]
        // make only 2 first results visible
        fields = fields.slice(0, 2)
        // move other results to markdown details section
        detailsFields.splice(0, 2)
        details = fieldsDetailsTemplate(detailsFields)
      }

      return fields
        .map(field => `**${field.title}**\n${field.value}`.trim())
        .join('\n')
        .concat(details)
    }

    if (title_link) {
      return `[${title}](${title_link})`
    }

    return '\n'
  }

  /**
   * @param {{ text?: string }} params
   * @return {string}
   */
  const resultTitle = ({ text }) => {
    return text ? `### ${text}` : ''
  }

  /**
   * @param {{ title: string, value: string}[] } fields
   * @return {string}
   */
  const fieldsDetailsTemplate = fields => {
    return `
      <details> 
        <summary>View more...</summary>
        ${fields.map(field => `**${field.title}**\n${field.value}`.trim()).join('\n')}
      </details>
    `
      .trim()
      .concat('\n')
  }

  /**
   *
   * @param {{ text: string, fields: { title: string, value: string}[] }[]} summaryResults
   * @return {string}
   */
  const summaryResultsTemplate = summaryResults => {
    return summaryResults.map(result => `${resultTitle(result)}\n${fieldsTemplate(result)}`.trim()).join('\n')
  }

  const summary = `
${changesLink}\n
${summaryResultsTemplate(summaryResults)}
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
 * @return {string[]}
 */
function getLHRNameFromPath(path = '') {
  let dir = readdirSync(path)
  return (
    dir
      .filter(
        /**
         * @param {string} fileName
         * @return { boolean }
         */
        (fileName = '') => {
          return !!fileName.match(/lhr-\d+\.json/g)
        }
      )
      .map(
        /**
         * @param {string} fileName
         * @return { string }
         */
        (fileName = '') => {
          const match = fileName.match(/lhr-\d+\.json/g)
          return match ? match[0] : ''
        }
      ) || ['']
  )
}

module.exports = {
  sendNotifications
}
