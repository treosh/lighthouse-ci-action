const { groupBy, find, get, findLast } = require('lodash')
const { IncomingWebhook } = require('@slack/webhook')
const github = require('@actions/github')
const { readFileSync, readdirSync } = require('fs')
const { join } = require('path')

/** @type {string} */
const homeDir = get(process.env, 'HOME', '')
/** @type {string} */
const githubRepo = get(process.env, 'GITHUB_REPOSITORY', '')
/** @type {string} */
const githubSHA = get(process.env, 'GITHUB_SHA', '')

/**
 * @param {{type: 'slack', status: number, slackWebhookUrl: string, githubToken: string, staticDistDir: string}} params
 */
async function run({ type, ...args }) {
  try {
    if (type === 'slack') {
      await slackNotification(args)
    } else {
      console.log('Unknown output type: ', type)
    }
  } catch (e) {
    throw e
  }
}

/**
 * @param {{status: number, slackWebhookUrl: string, githubToken: string, staticDistDir: string}} params
 * @return {Promise<*>}
 */
async function slackNotification({ status, slackWebhookUrl, githubToken, staticDistDir = '.lighthouseci' }) {
  const conclusion = status === 0 ? 'success' : 'failure'
  const webhook = new IncomingWebhook(slackWebhookUrl)
  const color = status === 0 ? 'good' : 'danger'
  const staticDistDirPath = join(homeDir, staticDistDir)
  const LHRNameFromPath = getLHRNameFromPath(staticDistDirPath)

  const assertionResults = readFileSync(join(staticDistDirPath, 'assertion-results.json'))
  const groupedResults = groupBy(JSON.parse(assertionResults.toString()), 'url')

  const attachments = Object.values(groupedResults).map(groupedResult => {
    const results = groupedResult.map(
      /**
       * @param {{auditId: string, auditProperty: string, auditTitle: string, expected: string, operator: string, actual: string, url: string}} res
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

  const gistName = `lhci-action-lhr-${githubRepo.split('/').join('-')}.json`
  const octokit = new github.GitHub(githubToken)
  const gists = await octokit.gists.list()
  const existingGist = findLast(gists.data, gist => Object.keys(gist.files).filter(filename => filename === gistName))
  /** @type {{gist_id?: string, files: {[p: string]: {content: string}}}} */
  const gistParams = {
    files: {
      [gistName]: {
        content: readFileSync(join(staticDistDirPath, LHRNameFromPath)).toString()
      }
    }
  }
  existingGist && (gistParams['gist_id'] = get(existingGist, 'id'))
  /** @type {'update' | 'create'} */
  const gistAction = existingGist ? 'update' : 'create'

  const [pulls, gist] = await Promise.all([
    octokit.pulls.list({
      owner: githubRepo.split('/')[0],
      repo: githubRepo.split('/')[1]
    }),
    octokit.gists[gistAction](gistParams)
  ])

  const gistId = get(gist, 'data.id', '').split('/')
  const gistSHA = get(gist, ['data', 'history', 0, 'version'], '')
  const pullRequest = find(get(pulls, 'data', []), ['head.sha', githubSHA])
  const pullRequestUrl = get(pullRequest, 'html_url', '')
  const shaURL = ['https://github.com/', githubRepo, 'commit', githubSHA].join('/')
  const changesTitle = pullRequestUrl
    ? `Pull Request ${conclusion} - <${pullRequestUrl}|View on GitHub>`
    : `Changes ${conclusion} - <${shaURL}| View SHA Changes>`

  return webhook.send({
    attachments: [
      {
        pretext: 'GitHub Actions / Lighthouse Report',
        title: changesTitle,
        color
      },
      ...attachments,
      {
        title: `View Details`,
        title_link: `https://googlechrome.github.io/lighthouse/viewer/?gist=${gistId}/${gistSHA}`,
        color
      }
    ]
  })
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
