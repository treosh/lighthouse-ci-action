import { DefaultNumberOption } from '../DefaultNumberOption';
import { GetNumberOption } from '../GetNumberOption';
import { GetOption } from '../GetOption';
/**
 * https://tc39.es/ecma402/#sec-setnfdigitoptions
 */
export function SetNumberFormatDigitOptions(internalSlots, opts, mnfdDefault, mxfdDefault, notation) {
    var mnid = GetNumberOption(opts, 'minimumIntegerDigits', 1, 21, 1);
    var mnfd = opts.minimumFractionDigits;
    var mxfd = opts.maximumFractionDigits;
    var mnsd = opts.minimumSignificantDigits;
    var mxsd = opts.maximumSignificantDigits;
    internalSlots.minimumIntegerDigits = mnid;
    var roundingPriority = GetOption(opts, 'roundingPriority', 'string', ['auto', 'morePrecision', 'lessPrecision'], 'auto');
    var hasSd = mnsd !== undefined || mxsd !== undefined;
    var hasFd = mnfd !== undefined || mxfd !== undefined;
    var needSd = true;
    var needFd = true;
    if (roundingPriority === 'auto') {
        needSd = hasSd;
        if (hasSd || (!hasFd && notation === 'compact')) {
            needFd = false;
        }
    }
    if (needSd) {
        if (hasSd) {
            mnsd = DefaultNumberOption(mnsd, 1, 21, 1);
            mxsd = DefaultNumberOption(mxsd, mnsd, 21, 21);
            internalSlots.minimumSignificantDigits = mnsd;
            internalSlots.maximumSignificantDigits = mxsd;
        }
        else {
            internalSlots.minimumSignificantDigits = 1;
            internalSlots.maximumSignificantDigits = 21;
        }
    }
    if (needFd) {
        if (hasFd) {
            mnfd = DefaultNumberOption(mnfd, 0, 20, undefined);
            mxfd = DefaultNumberOption(mxfd, 0, 20, undefined);
            if (mnfd === undefined) {
                // @ts-expect-error
                mnfd = Math.min(mnfdDefault, mxfd);
            }
            else if (mxfd === undefined) {
                mxfd = Math.max(mxfdDefault, mnfd);
            }
            else if (mnfd > mxfd) {
                throw new RangeError("Invalid range, ".concat(mnfd, " > ").concat(mxfd));
            }
            internalSlots.minimumFractionDigits = mnfd;
            internalSlots.maximumFractionDigits = mxfd;
        }
        else {
            internalSlots.minimumFractionDigits = mnfdDefault;
            internalSlots.maximumFractionDigits = mxfdDefault;
        }
    }
    if (needSd || needFd) {
        if (roundingPriority === 'morePrecision') {
            internalSlots.roundingType = 'morePrecision';
        }
        else if (roundingPriority === 'lessPrecision') {
            internalSlots.roundingType = 'lessPrecision';
        }
        else if (hasSd) {
            internalSlots.roundingType = 'significantDigits';
        }
        else {
            internalSlots.roundingType = 'fractionDigits';
        }
    }
    else {
        internalSlots.roundingType = 'morePrecision';
        internalSlots.minimumFractionDigits = 0;
        internalSlots.maximumFractionDigits = 0;
        internalSlots.minimumSignificantDigits = 1;
        internalSlots.maximumSignificantDigits = 2;
    }
}
