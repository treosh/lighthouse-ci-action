import * as ModelHandlers from './ModelHandlers.js';
/**
 * Because you can run the trace engine with a subset of handlers enabled,
 * there can be times when you need to confirm if the trace contains all
 * handlers or not, because some parts of the engine expect to be given all
 * the handlers.
 */
export function handlerDataHasAllHandlers(data) {
    let isMissingHandler = false;
    for (const handlerName of Object.keys(ModelHandlers)) {
        if (handlerName in data === false) {
            isMissingHandler = true;
            break;
        }
    }
    return !isMissingHandler;
}
//# sourceMappingURL=types.js.map