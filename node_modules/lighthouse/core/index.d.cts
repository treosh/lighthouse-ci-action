export = lighthouse;
/**
 * @typedef ExportType
 * @property {import('./index.js')['startFlow']} startFlow
 * @property {import('./index.js')['navigation']} navigation
 * @property {import('./index.js')['startTimespan']} startTimespan
 * @property {import('./index.js')['snapshot']} snapshot
 */
/** @type {import('./index.js')['default'] & ExportType} */
declare const lighthouse: typeof import("./index.js")['default'] & ExportType;
type ExportType = {
    startFlow: typeof import("./index.js")['startFlow'];
    navigation: typeof import("./index.js")['navigation'];
    startTimespan: typeof import("./index.js")['startTimespan'];
    snapshot: typeof import("./index.js")['snapshot'];
};
//# sourceMappingURL=index.d.cts.map