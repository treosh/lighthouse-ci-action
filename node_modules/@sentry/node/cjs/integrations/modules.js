Object.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');
const path = require('path');
const core = require('@sentry/core');

let moduleCache;

const INTEGRATION_NAME = 'Modules';

/** Extract information about paths */
function getPaths() {
  try {
    return require.cache ? Object.keys(require.cache ) : [];
  } catch (e) {
    return [];
  }
}

/** Extract information about package.json modules */
function collectModules()

 {
  const mainPaths = (require.main && require.main.paths) || [];
  const paths = getPaths();
  const infos

 = {};
  const seen

 = {};

  paths.forEach(path$1 => {
    let dir = path$1;

    /** Traverse directories upward in the search of package.json file */
    const updir = () => {
      const orig = dir;
      dir = path.dirname(orig);

      if (!dir || orig === dir || seen[orig]) {
        return undefined;
      }
      if (mainPaths.indexOf(dir) < 0) {
        return updir();
      }

      const pkgfile = path.join(orig, 'package.json');
      seen[orig] = true;

      if (!fs.existsSync(pkgfile)) {
        return updir();
      }

      try {
        const info = JSON.parse(fs.readFileSync(pkgfile, 'utf8'))

;
        infos[info.name] = info.version;
      } catch (_oO) {
        // no-empty
      }
    };

    updir();
  });

  return infos;
}

/** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */
function _getModules() {
  if (!moduleCache) {
    moduleCache = collectModules();
  }
  return moduleCache;
}

const _modulesIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    // TODO v8: Remove this
    setupOnce() {}, // eslint-disable-line @typescript-eslint/no-empty-function
    processEvent(event) {
      event.modules = {
        ...event.modules,
        ..._getModules(),
      };

      return event;
    },
  };
}) ;

const modulesIntegration = core.defineIntegration(_modulesIntegration);

/**
 * Add node modules / packages to the event.
 * @deprecated Use `modulesIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
const Modules = core.convertIntegrationFnToClass(INTEGRATION_NAME, modulesIntegration)

;

// eslint-disable-next-line deprecation/deprecation

exports.Modules = Modules;
exports.modulesIntegration = modulesIntegration;
//# sourceMappingURL=modules.js.map
