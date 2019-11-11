# Lighthouse CI Action

> Run Lighthouse in CI using Github Actions.

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68569713-a9548600-0413-11ea-94e2-ce8f07df0828.png">

Audit URLs using [Lighthouse](https://developers.google.com/web/tools/lighthouse),
and monitor performance with [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci).

**Features**:

- ✅ Audit URLs using Lighthouse
- 🎯 Test performance with Lighthouse CI (LHCI) assertions
- 💵 Test performance with Lighthouse budgets
- ⚙️ Full control over Lighthouse config
- 🔍 Detailed output for quick debug
- 💾 Upload data to LHCI server
- 🚀 Fast action initialization

## Usage

### Basic Action

> Use Case: Run Lighthouse on each push to the repo and save the results in action artifacts.

Create `.github/workflows/main.yml` with the list of URLs to audit using lighthouse.
The results will be stored as a build artifact.

#### main.yml

```yml
name: Lighthouse
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Audit URLs using Lighthouse
        uses: treosh/lighthouse-ci-action@v1
        with:
          urls: 'https://example.com/'
      # Note: Lighthouse-ci-actions overwrite .lighthouseci/ each run, therefore
      # artifacts need to be saved after each run if using gh-actions artifacts.
      - name: Save results
        uses: actions/upload-artifact@v1
        with:
          name: lighthouse-results
          # This will save the Lighthouse results as .json files
          path: '.lighthouseci'
```

> Note: to view the reports follow the `temporary-public-storage` link printed
> out in the action, or download the `json` files from the artifacts and open
> them with the [Lighthouse Viewer App](https://googlechrome.github.io/lighthouse/viewer/)

Link to `temporary-public-storage`:
<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68536792-76c06580-030d-11ea-8e19-c467e374434e.png">

> Note: By default this action will store `json` results to `.lighthouseci`,
> setting `temporaryPublicStorage` will upload the LHRs to Lighthouse-ci's
> `temporary-public-storage`.

URLs support interpolation of process env vars, so you can write URLs like:

```yml
- name: Run Lighthouse and test budgets
  uses: treosh/lighthouse-ci-action@v1
  with:
    urls: |
      https://pr-$PR_NUMBER.staging-example.com/
      https://pr-$PR_NUMBER.staging-example.com/blog
    env:
      PR_NUMBER: ${{ github.event.pull_request.number }}
```

[⚙️ See this workflow in use!](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-multiple-urls)

## Inputs

#### `urls`

Provide the list of URLs separated by a new line.
Each URL is audited using the latest version of Lighthouse and Chrome preinstalled on user machine.

> Note: Either a list of urls, or a `staticDistDir` in the `lighthouserc` file is required.

```yml
urls: |
  https://example.com/
  https://example.com/blog
  https://example.com/pricing
```

#### `runs`

Specify the number of runs to do on each URL. Default: `1`.

```yml
runs: 3
```

#### `budgetPath`

Use a performance budget to keep your page size in check. `Lighthouse CI Action` will fail the build if one of the URLs exceed the budget.

Learn more about the [budget.json spec](https://github.com/GoogleChrome/budget.json) and [practical use of performance budgets](https://web.dev/use-lighthouse-for-performance-budgets).

```yml
budgetPath: .github/lighthouse/budget.json
```

#### `configPath`

Set a path to a custom [lighthouserc file](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/cli.md#configuration) for full control of the Lighthouse enviroment.

This `lighthouserc` file can be used to contorl the collection of data (via Lighthouse config, and
Chrome Flags), and CI assertions (via LHCI assertions).

> Note: `lighthouserc` files normally also control the "upload" step. However, this method
> is incompatible with github secrets and would expose all LHCI server addresses
> and tokens; use `serverBaseUrl` and `token` parameters instead.

```yml
configPath: ./lighthouserc.json
```

#### `temporaryPublicStorage`

This will opt-in to the default upload to `temporary-public-storage`. You can
find out more about `temporary-public-storage` in the [LHCI repo](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/cli.md#upload).

```yml
temporaryPublicStorage: 'any value'
```

#### `serverBaseUrl`

Specify a [LHCI server](https://github.com/GoogleChrome/lighthouse-ci) address to send Lighthouse Results to.

> Note: This will replace uploading to `temporary-public-storage`.

> Note: Use [Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your server address hidden!

```yml
serverBaseUrl: ${{ secrets.LHCI_SERVER }}
```

#### `token`

Specify an API token for the LHCI server. ([How to generate a token](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md#historical-reports--diffing-lighthouse-ci-server))

> Note: use [Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your server address hidden!

```yml
token: ${{ secrets.LHCI_API_TOKEN }}
```

## Advanced Recipes

### Asserting Against Performance budgets.json

> Use Case: Run Lighthouse and validate against a budget.

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
        uses: treosh/lighthouse-ci-action@v1
        with:
          urls: 'https://example.com/'
          budgetPath: './budgets.json'
```

Make a `budget.json` file with [budgets syntax](https://web.dev/use-lighthouse-for-performance-budgets/).

> Note: Under the hood, this will be transformed into LHCI assertions.

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

[⚙️ See this workflow in use!](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-assert-on-budget)

### Asserting Against LHCI lighthouserc

> Use Case: Run Lighthouse and validate against LHCI assertions.

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
        uses: treosh/lighthouse-ci-action@v1
        with:
          urls: 'https://example.com/'
          configPath: './lighthouserc.json'
```

Make a `lighthouserc.json` file with [LHCI assertion syntax](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/assertions.md).

#### lighthouserc.json

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", { "minScore": 0.8 }]
      }
    }
  }
}
```

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68525259-b42ce080-0284-11ea-9fe5-75fbe20853d9.png">

[⚙️ See this workflow in use!](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-assert-on-lighthouserc)

### Uploading to a LHCI Server

> Use Case: Providing data to a hosted LHCI server.

Create `.github/workflows/main.yml` with the list of URLs to audit using lighthouse,
and identify a `serverBaseUrl` to upload to and an `token` to use.

> Note: use [Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) to keep your server address hidden!

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
        uses: treosh/lighthouse-ci-action@v1
        with:
          urls: 'https://example.com/'
          serverBaseUrl: ${{ secrets.LHCI_SERVER }}
          token: ${{ secrets.LHCI_API_TOKEN }}
```

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/6392995/68525219-4c769580-0284-11ea-8407-9f2ea89ae845.png">

[⚙️ See this workflow in use!](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-upload-to-private-server)

### Using Custom Config & Chrome Flags

> Use Case: Running Lighthouse with highly custom Lighthouse runtime or custom Chrome flags.

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
        uses: treosh/lighthouse-ci-action@v1
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

[⚙️ See this workflow in use!](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-hermetic-advanced)

### Using a Static Dist Dir

> Use Case: Testing a very basic static site without having to deploy it.

Create `.github/workflows/main.yml` and identify a `lighthouserc` file with a
`staticDistDir` config.

```yml
name: Lighthouse
on: push
jobs:
  static-dist-dir:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Run Lighthouse against a static dist dir
        uses: treosh/lighthouse-ci-action@v1
        with:
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

[⚙️ See this workflow in use!](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-static-dist-dir)

---

## Credits

Sponsored by [Treo.sh - Page speed monitoring made easy](https://treo.sh) and [Google](https://google.com/).

[![](https://github.com/exterkamp/lighthouse-ci-action/workflows/CI/badge.svg)](https://github.com/treosh/lighthouse-ci-action/actions?workflow=CI)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
