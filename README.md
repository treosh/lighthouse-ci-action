# lighthouse-ci-action

> Run Lighthouse in CI using Github Actions.

It's a [Github Action](https://github.com/features/actions), that simplify usage of [Lighthouse](https://developers.google.com/web/tools/lighthouse) in CI.

**Features**:

- ✅ Audit URLs using Lighthouse
- 🎯 Setup performance budget as a part of CI process
- ⚙️ Full control over Lighthouse config
- 🔍 Detailed output for quick debug
- 🚀 Fast (less than 2 seconds) action initialization

## Usage

Create `.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse Audit
on: push
jobs:
  run-lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: treosh/lighthouse-actions@master
        with:
          urls: |
            https://example.com/
            https://example.com/blog
            https://example.com/pricing
          budgetPath: ./budget.json
```

## Credits

Sponsored by [Treo.sh - Page speed monitoring made easy](https://treo.sh).

[![](https://travis-ci.org/treosh/lighthouse-plugin-field-performance.png)](https://travis-ci.org/treosh/lighthouse-plugin-field-performance)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
