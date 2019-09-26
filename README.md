# Lighthouse CI Action

> Run Lighthouse in CI using Github Actions.

<img align="center" width="998" alt="Lighthouse CI Action" src="https://user-images.githubusercontent.com/158189/65678706-1a063580-e054-11e9-95dc-a1a9fe13bc6b.png">

Audit many URLs using [Lighthouse](https://developers.google.com/web/tools/lighthouse),
and test performance budget as a part of your CI pipeline.

This is a [Github Action](https://github.com/features/actions) that simplify the process of configuring Lighthouse, managing results, and testing a performance budget.

**Features**:

- ✅ Audit URLs using Lighthouse
- 🎯 Test performance budget as a part of the build
- ⚙️ Full control over Lighthouse config
- 🔍 Detailed output for quick debug
- 🚀 Fast (less than 3 seconds) action initialization

## Usage

Create `.github/workflows/main.yml` with the list of URLs to audit using lighthouse.
The results will be stored as a build artifact.

```yml
name: Lighthouse Audit
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Audit URLs using Lighthouse and ensure performance budget
        uses: treosh/lighthouse-ci-action@v1
        with:
          urls: |
            https://example.com/
            https://example.com/blog
            https://example.com/pricing
          budgetPath: ./budget.json
      - name: Save results
        uses: actions/upload-artifact@master
        with:
          name: lighthouse-results
          path: './results'
```

Set `budgetPath` if you need to ensure [performance budget](https://web.dev/use-lighthouse-for-performance-budgets) as a part of CI process.

`budget.json`

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

In a more realistic case, first, you would need to run tests and deploy the project on staging. Than run Lighthouse audits on the live URLs to ensure the budget and collect artifacts. The `.github/workflows/main.yml` config may look like this:

```yml
name: CI
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Use node 10
        uses: actions/setup-node@v1
        with:
          node-version: '10.x'
      - name: Install and test
        run: |
          npm install
          npm test
      - name: Deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: npm run deploy
  lighthouse:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@master
      - name: Run Lighthouse and test budgets
        uses: treosh/lighthouse-ci-action@v1
        with:
          urls: |
            https://example.com/
            https://example.com/features
            https://example.com/blog
          budgetPath: ./budget.json
      - name: Upload artifacts
        uses: actions/upload-artifact@master
        with:
          name: lighthouse-results
          path: './results'
```

<img width="762" alt="Successful Build" src="https://user-images.githubusercontent.com/158189/65687641-fea62500-e069-11e9-946b-4d6d5085a3e6.png">

## Inputs

### `urls` (required)

Provide the list of URLs separated by a new line.
Each URL is audited using the latest version of Lighthouse and Chrome preinstalled on user machine.

```yml
urls: |
  https://example.com/
  https://example.com/blog
  https://example.com/pricing
```

If you need to audit just one URL, use the `url` option:

```yml
url: https://example.com/
```

### `budgetPath`

Use a performance budget to keep your page size in check. `Lighthouse CI Action` will fail the build if one of the URLs exceed the budget.

Learn more about the [budget.json spec](https://github.com/GoogleChrome/budget.json) and [practical use of performance budgets](https://web.dev/use-lighthouse-for-performance-budgets).

```yml
budgetPath: .github/lighthouse/budget.json
```

### `throttlingMethod`

Set `devtools`, `simulate`, or `provided` to configure throttling.

```yml
throttlingMethod: devtools
```

### `onlyCategories`

Specify Lighthouse categories to limit the results output and run audits faster.

```yml
onlyCategories: [performance]
```

### `chromeFlags`

Use `chromeFlags` to pass any argument to Chrome.
`Lighthouse CI Action` uses a built-in Chrome instance that comes with an image specified with `runs-on` option.

[Learn more about useful Chrome flags](https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md).

```yml
chromeFlags: '--window-size=1200,800 --single-process'
```

### `extraHeaders`

Pass any HTTP header to the Chrome so you can audit authenticate pages or disable/enable a certain behavior.

```yml
extraHeaders '{"Cookie":"monster=blue","x-men":"wolverine"}'
```

### `configPath`

If you need to enable a custom [Lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md),
pass valid Lighthouse config using `configPath`.

```yml
configPath: ./desktop-config.js
```

`desktop-config.js`:

```js
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'desktop',
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    audits: [
      { path: 'metrics/first-contentful-paint', options: { scorePODR: 800, scoreMedian: 1600 } },
      { path: 'metrics/first-meaningful-paint', options: { scorePODR: 800, scoreMedian: 1600 } },
      { path: 'metrics/speed-index', options: { scorePODR: 1100, scoreMedian: 2300 } },
      { path: 'metrics/interactive', options: { scorePODR: 2000, scoreMedian: 4500 } },
      { path: 'metrics/first-cpu-idle', options: { scorePODR: 2000, scoreMedian: 4500 } }
    ]
  }
}
```

---

## Credits

Sponsored by [Treo.sh - Page speed monitoring made easy](https://treo.sh).

[![](https://github.com/treosh/lighthouse-ci-action/workflows/CI/badge.svg)](https://github.com/treosh/lighthouse-ci-action/actions?workflow=CI)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
