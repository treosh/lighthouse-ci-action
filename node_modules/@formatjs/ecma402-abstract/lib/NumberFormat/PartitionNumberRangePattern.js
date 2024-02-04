import { PartitionNumberPattern } from './PartitionNumberPattern';
import { CollapseNumberRange } from './CollapseNumberRange';
import { FormatApproximately } from './FormatApproximately';
/**
 * https://tc39.es/ecma402/#sec-partitionnumberrangepattern
 */
export function PartitionNumberRangePattern(numberFormat, x, y, _a) {
    var getInternalSlots = _a.getInternalSlots;
    if (isNaN(x) || isNaN(y)) {
        throw new RangeError('Input must be a number');
    }
    var result = [];
    var xResult = PartitionNumberPattern(numberFormat, x, { getInternalSlots: getInternalSlots });
    var yResult = PartitionNumberPattern(numberFormat, y, { getInternalSlots: getInternalSlots });
    if (xResult === yResult) {
        return FormatApproximately(numberFormat, xResult, { getInternalSlots: getInternalSlots });
    }
    for (var _i = 0, xResult_1 = xResult; _i < xResult_1.length; _i++) {
        var r = xResult_1[_i];
        r.source = 'startRange';
    }
    result = result.concat(xResult);
    var internalSlots = getInternalSlots(numberFormat);
    var symbols = internalSlots.dataLocaleData.numbers.symbols[internalSlots.numberingSystem];
    result.push({ type: 'literal', value: symbols.rangeSign, source: 'shared' });
    for (var _b = 0, yResult_1 = yResult; _b < yResult_1.length; _b++) {
        var r = yResult_1[_b];
        r.source = 'endRange';
    }
    result = result.concat(yResult);
    return CollapseNumberRange(result);
}
