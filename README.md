# Lighthouse CI Action

> Audit URLs using [Lighthouse](https://developers.google.com/web/tools/lighthouse)
> and test performance with [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci).

**Features**:

- ✅ Audit URLs using Lighthouse
- 🎯 Test performance with Lighthouse CI (LHCI) assertions or performance budgets
- 💾 Upload results to LHCI server, Github Gist, or Temporary Public Storage
- ⚙️ Full control over Lighthouse CI config
- 🔔 Receive Slack notifications
- 😻 Use GitHub to see failed checks
- 🚀 Fast action initialization (less than 1 second)

<img align="center" width="1046" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/158189/68597493-58896f80-049d-11ea-97a2-5c4e7eb4285c.png">

## Examples

**Basic example**: run Lighthouse on each push to the repo and save results as action artifacts.

Create `.github/workflows/main.yml` with the list of URLs to audit using Lighthouse.

```yml
name: Lighthouse CI
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Audit URLs using Lighthouse
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: |
            https://example.com/
            https://example.com/blog
          uploadArtifacts: true # save results as artifacts
```

**Advanced example**: run Lighthouse audit for each commit, test performance budgets, and get a detailed error report with results saved in the [public storage](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/cli.md#upload) for a quick debugging.

URLs support interpolation of process env variables so that you can write URLs like:

```yml
name: Lighthouse CI
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse and test budgets
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: |
            https://pr-$PR_NUMBER.staging-example.com/
            https://pr-$PR_NUMBER.staging-example.com/blog
          budgetPath: ./budgets.json
          temporaryPublicStorage: true
          slackWebhookUrl: ${{ secrets.SLACK_WEBHOOK_URL }}
        env:
          PR_NUMBER: ${{ github.event.pull_request.number }}
```

## Inputs

#### `urls`

Provide the list of URLs separated by a new line.
Each URL is audited using the latest version of Lighthouse and Chrome preinstalled on the environment.

```yml
urls: |
  https://example.com/
  https://example.com/blog
  https://example.com/pricing
```

#### `uploadArtifacts` (default: false)

Upload Lighthouse results as [action artifacts](https://help.github.com/en/actions/configuring-and-managing-workflows/persisting-workflow-data-using-artifacts) to persist results. It's a shortuct to using [`actions/upload-artifact`](https://github.com/actions/upload-artifact).

```yml
uploadArtifacts: true
```

#### `temporaryPublicStorage` (default: false)

Upload reports to the [_temporary public storage_](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#collect-lighthouse-results).

> **Note**: As the name implies, this is temporary and public storage. If you're uncomfortable with the idea of your Lighthouse reports being stored
> on a public URL on Google Cloud, use a private [LHCI server](#serverBaseUrl) or [Gist](#gistUploadToken). Reports are automatically deleted 7 days after upload.

```yml
temporaryPublicStorage: true
```

### slackWebhookUrl

Allows to send notification in [Slack](https://slack.com/intl/en-ua/) channel.
Visit Slack Incoming Webhooks [docs](https://api.slack.com/messaging/webhooks#create_a_webhook) and follow step provided there.
Then copy `webhookUrl` value and set it up via [Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your url hidden!

```yml
slackWebhookUrl: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### `runs` (default: 1)

Specify the number of runs to do on each URL.

> **Note**: Asserting against a single run can lead to flaky performance assertions.
> Use `1` only to ensure static audits like Lighthouse scores, page size, or performance budgets.

```yml
runs: 3
```

#### `budgetPath`

Use a performance budget to keep your page size in check. `Lighthouse CI Action` will fail the build if one of the URLs exceeds the budget.

Learn more about the [budget.json spec](https://github.com/GoogleChrome/budget.json) and [practical use of performance budgets](https://web.dev/use-lighthouse-for-performance-budgets).

```yml
budgetPath: ./budget.json
```

#### `configPath`

Set a path to a custom [lighthouserc file](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/cli.md#configuration) for full control of the Lighthouse environment and assertions.

Use `lighthouserc` to configure the collection of data (via Lighthouse config and Chrome Flags), and CI assertions (via LHCI assertions).

```yml
configPath: ./lighthouserc.json
```

#### `serverBaseUrl`

Upload Lighthouse results to a private [LHCI server](https://github.com/GoogleChrome/lighthouse-ci) by specifying both `serverBaseUrl` and `serverToken`.
This will replace uploading to `temporary-public-storage`.

> **Note**: Use [Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your server address hidden!

```yml
serverBaseUrl: ${{ secrets.LHCI_SERVER_BASE_URL }}
serverToken: ${{ secrets.LHCI_SERVER_TOKEN }}
```

> **Note**: Use [Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your token hidden!

## Recipes

<details>
 <summary>Run Lighthouse and validate against a performance budget.</summary><br>

Create `.github/workflows/main.yml` with the list of URLs to audit
and identify a budget with `budgetPath`.

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse on urls and validate with budgets.json
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: 'https://example.com/'
          budgetPath: './budgets.json'
```

Make a `budget.json` file with [budgets syntax](https://web.dev/use-lighthouse-for-performance-budgets/).

> **Note**: Under the hood, this will be transformed into LHCI assertions.

#### budgets.json

```json
[
  {
    "path": "/*",
    "resourceSizes": [
      {
        "resourceType": "document",
        "budget": 18
      },
      {
        "resourceType": "total",
        "budget": 200
      }
    ]
  }
]
```

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68525270-cc046480-0284-11ea-9477-af32fce1e5a2.png">

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-assert-on-budget)

</details>

<details>
 <summary>Notify in Slack/Github for assertion results</summary><br>

Create `.github/workflows/main.yml` with the list of URLs, enable notifications to audit
and identify a budget with `budgetPath`.

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  # This pass/fails a build with a budgets.json.
  assert-on-budget:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse on urls and validate with budgets.json
        uses: ./
        with:
          urls: 'https://alekseykulikov.com/'
          budgetPath: '.github/lighthouse/budget.json'
          slackWebhookUrl: ${{ secrets.SLACK_WEBHOOK_URL }}
```

Make a `budget.json` file with [budgets syntax](https://web.dev/use-lighthouse-for-performance-budgets/).

> **Note**: Under the hood, this will be transformed into LHCI assertions.

#### budgets.json

```json
[
  {
    "path": "/*",
    "resourceSizes": [
      {
        "resourceType": "document",
        "budget": 18
      },
      {
        "resourceType": "total",
        "budget": 200
      }
    ]
  }
]
```

</details>

<details>
 <summary>Run Lighthouse and validate against LHCI assertions.</summary><br>

Create `.github/workflows/main.yml` with the list of URLs to audit
and identify a `lighthouserc` file with `configPath`.

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse on urls and validate with lighthouserc
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: 'https://exterkamp.codes/'
          configPath: './lighthouserc.json'
```

Make a `lighthouserc.json` file with [LHCI assertion syntax](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/assertions.md).

#### lighthouserc.json

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", { "minScore": 0.6 }]
      }
    }
  }
}
```

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68525259-b42ce080-0284-11ea-9fe5-75fbe20853d9.png">

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-assert-on-lighthouserc)

</details>

<details>
 <summary>Upload results to a private LHCI server.</summary><br>

Create `.github/workflows/main.yml` with the list of URLs to audit using lighthouse,
and identify a `serverBaseUrl` to upload to and an `token` to use.

> **Note**: use [GitHub secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your server address hidden!

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse on urls and upload data to private lhci server
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: 'https://example.com/'
          serverBaseUrl: ${{ secrets.LHCI_SERVER_BASE_URL }}
          serverToken: ${{ secrets.LHCI_SERVER_TOKEN }}
          uploadArtifacts: false # don't store artifacts as a part of action
```

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68525219-4c769580-0284-11ea-8407-9f2ea89ae845.png">

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-upload-to-private-server)

</details>

<details>
 <summary>Audit with custom Chrome options and custom Lighthouse config.</summary><br>

Create `.github/workflows/main.yml` with the list of URLs to audit and
identify a `lighthouserc` file with `configPath`.

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse on urls with lighthouserc
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: 'https://example.com/'
          configPath: './lighthouserc.json'
```

Chrome flags can be set directly in the `lighthouserc`'s `collect` section.

#### lighthouserc.json

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 1,
      "settings": {
        "chromeFlags": ["--disable-gpu", "--no-sandbox", "--no-zygote"]
      }
    }
  }
}
```

Custom Lighthouse config can be defined in a seperate Lighthouse config using
the [custom Lighthouse config syntax](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md).
This is then referenced by the `lighthouserc` file in the `configPath`.

#### lighthouserc.json

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 1,
      "settings": {
        "configPath": "./lighthouse-config.js"
      }
    }
  }
}
```

Then put all the custom Lighthouse config in the file referenced in the `lighthouserc`.

#### lighthouse-config.js

```javascript
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'desktop',
    audits: [{ path: 'metrics/first-contentful-paint', options: { scorePODR: 800, scoreMedian: 1600 } }]
  }
}
```

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-advanced-config)

</details>

<details>
 <summary>Test a static site without having to deploy it.</summary><br>

Create `.github/workflows/main.yml` and identify a `lighthouserc` file with a
`staticDistDir` config.

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  static-dist-dir:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse against a static dist dir
        uses: treosh/lighthouse-ci-action@v2
        with:
          # no urls needed, since it uses local folder to scan .html files
          configPath: './lighthouserc.json'
```

#### lighthouserc.json

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist"
    }
  }
}
```

Inside your `staticDistDir` there should be html files that make up your site.
LHCI will run a simple static webserver to host the files, then run an audit
against each of them. More details on this process are in the [Lighthouse CI docs](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#run-lighthouse-ci).

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68525233-6b752780-0284-11ea-832c-e662a099e2ca.png">

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-static-dist-dir)

</details>

<details>
 <summary>Use with a Lighthouse plugin.</summary><br>

#### main.yml

```yml
name: Lighthouse Audit
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1 # checkout your own repo
      - run: npm install # install your own dependencies
      - name: Audit URLs using Lighthouse
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: |
            https://www.example.com/
          configPath: ./lighthouserc.json
```

#### lighthouserc.json

```json
{
  "ci": {
    "collect": {
      "settings": {
        "plugins": ["lighthouse-plugin-social-sharing"]
      }
    }
  }
}
```

#### package.json

```json
{
  "name": "lighthouse-plugin-sample-project",
  "devDependencies": {
    "lighthouse-plugin-social-sharing": "0.0.1"
  }
}
```

[⚙️ See this example](https://github.com/connorjclark/lighthouse-plugin-sample-project)

</details>

Explore more workflows in [public examples](./.github/workflows).
Submit a pull request with a new one if they don't cover your use case.

---

## Credits

Sponsored by [Treo](https://treo.sh) and [Google](https://google.com/).

[![](https://github.com/exterkamp/lighthouse-ci-action/workflows/CI/badge.svg)](https://github.com/treosh/lighthouse-ci-action/actions?workflow=CI)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
