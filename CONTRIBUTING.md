# How to Contribute

First of all, thank you for your interest in `lighthouse-actions`!
We'd love to accept your patches and contributions!

```bash
# install deps
yarn install

# ensure all tests pass
yarn test

# run locally, use INPUT_* notation to pass arguments
INPUT_URL="https://example.com/" node src/index.js

# run many urls
INPUT_URLS="https://alekseykulikov.com/
 https://alekseykulikov.com/blog" node src/index.js

# run with extra inputs
INPUT_URL="https://example.com/" INPUT_THROTTLINGMETHOD="devtools" INPUT_ONLYCATEGORIES="performance,seo" INPUT_CHROMEFLAGS="--window-size=1200,800 --single-process"  node src/index.jsnode src/index.js

# fail with budget
INPUT_URL="https://alekseykulikov.com/" INPUT_BUDGETPATH=".github/lighthouse/budget.json" node src/index.js
```
