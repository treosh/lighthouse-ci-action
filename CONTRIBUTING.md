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
INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-static-dist-dir.yml" INPUT_RUNS="1" node src/index.js

# run with Slack integration
# some of env variables mocked from GitHub ENV - https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables
INPUT_URLS="https://alekseykulikov.com/" INPUT_BUDGETPATH=".github/lighthouse/impossible-budget.json" INPUT_RUNS="1" INPUT_SLACKWEBHOOKURL="custom-webhook-url" INPUT_GISTUPLOADTOKEN="github-token" INPUT_GITHUBTOKEN="github-token" INPUT_NOTIFICATIONS='slack' GITHUB_REPOSITORY="repo-name" GITHUB_SHA="githib-pr-head-sha" node src/index.js
INPUT_URLS="https://alekseykulikov.com/" INPUT_BUDGETPATH=".github/lighthouse/impossible-budget.json" INPUT_RUNS="1" INPUT_SLACKWEBHOOKURL="custom-webhook-url" INPUT_GISTUPLOADTOKEN="github-github" INPUT_GITHUBTOKEN="github-token" INPUT_NOTIFICATIONS='slack' GITHUB_REPOSITORY="repo-name" GITHUB_SHA="githib-pr-head-sha" node src/index.js
```

### Slack notification

Images and failure/warning images are stored in (assets)[./assets] folder. Original SVGs are downloaded from https://feathericons.com/, like all Github Action icons.

```js
GITHUB_REPOSITORY=treosh/lighthouse-ci-action GITHUB_ACTION=build GITHUB_ACTOR=alekseykulikov node -e "require('./src/utils/slack').sendSlackNotification({ resultsPath: '/Users/aleksey/code/treosh/website/.lighthouseci', slackWebhookUrl: 'https://hooks.slack.com/..' })"
```

Use Block Kit Builder to design the notification, [current version](<https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Failed%20to%20check%20assertions%20against%20of%202%20URLs.%5Cn%5Cn%20Action%3A%20%3Chttps%3A%2F%2Fgithub.com%2Ftreosh%2Flighthouse-ci-action%2Fruns%2F490360861%20%7C%20CI%2Fbuild%20%2345%3E%5CnRepository%3A%20%3Chttps%3A%2F%2Fgithub.com%2Ftreosh%2Flighthouse-ci-action%20%7C%20treosh%2Flighthouse-ci-action%20(master)%3E%5CnAuthor%3A%20alekseykulikov%22%7D%7D%2C%7B%22type%22%3A%22divider%22%7D%2C%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%222%20results%20for%20https%3A%2F%2Ftreo.sh%2F%22%7D%2C%22accessory%22%3A%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22View%20Report%22%2C%22emoji%22%3Atrue%7D%2C%22url%22%3A%22https%3A%2F%2Ftreo.sh%2F%22%7D%7D%2C%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*offscreen-images*%20failure%20for%20*maxLength*%20assertion%5CnDefer%20offscreen%20images%20%3Chttps%3A%2F%2Fweb.dev%2Foffscreen-images%20%7C%20%5B...%5D%3E%5CnExpected%20*%3C%3D%200*%2C%20but%20found%20*1*%22%7D%2C%22accessory%22%3A%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fuser-images.githubusercontent.com%2F158189%2F76324191-ef4c2880-62e5-11ea-8bf1-ac5ff7571eef.png%22%2C%22alt_text%22%3A%22failure%22%7D%7D%2C%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*max-potential-fid*%20warning%20for%20*minScore*%20assertion%5CnMax%20Potential%20First%20Input%20Delay%20%3Chttps%3A%2F%2Fdevelopers.google.com%2Fweb%2Fupdates%2F2018%2F05%2Ffirst-input-delay%20%7C%20%5B...%5D%3E%5CnExpected%20*%20%3E%3D%200.8*%2C%20but%20found%20*0.25*%22%7D%2C%22accessory%22%3A%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fuser-images.githubusercontent.com%2F158189%2F76411224-a356bd80-6391-11ea-8a58-8003213a7afa.png%22%2C%22alt_text%22%3A%22warning%22%7D%7D%2C%7B%22type%22%3A%22divider%22%7D%2C%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%221%20result%20for%20https%3A%2F%2Ftreo.sh%2Fpricing%22%7D%2C%22accessory%22%3A%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22View%20Report%22%2C%22emoji%22%3Atrue%7D%2C%22url%22%3A%22https%3A%2F%2Ftreo.sh%2Fpricing%22%7D%7D%2C%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*uses-passive-event-listeners*%20warning%20for%20*minScore*%20assertion%5CnDoes%20not%20use%20passive%20listeners%20to%20improve%20scrolling%20performance%20%3Chttps%3A%2F%2Fweb.dev%2Fuses-passive-event-listeners%20%7C%20%5B...%5D%3E%5CnExpected%20*%20%3E%3D%201*%2C%20but%20found%20*0*%22%7D%2C%22accessory%22%3A%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fuser-images.githubusercontent.com%2F158189%2F76411224-a356bd80-6391-11ea-8a58-8003213a7afa.png%22%2C%22alt_text%22%3A%22warning%22%7D%7D%5D>)
