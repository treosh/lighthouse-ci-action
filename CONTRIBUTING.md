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
INPUT_URLS="https://treo.sh/" INPUT_BUDGETPATH=".github/lighthouse/budget.json" node src/index.js

# fail with assertions, custom config, or chrome flags
INPUT_URLS="https://example.com/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-assertions.json" node src/index.js

# debug custom headers
python script/simple-server.py # start basic server in a separate tab
INPUT_URLS="http://localhost:3000/" INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-extra-headers.json" node src/index.js # run and see headers output

# run locally, with env var interpolation
python script/simple-server.py # start basic server in a separate tab
PAGE="src/" INPUT_URLS="http://localhost:3000/\$PAGE" node src/index.js

# run with a static dist dir
INPUT_CONFIGPATH=".github/lighthouse/lighthouserc-static-dist-dir.yml" node src/index.js

# test annotations (requires .lighthouseci folder after manual run)
node -e "require('./src/utils/annotations').setFailedAnnotations('.lighthouseci')"
```
