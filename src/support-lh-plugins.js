// https://github.com/treosh/lighthouse-ci-action/pull/19
//
// Append the node_modules of the github workspace and the node_modules of this action
// to NODE_PATH. This supports lighthouse plugins - all the workspace needs to do is
// `npm install` the plugin. The copy of lighthouse within this action will be used.

const nodePathDelim = require('is-windows')() ? ';' : ':'
const nodePathParts = [
  ...(process.env.NODE_PATH || '').split(nodePathDelim),
  `${__dirname}/../node_modules`,
  `${process.env.GITHUB_WORKSPACE}/node_modules`
]
process.env.NODE_PATH = nodePathParts.join(nodePathDelim)
