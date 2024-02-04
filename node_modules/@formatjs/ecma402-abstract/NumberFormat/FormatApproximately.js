"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatApproximately = void 0;
/**
 * https://tc39.es/ecma402/#sec-formatapproximately
 */
function FormatApproximately(numberFormat, result, _a) {
    var getInternalSlots = _a.getInternalSlots;
    var internalSlots = getInternalSlots(numberFormat);
    var symbols = internalSlots.dataLocaleData.numbers.symbols[internalSlots.numberingSystem];
    var approximatelySign = symbols.approximatelySign;
    result.push({ type: 'approximatelySign', value: approximatelySign });
    return result;
}
exports.FormatApproximately = FormatApproximately;
