# How to Contribute

First of all, thank you for your interest in `treosh/lighthouse-ci-action`!
We'd love to accept your patches and contributions!

### Setup

```bash
# install deps
yarn install

# ensure all tests pass
yarn test
```

### Local testing

```bash
# run locally, use INPUT_* notation to pass arguments
INPUT_URLS="https://example.com/" INPUT_RUNS="1" node src/index.js

# run many urls
INPUT_URLS="https://example.com/
 https://example.com/blog" INPUT_RUNS="1" node src/index.js

# fail with assertions
INPUT_URLS="https://example.com/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-assertions.json" INPUT_RUNS="1" node src/index.js

# run with custom config
INPUT_URLS="https://example.com/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-custom-config.json" INPUT_RUNS="1" node src/index.js

# run with Chrome flags
INPUT_URLS="https://example.com/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-chrome-flags.json" INPUT_RUNS="1" node src/index.js

# debug custom headers
python script/simple-server.py # start basic server in a separate tab
INPUT_URLS="http://localhost:3000/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-extra-headers.json" INPUT_RUNS="1" node src/index.js # run and see headers output

# run locally, with env var interpolation
python script/simple-server.py # start basic server in a separate tab
PAGE="src/" INPUT_URLS="http://localhost:3000/\$PAGE" INPUT_RUNS="1" node src/index.js

# run with a static dist dir
INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-static-dist-dir.json" INPUT_RUNS="1" node src/index.js

# run with Slack integration
# some of env variables mocked from GitHub ENV - https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables
INPUT_URLS="https://alekseykulikov.com/" INPUT_BUDGETPATH=".github/lighthouse/budget.json" INPUT_RUNS="1" INPUT_SLACKWEBHOOKURL="custom-webhook-url" INPUT_PERSONALGITHUBTOKEN="github-token" INPUT_APPLICATIONGITHUBTOKEN="github-token" INPUT_GITHUBNOTIFICATION=1 INPUT_SLACKNOTIFICATION=1 GITHUB_REPOSITORY="repo-name" GITHUB_SHA="githib-pr-head-sha" node src/index.js

> INPUT_APPLICATIONGITHUBTOKEN requers setup a Github Application etc.
```
