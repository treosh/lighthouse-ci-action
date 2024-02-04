"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatNumericRange = void 0;
var PartitionNumberRangePattern_1 = require("./PartitionNumberRangePattern");
/**
 * https://tc39.es/ecma402/#sec-formatnumericrange
 */
function FormatNumericRange(numberFormat, x, y, _a) {
    var getInternalSlots = _a.getInternalSlots;
    var parts = (0, PartitionNumberRangePattern_1.PartitionNumberRangePattern)(numberFormat, x, y, {
        getInternalSlots: getInternalSlots,
    });
    return parts.map(function (part) { return part.value; }).join('');
}
exports.FormatNumericRange = FormatNumericRange;
