const { groupBy, find, get, isEmpty, head } = require('lodash')
const github = require('@actions/github')
const { readFile, readdirSync, existsSync } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const pReadFile = promisify(readFile)

/** @typedef {{ sha: string, pullRequest: string }} ChangesURL */
/** @typedef {{ id: string, sha: string, url: string }} Gist */
/** @typedef {{ auditId: string, auditProperty: string, auditTitle: string, operator: string, expected: string, actual: string, url: string }} LHResult */

const githubRepo = process.env.GITHUB_REPOSITORY || ''
const githubSha = process.env.GITHUB_SHA || ''
const reportTitle = 'Lighthouse CI Action'
const resultsDirPath = join(process.cwd(), '.lighthouseci')
const lhAssertResultsPath = join(resultsDirPath, 'assertion-results.json')

// https://user-images.githubusercontent.com/158189/76324191-ef4c2880-62e5-11ea-8bf1-ac5ff7571eef.png

/**
 * Send notifications.
 *
 * @param {{ githubToken: string, isSuccess: boolean }} params
 */

exports.createGithubCheck = async function sendNotifications({ githubToken, isSuccess }) {
  const [groupedResults, changesURL, gists] = await Promise.all([getGroupedAssertionResultsByUrl()])

  console.log('Running Github notification')

  const octokit = new github.GitHub(githubToken)
  const checkBody = {
    owner: githubRepo.split('/')[0],
    repo: githubRepo.split('/')[1],
    head_sha: githubSha,
    name: reportTitle,
    status: /** @type {'completed'} */ ('completed'),
    conclusion: /** @type {'success' | 'failure'} */ (isSuccess ? 'success' : 'failure'),
    output: getSummaryMarkdownOutput({ status, changesURL, groupedResults, gists })
  }

  // await octokit.checks.createSuite({
  //   owner: githubRepo.split('/')[0],
  //   repo: githubRepo.split('/')[1],
  //   head_sha: githubSha
  // })

  await octokit.checks.create(checkBody)
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

async function getGroupedAssertionResultsByUrl() {
  if (!existsSync(lhAssertResultsPath)) {
    console.log(`No LH Assert results in ${lhAssertResultsPath}`)
    return {}
  }
  const assertionResultsBuffer = await pReadFile(lhAssertResultsPath)
  const assertionResults = /** @type {[LHResult]} **/ JSON.parse(assertionResultsBuffer.toString())
  return groupBy(assertionResults, 'url')
}

/**
 * @param {{ githubToken?: string }} params
 * @return {Promise<ChangesURL>}
 */

async function getChangesUrl({ githubToken }) {
  const shaChangesURL = ['https://github.com', githubRepo, 'commit', githubSha].join('/')
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

  const pullRequest = find(get(pulls, 'data', []), ['head.sha', githubSha])

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
 * @param {Gist} gist
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
