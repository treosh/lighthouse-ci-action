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
INPUT_URLS="https://example.com/" node src/index.js

# run many urls
INPUT_URLS="https://example.com/
 https://example.com/blog" node src/index.js

# run with performance budget
INPUT_URLS="https://treo.sh/" INPUT_BUDGETPATH=".github/lighthouse/budget.json" INPUT_TEMPORARYPUBLICSTORAGE=true node src/index.js

# fail with assertions, custom config, or chrome flags
INPUT_URLS="https://exterkamp.codes/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-assertions.json" INPUT_UPLOADARTIFACTS=true node src/index.js

# debug custom headers
python script/simple-server.py # start basic server in a separate tab
INPUT_URLS="http://localhost:3000/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-extra-headers.json" node src/index.js # run and see headers output

# run locally, with env var interpolation
python script/simple-server.py # start basic server in a separate tab
PAGE="src/" INPUT_URLS="http://localhost:3000/\$PAGE" node src/index.js

# run with a static dist dir
INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-static-dist-dir.yml" node src/index.js

# test annotations (requires .lighthouseci folder after manual run with some failed audits)
node -e "require('./src/utils/annotations').setFailedAnnotations('.lighthouseci')"
```

## Versioning

Based on semver and https://github.com/actions/toolkit/blob/master/docs/action-versioning.md#versioning

Update tag:

```bash
git tag 12.6.1
git tag -fa v12 -m "Update v12 tag"
git push origin v12 --force
```
