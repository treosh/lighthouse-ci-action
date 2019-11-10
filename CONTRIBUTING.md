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
INPUT_URLS="https://alekseykulikov.com/
 https://alekseykulikov.com/blog" node src/index.js

# fail with budget
INPUT_URLS="https://alekseykulikov.com/" INPUT_BUDGET_PATH=".github/lighthouse/impossible_budget.json" INPUT_RUNS="1" node src/index.js

# fail with assertions
INPUT_URLS="https://alekseykulikov.com/" INPUT_RC_PATH=".github/lighthouse/lighthouserc_assertions.json" INPUT_RUNS="1" node src/index.js

# run with custom config
INPUT_URLS="https://alekseykulikov.com/" INPUT_RC_PATH=".github/lighthouse/lighthouserc_custom_config.json" INPUT_RUNS="1" node src/index.js

# run with Chrome flags
INPUT_URLS="https://alekseykulikov.com/" INPUT_RC_PATH=".github/lighthouse/lighthouserc_chrome_flags.json" INPUT_RUNS="1" node src/index.js

# debug custom headers
python script/simple-server.py # start basic server in a separate tab
INPUT_URLS="https://alekseykulikov.com/" INPUT_RC_PATH=".github/lighthouse/lighthouserc_extra_headers.json" INPUT_RUNS="1" node src/index.js # run and see headers output

# run with a static dist dir
INPUT_STATIC_DIST_DIR="./dist" INPUT_RUNS="1" node src/index.js
```
