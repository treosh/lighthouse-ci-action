# Lighthouse CI Action

> Audit URLs using [Lighthouse](https://developers.google.com/web/tools/lighthouse)
> and test performance with [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci).

The action integrates Lighthouse CI with Github Actions environment.
Making it simple to see failed tests with annotations, upload results, store secrets, and interpolate env variables.

It is built in collaboration between Lighthouse Team, Treo (web performance monitoring company), and many excellent contributors.

**Features**:

- ✅ Audit URLs using Lighthouse
- 🎯 Test performance with Lighthouse CI assertions or performance budgets
- 😻 See failed results in the action interface
- 💾 Upload results to a private LHCI server, Temporary Public Storage, or as artifacts
- ⚙️ Full control over Lighthouse CI config
- 🚀 Fast action initialization (less than 1 second)

<img align="center" width="926" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/158189/77115281-55dfed80-6a2e-11ea-8b96-ff7e31fc6155.png">

## Example

Run Lighthouse on each push to the repo, test performance budget, save results as action artifacts.

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
          budgetPath: ./budget.json # test performance budgets
          uploadArtifacts: true # save results as an action artifacts
          temporaryPublicStorage: true # upload lighthouse report to the temporary storage
```

Describe your performance budget using a [`budget.json`](https://web.dev/use-lighthouse-for-performance-budgets/).

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

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-assert-on-budget)

## Recipes

<details>
 <summary>Run Lighthouse and validate against Lighthouse CI assertions.</summary><br>

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

<img align="center" width="925" alt="Lighthouse CI Action: test Lighthouse assertions" src="https://user-images.githubusercontent.com/158189/77118526-a8bca380-6a34-11ea-876e-2004bc7984a7.png">

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
          serverBaseUrl: ${{ secrets.LHCI_SERVER_URL }}
          serverToken: ${{ secrets.LHCI_SERVER_TOKEN }}
          uploadArtifacts: false # don't store artifacts as a part of action
```

<img align="center" width="925" alt="Lighthouse CI Action: Upload results to a private server" src="https://user-images.githubusercontent.com/158189/77117096-98ef9000-6a31-11ea-97f3-dee71caf32ca.png">

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

<img align="center" width="998" alt="Lighthouse CI Action: Test a static site without having to deploy it" src="https://user-images.githubusercontent.com/158189/77118086-b1f94080-6a33-11ea-9429-d3c108190c8d.png">

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-static-dist-dir)

</details>

<details>
  <summary>Use URLs interpolation to pass secrets or environment variables</summary>

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
        env:
          PR_NUMBER: ${{ github.event.pull_request.number }}
```

[⚙️ See this workflow in use](https://github.com/treosh/lighthouse-ci-action/actions?workflow=LHCI-urls-interpolation)

</details>

Explore more workflows in [public examples](./.github/workflows).
Submit a pull request with a new one if they don't cover your use case.

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

Upload Lighthouse results as [action artifacts](https://help.github.com/en/actions/configuring-and-managing-workflows/persisting-workflow-data-using-artifacts) to persist results. Equivalent to using [`actions/upload-artifact`](https://github.com/actions/upload-artifact) to save the artifacts with additional action steps.

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

#### `budgetPath`

Use a performance budget to keep your page size in check. `Lighthouse CI Action` will fail the build if one of the URLs exceeds the budget.

Learn more about the [budget.json spec](https://github.com/GoogleChrome/budget.json) and [practical use of performance budgets](https://web.dev/use-lighthouse-for-performance-budgets).

```yml
budgetPath: ./budget.json
```

#### `runs` (default: 1)

Specify the number of runs to do on each URL.

> **Note**: Asserting against a single run can lead to flaky performance assertions.
> Use `1` only to ensure static audits like Lighthouse scores, page size, or performance budgets.

```yml
runs: 3
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

---

## Credits

Sponsored by [Treo](https://treo.sh/) and [Google](https://google.com/).

[![](https://github.com/exterkamp/lighthouse-ci-action/workflows/CI/badge.svg)](https://github.com/treosh/lighthouse-ci-action/actions?workflow=CI)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
