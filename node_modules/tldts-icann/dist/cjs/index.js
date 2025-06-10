'use strict';

/**
 * Check if `vhost` is a valid suffix of `hostname` (top-domain)
 *
 * It means that `vhost` needs to be a suffix of `hostname` and we then need to
 * make sure that: either they are equal, or the character preceding `vhost` in
 * `hostname` is a '.' (it should not be a partial label).
 *
 * * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
 * * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
 * * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
 */
function shareSameDomainSuffix(hostname, vhost) {
    if (hostname.endsWith(vhost)) {
        return (hostname.length === vhost.length ||
            hostname[hostname.length - vhost.length - 1] === '.');
    }
    return false;
}
/**
 * Given a hostname and its public suffix, extract the general domain.
 */
function extractDomainWithSuffix(hostname, publicSuffix) {
    // Locate the index of the last '.' in the part of the `hostname` preceding
    // the public suffix.
    //
    // examples:
    //   1. not.evil.co.uk  => evil.co.uk
    //         ^    ^
    //         |    | start of public suffix
    //         | index of the last dot
    //
    //   2. example.co.uk   => example.co.uk
    //     ^       ^
    //     |       | start of public suffix
    //     |
    //     | (-1) no dot found before the public suffix
    const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
    const lastDotBeforeSuffixIndex = hostname.lastIndexOf('.', publicSuffixIndex);
    // No '.' found, then `hostname` is the general domain (no sub-domain)
    if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
    }
    // Extract the part between the last '.'
    return hostname.slice(lastDotBeforeSuffixIndex + 1);
}
/**
 * Detects the domain based on rules and upon and a host string
 */
function getDomain$1(suffix, hostname, options) {
    // Check if `hostname` ends with a member of `validHosts`.
    if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (const vhost of validHosts) {
            if ( /*@__INLINE__*/shareSameDomainSuffix(hostname, vhost)) {
                return vhost;
            }
        }
    }
    let numberOfLeadingDots = 0;
    if (hostname.startsWith('.')) {
        while (numberOfLeadingDots < hostname.length &&
            hostname[numberOfLeadingDots] === '.') {
            numberOfLeadingDots += 1;
        }
    }
    // If `hostname` is a valid public suffix, then there is no domain to return.
    // Since we already know that `getPublicSuffix` returns a suffix of `hostname`
    // there is no need to perform a string comparison and we only compare the
    // size.
    if (suffix.length === hostname.length - numberOfLeadingDots) {
        return null;
    }
    // To extract the general domain, we start by identifying the public suffix
    // (if any), then consider the domain to be the public suffix with one added
    // level of depth. (e.g.: if hostname is `not.evil.co.uk` and public suffix:
    // `co.uk`, then we take one more level: `evil`, giving the final result:
    // `evil.co.uk`).
    return /*@__INLINE__*/ extractDomainWithSuffix(hostname, suffix);
}

/**
 * Return the part of domain without suffix.
 *
 * Example: for domain 'foo.com', the result would be 'foo'.
 */
function getDomainWithoutSuffix$1(domain, suffix) {
    // Note: here `domain` and `suffix` cannot have the same length because in
    // this case we set `domain` to `null` instead. It is thus safe to assume
    // that `suffix` is shorter than `domain`.
    return domain.slice(0, -suffix.length - 1);
}

/**
 * @param url - URL we want to extract a hostname from.
 * @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
 */
function extractHostname(url, urlIsValidHostname) {
    let start = 0;
    let end = url.length;
    let hasUpper = false;
    // If url is not already a valid hostname, then try to extract hostname.
    if (!urlIsValidHostname) {
        // Special handling of data URLs
        if (url.startsWith('data:')) {
            return null;
        }
        // Trim leading spaces
        while (start < url.length && url.charCodeAt(start) <= 32) {
            start += 1;
        }
        // Trim trailing spaces
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
            end -= 1;
        }
        // Skip scheme.
        if (url.charCodeAt(start) === 47 /* '/' */ &&
            url.charCodeAt(start + 1) === 47 /* '/' */) {
            start += 2;
        }
        else {
            const indexOfProtocol = url.indexOf(':/', start);
            if (indexOfProtocol !== -1) {
                // Implement fast-path for common protocols. We expect most protocols
                // should be one of these 4 and thus we will not need to perform the
                // more expansive validity check most of the time.
                const protocolSize = indexOfProtocol - start;
                const c0 = url.charCodeAt(start);
                const c1 = url.charCodeAt(start + 1);
                const c2 = url.charCodeAt(start + 2);
                const c3 = url.charCodeAt(start + 3);
                const c4 = url.charCodeAt(start + 4);
                if (protocolSize === 5 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */ &&
                    c4 === 115 /* 's' */) ;
                else if (protocolSize === 4 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */) ;
                else if (protocolSize === 3 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */ &&
                    c2 === 115 /* 's' */) ;
                else if (protocolSize === 2 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */) ;
                else {
                    // Check that scheme is valid
                    for (let i = start; i < indexOfProtocol; i += 1) {
                        const lowerCaseCode = url.charCodeAt(i) | 32;
                        if (!(((lowerCaseCode >= 97 && lowerCaseCode <= 122) || // [a, z]
                            (lowerCaseCode >= 48 && lowerCaseCode <= 57) || // [0, 9]
                            lowerCaseCode === 46 || // '.'
                            lowerCaseCode === 45 || // '-'
                            lowerCaseCode === 43) // '+'
                        )) {
                            return null;
                        }
                    }
                }
                // Skip 0, 1 or more '/' after ':/'
                start = indexOfProtocol + 2;
                while (url.charCodeAt(start) === 47 /* '/' */) {
                    start += 1;
                }
            }
        }
        // Detect first occurrence of '/', '?' or '#'. We also keep track of the
        // last occurrence of '@', ']' or ':' to speed-up subsequent parsing of
        // (respectively), identifier, ipv6 or port.
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        for (let i = start; i < end; i += 1) {
            const code = url.charCodeAt(i);
            if (code === 35 || // '#'
                code === 47 || // '/'
                code === 63 // '?'
            ) {
                end = i;
                break;
            }
            else if (code === 64) {
                // '@'
                indexOfIdentifier = i;
            }
            else if (code === 93) {
                // ']'
                indexOfClosingBracket = i;
            }
            else if (code === 58) {
                // ':'
                indexOfPort = i;
            }
            else if (code >= 65 && code <= 90) {
                hasUpper = true;
            }
        }
        // Detect identifier: '@'
        if (indexOfIdentifier !== -1 &&
            indexOfIdentifier > start &&
            indexOfIdentifier < end) {
            start = indexOfIdentifier + 1;
        }
        // Handle ipv6 addresses
        if (url.charCodeAt(start) === 91 /* '[' */) {
            if (indexOfClosingBracket !== -1) {
                return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
            }
            return null;
        }
        else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) {
            // Detect port: ':'
            end = indexOfPort;
        }
    }
    // Trim trailing dots
    while (end > start + 1 && url.charCodeAt(end - 1) === 46 /* '.' */) {
        end -= 1;
    }
    const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
    if (hasUpper) {
        return hostname.toLowerCase();
    }
    return hostname;
}

/**
 * Check if a hostname is an IP. You should be aware that this only works
 * because `hostname` is already garanteed to be a valid hostname!
 */
function isProbablyIpv4(hostname) {
    // Cannot be shorted than 1.1.1.1
    if (hostname.length < 7) {
        return false;
    }
    // Cannot be longer than: 255.255.255.255
    if (hostname.length > 15) {
        return false;
    }
    let numberOfDots = 0;
    for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            numberOfDots += 1;
        }
        else if (code < 48 /* '0' */ || code > 57 /* '9' */) {
            return false;
        }
    }
    return (numberOfDots === 3 &&
        hostname.charCodeAt(0) !== 46 /* '.' */ &&
        hostname.charCodeAt(hostname.length - 1) !== 46 /* '.' */);
}
/**
 * Similar to isProbablyIpv4.
 */
function isProbablyIpv6(hostname) {
    if (hostname.length < 3) {
        return false;
    }
    let start = hostname.startsWith('[') ? 1 : 0;
    let end = hostname.length;
    if (hostname[end - 1] === ']') {
        end -= 1;
    }
    // We only consider the maximum size of a normal IPV6. Note that this will
    // fail on so-called "IPv4 mapped IPv6 addresses" but this is a corner-case
    // and a proper validation library should be used for these.
    if (end - start > 39) {
        return false;
    }
    let hasColon = false;
    for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58 /* ':' */) {
            hasColon = true;
        }
        else if (!(((code >= 48 && code <= 57) || // 0-9
            (code >= 97 && code <= 102) || // a-f
            (code >= 65 && code <= 90)) // A-F
        )) {
            return false;
        }
    }
    return hasColon;
}
/**
 * Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
 * This *will not* work on any string. We need `hostname` to be a valid
 * hostname.
 */
function isIp(hostname) {
    return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
}

/**
 * Implements fast shallow verification of hostnames. This does not perform a
 * struct check on the content of labels (classes of Unicode characters, etc.)
 * but instead check that the structure is valid (number of labels, length of
 * labels, etc.).
 *
 * If you need stricter validation, consider using an external library.
 */
function isValidAscii(code) {
    return ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code > 127);
}
/**
 * Check if a hostname string is valid. It's usually a preliminary check before
 * trying to use getDomain or anything else.
 *
 * Beware: it does not check if the TLD exists.
 */
function isValidHostname (hostname) {
    if (hostname.length > 255) {
        return false;
    }
    if (hostname.length === 0) {
        return false;
    }
    if (
    /*@__INLINE__*/ !isValidAscii(hostname.charCodeAt(0)) &&
        hostname.charCodeAt(0) !== 46 && // '.' (dot)
        hostname.charCodeAt(0) !== 95 // '_' (underscore)
    ) {
        return false;
    }
    // Validate hostname according to RFC
    let lastDotIndex = -1;
    let lastCharCode = -1;
    const len = hostname.length;
    for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 ||
                // Check that previous character was not already a '.'
                lastCharCode === 46 ||
                // Check that the previous label does not end with a '-' (dash)
                lastCharCode === 45 ||
                // Check that the previous label does not end with a '_' (underscore)
                lastCharCode === 95) {
                return false;
            }
            lastDotIndex = i;
        }
        else if (!( /*@__INLINE__*/(isValidAscii(code) || code === 45 || code === 95))) {
            // Check if there is a forbidden character in the label
            return false;
        }
        lastCharCode = code;
    }
    return (
    // Check that last label is shorter than 63 chars
    len - lastDotIndex - 1 <= 63 &&
        // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45);
}

function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname = true, mixedInputs = true, validHosts = null, validateHostname = true, }) {
    return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        extractHostname,
        mixedInputs,
        validHosts,
        validateHostname,
    };
}
const DEFAULT_OPTIONS = /*@__INLINE__*/ setDefaultsImpl({});
function setDefaults(options) {
    if (options === undefined) {
        return DEFAULT_OPTIONS;
    }
    return /*@__INLINE__*/ setDefaultsImpl(options);
}

/**
 * Returns the subdomain of a hostname string
 */
function getSubdomain$1(hostname, domain) {
    // If `hostname` and `domain` are the same, then there is no sub-domain
    if (domain.length === hostname.length) {
        return '';
    }
    return hostname.slice(0, -domain.length - 1);
}

/**
 * Implement a factory allowing to plug different implementations of suffix
 * lookup (e.g.: using a trie or the packed hashes datastructures). This is used
 * and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
 */
function getEmptyResult() {
    return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        publicSuffix: null,
        subdomain: null,
    };
}
function resetResult(result) {
    result.domain = null;
    result.domainWithoutSuffix = null;
    result.hostname = null;
    result.isIcann = null;
    result.isIp = null;
    result.isPrivate = null;
    result.publicSuffix = null;
    result.subdomain = null;
}
function parseImpl(url, step, suffixLookup, partialOptions, result) {
    const options = /*@__INLINE__*/ setDefaults(partialOptions);
    // Very fast approximate check to make sure `url` is a string. This is needed
    // because the library will not necessarily be used in a typed setup and
    // values of arbitrary types might be given as argument.
    if (typeof url !== 'string') {
        return result;
    }
    // Extract hostname from `url` only if needed. This can be made optional
    // using `options.extractHostname`. This option will typically be used
    // whenever we are sure the inputs to `parse` are already hostnames and not
    // arbitrary URLs.
    //
    // `mixedInput` allows to specify if we expect a mix of URLs and hostnames
    // as input. If only hostnames are expected then `extractHostname` can be
    // set to `false` to speed-up parsing. If only URLs are expected then
    // `mixedInputs` can be set to `false`. The `mixedInputs` is only a hint
    // and will not change the behavior of the library.
    if (!options.extractHostname) {
        result.hostname = url;
    }
    else if (options.mixedInputs) {
        result.hostname = extractHostname(url, isValidHostname(url));
    }
    else {
        result.hostname = extractHostname(url, false);
    }
    if (step === 0 /* FLAG.HOSTNAME */ || result.hostname === null) {
        return result;
    }
    // Check if `hostname` is a valid ip address
    if (options.detectIp) {
        result.isIp = isIp(result.hostname);
        if (result.isIp) {
            return result;
        }
    }
    // Perform optional hostname validation. If hostname is not valid, no need to
    // go further as there will be no valid domain or sub-domain.
    if (options.validateHostname &&
        options.extractHostname &&
        !isValidHostname(result.hostname)) {
        result.hostname = null;
        return result;
    }
    // Extract public suffix
    suffixLookup(result.hostname, options, result);
    if (step === 2 /* FLAG.PUBLIC_SUFFIX */ || result.publicSuffix === null) {
        return result;
    }
    // Extract domain
    result.domain = getDomain$1(result.publicSuffix, result.hostname, options);
    if (step === 3 /* FLAG.DOMAIN */ || result.domain === null) {
        return result;
    }
    // Extract subdomain
    result.subdomain = getSubdomain$1(result.hostname, result.domain);
    if (step === 4 /* FLAG.SUB_DOMAIN */) {
        return result;
    }
    // Extract domain without suffix
    result.domainWithoutSuffix = getDomainWithoutSuffix$1(result.domain, result.publicSuffix);
    return result;
}

function fastPathLookup (hostname, options, out) {
    // Fast path for very popular suffixes; this allows to by-pass lookup
    // completely as well as any extra allocation or string manipulation.
    if (!options.allowPrivateDomains && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 /* 'm' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 99 /* 'c' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'com';
            return true;
        }
        else if (c3 === 103 /* 'g' */ &&
            c2 === 114 /* 'r' */ &&
            c1 === 111 /* 'o' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'org';
            return true;
        }
        else if (c3 === 117 /* 'u' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 101 /* 'e' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'edu';
            return true;
        }
        else if (c3 === 118 /* 'v' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 103 /* 'g' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'gov';
            return true;
        }
        else if (c3 === 116 /* 't' */ &&
            c2 === 101 /* 'e' */ &&
            c1 === 110 /* 'n' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'net';
            return true;
        }
        else if (c3 === 101 /* 'e' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'de';
            return true;
        }
    }
    return false;
}

const exceptions = (function () {
    const _64 = [1, {}], _65 = [0, { "city": _64 }];
    const exceptions = [0, { "ck": [0, { "www": _64 }], "jp": [0, { "kawasaki": _65, "kitakyushu": _65, "kobe": _65, "nagoya": _65, "sapporo": _65, "sendai": _65, "yokohama": _65 }] }];
    return exceptions;
})();
const rules = (function () {
    const _66 = [1, {}], _67 = [1, { "com": _66, "edu": _66, "gov": _66, "mil": _66, "net": _66, "org": _66 }], _68 = [1, { "com": _66, "edu": _66, "gov": _66, "net": _66, "org": _66 }], _69 = [1, { "gov": _66 }], _70 = [0, { "*": _66 }], _71 = [1, { "co": _66, "com": _66, "edu": _66, "gov": _66, "net": _66, "org": _66 }], _72 = [1, { "com": _66, "edu": _66, "net": _66, "org": _66 }], _73 = [1, { "co": _66, "net": _66, "org": _66 }], _74 = [1, { "co": _66, "com": _66, "edu": _66, "gov": _66, "mil": _66, "net": _66, "nom": _66, "org": _66 }], _75 = [1, { "biz": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "net": _66, "org": _66 }], _76 = [1, { "gs": _66 }], _77 = [0, { "nes": _66 }], _78 = [1, { "k12": _66, "cc": _66, "lib": _66 }], _79 = [1, { "cc": _66 }], _80 = [1, { "cc": _66, "lib": _66 }];
    const rules = [0, { "ac": _67, "ad": _66, "ae": [1, { "ac": _66, "co": _66, "gov": _66, "mil": _66, "net": _66, "org": _66, "sch": _66 }], "aero": [1, { "airline": _66, "airport": _66, "accident-investigation": _66, "accident-prevention": _66, "aerobatic": _66, "aeroclub": _66, "aerodrome": _66, "agents": _66, "air-surveillance": _66, "air-traffic-control": _66, "aircraft": _66, "airtraffic": _66, "ambulance": _66, "association": _66, "author": _66, "ballooning": _66, "broker": _66, "caa": _66, "cargo": _66, "catering": _66, "certification": _66, "championship": _66, "charter": _66, "civilaviation": _66, "club": _66, "conference": _66, "consultant": _66, "consulting": _66, "control": _66, "council": _66, "crew": _66, "design": _66, "dgca": _66, "educator": _66, "emergency": _66, "engine": _66, "engineer": _66, "entertainment": _66, "equipment": _66, "exchange": _66, "express": _66, "federation": _66, "flight": _66, "freight": _66, "fuel": _66, "gliding": _66, "government": _66, "groundhandling": _66, "group": _66, "hanggliding": _66, "homebuilt": _66, "insurance": _66, "journal": _66, "journalist": _66, "leasing": _66, "logistics": _66, "magazine": _66, "maintenance": _66, "marketplace": _66, "media": _66, "microlight": _66, "modelling": _66, "navigation": _66, "parachuting": _66, "paragliding": _66, "passenger-association": _66, "pilot": _66, "press": _66, "production": _66, "recreation": _66, "repbody": _66, "res": _66, "research": _66, "rotorcraft": _66, "safety": _66, "scientist": _66, "services": _66, "show": _66, "skydiving": _66, "software": _66, "student": _66, "taxi": _66, "trader": _66, "trading": _66, "trainer": _66, "union": _66, "workinggroup": _66, "works": _66 }], "af": _68, "ag": [1, { "co": _66, "com": _66, "net": _66, "nom": _66, "org": _66 }], "ai": [1, { "com": _66, "net": _66, "off": _66, "org": _66 }], "al": _67, "am": [1, { "co": _66, "com": _66, "commune": _66, "net": _66, "org": _66 }], "ao": [1, { "co": _66, "ed": _66, "edu": _66, "gov": _66, "gv": _66, "it": _66, "og": _66, "org": _66, "pb": _66 }], "aq": _66, "ar": [1, { "bet": _66, "com": _66, "coop": _66, "edu": _66, "gob": _66, "gov": _66, "int": _66, "mil": _66, "musica": _66, "mutual": _66, "net": _66, "org": _66, "seg": _66, "senasa": _66, "tur": _66 }], "arpa": [1, { "e164": _66, "home": _66, "in-addr": _66, "ip6": _66, "iris": _66, "uri": _66, "urn": _66 }], "as": _69, "asia": _66, "at": [1, { "ac": [1, { "sth": _66 }], "co": _66, "gv": _66, "or": _66 }], "au": [1, { "asn": _66, "com": _66, "edu": [1, { "act": _66, "catholic": _66, "nsw": [1, { "schools": _66 }], "nt": _66, "qld": _66, "sa": _66, "tas": _66, "vic": _66, "wa": _66 }], "gov": [1, { "qld": _66, "sa": _66, "tas": _66, "vic": _66, "wa": _66 }], "id": _66, "net": _66, "org": _66, "conf": _66, "oz": _66, "act": _66, "nsw": _66, "nt": _66, "qld": _66, "sa": _66, "tas": _66, "vic": _66, "wa": _66 }], "aw": [1, { "com": _66 }], "ax": _66, "az": [1, { "biz": _66, "co": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "int": _66, "mil": _66, "name": _66, "net": _66, "org": _66, "pp": _66, "pro": _66 }], "ba": _67, "bb": [1, { "biz": _66, "co": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "net": _66, "org": _66, "store": _66, "tv": _66 }], "bd": _70, "be": [1, { "ac": _66 }], "bf": _69, "bg": [1, { "0": _66, "1": _66, "2": _66, "3": _66, "4": _66, "5": _66, "6": _66, "7": _66, "8": _66, "9": _66, "a": _66, "b": _66, "c": _66, "d": _66, "e": _66, "f": _66, "g": _66, "h": _66, "i": _66, "j": _66, "k": _66, "l": _66, "m": _66, "n": _66, "o": _66, "p": _66, "q": _66, "r": _66, "s": _66, "t": _66, "u": _66, "v": _66, "w": _66, "x": _66, "y": _66, "z": _66 }], "bh": _68, "bi": [1, { "co": _66, "com": _66, "edu": _66, "or": _66, "org": _66 }], "biz": _66, "bj": [1, { "africa": _66, "agro": _66, "architectes": _66, "assur": _66, "avocats": _66, "co": _66, "com": _66, "eco": _66, "econo": _66, "edu": _66, "info": _66, "loisirs": _66, "money": _66, "net": _66, "org": _66, "ote": _66, "restaurant": _66, "resto": _66, "tourism": _66, "univ": _66 }], "bm": _68, "bn": _68, "bo": [1, { "com": _66, "edu": _66, "gob": _66, "int": _66, "mil": _66, "net": _66, "org": _66, "tv": _66, "web": _66, "academia": _66, "agro": _66, "arte": _66, "blog": _66, "bolivia": _66, "ciencia": _66, "cooperativa": _66, "democracia": _66, "deporte": _66, "ecologia": _66, "economia": _66, "empresa": _66, "indigena": _66, "industria": _66, "info": _66, "medicina": _66, "movimiento": _66, "musica": _66, "natural": _66, "nombre": _66, "noticias": _66, "patria": _66, "plurinacional": _66, "politica": _66, "profesional": _66, "pueblo": _66, "revista": _66, "salud": _66, "tecnologia": _66, "tksat": _66, "transporte": _66, "wiki": _66 }], "br": [1, { "9guacu": _66, "abc": _66, "adm": _66, "adv": _66, "agr": _66, "aju": _66, "am": _66, "anani": _66, "aparecida": _66, "app": _66, "arq": _66, "art": _66, "ato": _66, "b": _66, "barueri": _66, "belem": _66, "bet": _66, "bhz": _66, "bib": _66, "bio": _66, "blog": _66, "bmd": _66, "boavista": _66, "bsb": _66, "campinagrande": _66, "campinas": _66, "caxias": _66, "cim": _66, "cng": _66, "cnt": _66, "com": _66, "contagem": _66, "coop": _66, "coz": _66, "cri": _66, "cuiaba": _66, "curitiba": _66, "def": _66, "des": _66, "det": _66, "dev": _66, "ecn": _66, "eco": _66, "edu": _66, "emp": _66, "enf": _66, "eng": _66, "esp": _66, "etc": _66, "eti": _66, "far": _66, "feira": _66, "flog": _66, "floripa": _66, "fm": _66, "fnd": _66, "fortal": _66, "fot": _66, "foz": _66, "fst": _66, "g12": _66, "geo": _66, "ggf": _66, "goiania": _66, "gov": [1, { "ac": _66, "al": _66, "am": _66, "ap": _66, "ba": _66, "ce": _66, "df": _66, "es": _66, "go": _66, "ma": _66, "mg": _66, "ms": _66, "mt": _66, "pa": _66, "pb": _66, "pe": _66, "pi": _66, "pr": _66, "rj": _66, "rn": _66, "ro": _66, "rr": _66, "rs": _66, "sc": _66, "se": _66, "sp": _66, "to": _66 }], "gru": _66, "imb": _66, "ind": _66, "inf": _66, "jab": _66, "jampa": _66, "jdf": _66, "joinville": _66, "jor": _66, "jus": _66, "leg": _66, "leilao": _66, "lel": _66, "log": _66, "londrina": _66, "macapa": _66, "maceio": _66, "manaus": _66, "maringa": _66, "mat": _66, "med": _66, "mil": _66, "morena": _66, "mp": _66, "mus": _66, "natal": _66, "net": _66, "niteroi": _66, "nom": _70, "not": _66, "ntr": _66, "odo": _66, "ong": _66, "org": _66, "osasco": _66, "palmas": _66, "poa": _66, "ppg": _66, "pro": _66, "psc": _66, "psi": _66, "pvh": _66, "qsl": _66, "radio": _66, "rec": _66, "recife": _66, "rep": _66, "ribeirao": _66, "rio": _66, "riobranco": _66, "riopreto": _66, "salvador": _66, "sampa": _66, "santamaria": _66, "santoandre": _66, "saobernardo": _66, "saogonca": _66, "seg": _66, "sjc": _66, "slg": _66, "slz": _66, "sorocaba": _66, "srv": _66, "taxi": _66, "tc": _66, "tec": _66, "teo": _66, "the": _66, "tmp": _66, "trd": _66, "tur": _66, "tv": _66, "udi": _66, "vet": _66, "vix": _66, "vlog": _66, "wiki": _66, "zlg": _66 }], "bs": _68, "bt": _68, "bv": _66, "bw": [1, { "ac": _66, "co": _66, "gov": _66, "net": _66, "org": _66 }], "by": [1, { "gov": _66, "mil": _66, "com": _66, "of": _66 }], "bz": _71, "ca": [1, { "ab": _66, "bc": _66, "mb": _66, "nb": _66, "nf": _66, "nl": _66, "ns": _66, "nt": _66, "nu": _66, "on": _66, "pe": _66, "qc": _66, "sk": _66, "yk": _66, "gc": _66 }], "cat": _66, "cc": _66, "cd": _69, "cf": _66, "cg": _66, "ch": _66, "ci": [1, { "ac": _66, "xn--aroport-bya": _66, "aéroport": _66, "asso": _66, "co": _66, "com": _66, "ed": _66, "edu": _66, "go": _66, "gouv": _66, "int": _66, "net": _66, "or": _66, "org": _66 }], "ck": _70, "cl": [1, { "co": _66, "gob": _66, "gov": _66, "mil": _66 }], "cm": [1, { "co": _66, "com": _66, "gov": _66, "net": _66 }], "cn": [1, { "ac": _66, "com": _66, "edu": _66, "gov": _66, "mil": _66, "net": _66, "org": _66, "xn--55qx5d": _66, "公司": _66, "xn--od0alg": _66, "網絡": _66, "xn--io0a7i": _66, "网络": _66, "ah": _66, "bj": _66, "cq": _66, "fj": _66, "gd": _66, "gs": _66, "gx": _66, "gz": _66, "ha": _66, "hb": _66, "he": _66, "hi": _66, "hk": _66, "hl": _66, "hn": _66, "jl": _66, "js": _66, "jx": _66, "ln": _66, "mo": _66, "nm": _66, "nx": _66, "qh": _66, "sc": _66, "sd": _66, "sh": _66, "sn": _66, "sx": _66, "tj": _66, "tw": _66, "xj": _66, "xz": _66, "yn": _66, "zj": _66 }], "co": [1, { "com": _66, "edu": _66, "gov": _66, "mil": _66, "net": _66, "nom": _66, "org": _66 }], "com": _66, "coop": _66, "cr": [1, { "ac": _66, "co": _66, "ed": _66, "fi": _66, "go": _66, "or": _66, "sa": _66 }], "cu": [1, { "com": _66, "edu": _66, "gob": _66, "inf": _66, "nat": _66, "net": _66, "org": _66 }], "cv": [1, { "com": _66, "edu": _66, "id": _66, "int": _66, "net": _66, "nome": _66, "org": _66, "publ": _66 }], "cw": _72, "cx": _69, "cy": [1, { "ac": _66, "biz": _66, "com": _66, "ekloges": _66, "gov": _66, "ltd": _66, "mil": _66, "net": _66, "org": _66, "press": _66, "pro": _66, "tm": _66 }], "cz": _66, "de": _66, "dj": _66, "dk": _66, "dm": _71, "do": [1, { "art": _66, "com": _66, "edu": _66, "gob": _66, "gov": _66, "mil": _66, "net": _66, "org": _66, "sld": _66, "web": _66 }], "dz": [1, { "art": _66, "asso": _66, "com": _66, "edu": _66, "gov": _66, "net": _66, "org": _66, "pol": _66, "soc": _66, "tm": _66 }], "ec": [1, { "com": _66, "edu": _66, "fin": _66, "gob": _66, "gov": _66, "info": _66, "k12": _66, "med": _66, "mil": _66, "net": _66, "org": _66, "pro": _66 }], "edu": _66, "ee": [1, { "aip": _66, "com": _66, "edu": _66, "fie": _66, "gov": _66, "lib": _66, "med": _66, "org": _66, "pri": _66, "riik": _66 }], "eg": [1, { "ac": _66, "com": _66, "edu": _66, "eun": _66, "gov": _66, "info": _66, "me": _66, "mil": _66, "name": _66, "net": _66, "org": _66, "sci": _66, "sport": _66, "tv": _66 }], "er": _70, "es": [1, { "com": _66, "edu": _66, "gob": _66, "nom": _66, "org": _66 }], "et": [1, { "biz": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "name": _66, "net": _66, "org": _66 }], "eu": _66, "fi": [1, { "aland": _66 }], "fj": [1, { "ac": _66, "biz": _66, "com": _66, "gov": _66, "info": _66, "mil": _66, "name": _66, "net": _66, "org": _66, "pro": _66 }], "fk": _70, "fm": _72, "fo": _66, "fr": [1, { "asso": _66, "com": _66, "gouv": _66, "nom": _66, "prd": _66, "tm": _66, "avoues": _66, "cci": _66, "greta": _66, "huissier-justice": _66 }], "ga": _66, "gb": _66, "gd": [1, { "edu": _66, "gov": _66 }], "ge": [1, { "com": _66, "edu": _66, "gov": _66, "net": _66, "org": _66, "pvt": _66, "school": _66 }], "gf": _66, "gg": _73, "gh": [1, { "com": _66, "edu": _66, "gov": _66, "mil": _66, "org": _66 }], "gi": [1, { "com": _66, "edu": _66, "gov": _66, "ltd": _66, "mod": _66, "org": _66 }], "gl": [1, { "co": _66, "com": _66, "edu": _66, "net": _66, "org": _66 }], "gm": _66, "gn": [1, { "ac": _66, "com": _66, "edu": _66, "gov": _66, "net": _66, "org": _66 }], "gov": _66, "gp": [1, { "asso": _66, "com": _66, "edu": _66, "mobi": _66, "net": _66, "org": _66 }], "gq": _66, "gr": _68, "gs": _66, "gt": [1, { "com": _66, "edu": _66, "gob": _66, "ind": _66, "mil": _66, "net": _66, "org": _66 }], "gu": [1, { "com": _66, "edu": _66, "gov": _66, "guam": _66, "info": _66, "net": _66, "org": _66, "web": _66 }], "gw": _66, "gy": _71, "hk": [1, { "com": _66, "edu": _66, "gov": _66, "idv": _66, "net": _66, "org": _66, "xn--ciqpn": _66, "个人": _66, "xn--gmqw5a": _66, "個人": _66, "xn--55qx5d": _66, "公司": _66, "xn--mxtq1m": _66, "政府": _66, "xn--lcvr32d": _66, "敎育": _66, "xn--wcvs22d": _66, "教育": _66, "xn--gmq050i": _66, "箇人": _66, "xn--uc0atv": _66, "組織": _66, "xn--uc0ay4a": _66, "組织": _66, "xn--od0alg": _66, "網絡": _66, "xn--zf0avx": _66, "網络": _66, "xn--mk0axi": _66, "组織": _66, "xn--tn0ag": _66, "组织": _66, "xn--od0aq3b": _66, "网絡": _66, "xn--io0a7i": _66, "网络": _66 }], "hm": _66, "hn": [1, { "com": _66, "edu": _66, "gob": _66, "mil": _66, "net": _66, "org": _66 }], "hr": [1, { "com": _66, "from": _66, "iz": _66, "name": _66 }], "ht": [1, { "adult": _66, "art": _66, "asso": _66, "com": _66, "coop": _66, "edu": _66, "firm": _66, "gouv": _66, "info": _66, "med": _66, "net": _66, "org": _66, "perso": _66, "pol": _66, "pro": _66, "rel": _66, "shop": _66 }], "hu": [1, { "2000": _66, "agrar": _66, "bolt": _66, "casino": _66, "city": _66, "co": _66, "erotica": _66, "erotika": _66, "film": _66, "forum": _66, "games": _66, "hotel": _66, "info": _66, "ingatlan": _66, "jogasz": _66, "konyvelo": _66, "lakas": _66, "media": _66, "news": _66, "org": _66, "priv": _66, "reklam": _66, "sex": _66, "shop": _66, "sport": _66, "suli": _66, "szex": _66, "tm": _66, "tozsde": _66, "utazas": _66, "video": _66 }], "id": [1, { "ac": _66, "biz": _66, "co": _66, "desa": _66, "go": _66, "mil": _66, "my": _66, "net": _66, "or": _66, "ponpes": _66, "sch": _66, "web": _66 }], "ie": _69, "il": [1, { "ac": _66, "co": _66, "gov": _66, "idf": _66, "k12": _66, "muni": _66, "net": _66, "org": _66 }], "xn--4dbrk0ce": [1, { "xn--4dbgdty6c": _66, "xn--5dbhl8d": _66, "xn--8dbq2a": _66, "xn--hebda8b": _66 }], "ישראל": [1, { "אקדמיה": _66, "ישוב": _66, "צהל": _66, "ממשל": _66 }], "im": [1, { "ac": _66, "co": [1, { "ltd": _66, "plc": _66 }], "com": _66, "net": _66, "org": _66, "tt": _66, "tv": _66 }], "in": [1, { "5g": _66, "6g": _66, "ac": _66, "ai": _66, "am": _66, "bihar": _66, "biz": _66, "business": _66, "ca": _66, "cn": _66, "co": _66, "com": _66, "coop": _66, "cs": _66, "delhi": _66, "dr": _66, "edu": _66, "er": _66, "firm": _66, "gen": _66, "gov": _66, "gujarat": _66, "ind": _66, "info": _66, "int": _66, "internet": _66, "io": _66, "me": _66, "mil": _66, "net": _66, "nic": _66, "org": _66, "pg": _66, "post": _66, "pro": _66, "res": _66, "travel": _66, "tv": _66, "uk": _66, "up": _66, "us": _66 }], "info": _66, "int": [1, { "eu": _66 }], "io": _74, "iq": _67, "ir": [1, { "ac": _66, "co": _66, "gov": _66, "id": _66, "net": _66, "org": _66, "sch": _66, "xn--mgba3a4f16a": _66, "ایران": _66, "xn--mgba3a4fra": _66, "ايران": _66 }], "is": _66, "it": [1, { "edu": _66, "gov": _66, "abr": _66, "abruzzo": _66, "aosta-valley": _66, "aostavalley": _66, "bas": _66, "basilicata": _66, "cal": _66, "calabria": _66, "cam": _66, "campania": _66, "emilia-romagna": _66, "emiliaromagna": _66, "emr": _66, "friuli-v-giulia": _66, "friuli-ve-giulia": _66, "friuli-vegiulia": _66, "friuli-venezia-giulia": _66, "friuli-veneziagiulia": _66, "friuli-vgiulia": _66, "friuliv-giulia": _66, "friulive-giulia": _66, "friulivegiulia": _66, "friulivenezia-giulia": _66, "friuliveneziagiulia": _66, "friulivgiulia": _66, "fvg": _66, "laz": _66, "lazio": _66, "lig": _66, "liguria": _66, "lom": _66, "lombardia": _66, "lombardy": _66, "lucania": _66, "mar": _66, "marche": _66, "mol": _66, "molise": _66, "piedmont": _66, "piemonte": _66, "pmn": _66, "pug": _66, "puglia": _66, "sar": _66, "sardegna": _66, "sardinia": _66, "sic": _66, "sicilia": _66, "sicily": _66, "taa": _66, "tos": _66, "toscana": _66, "trentin-sud-tirol": _66, "xn--trentin-sd-tirol-rzb": _66, "trentin-süd-tirol": _66, "trentin-sudtirol": _66, "xn--trentin-sdtirol-7vb": _66, "trentin-südtirol": _66, "trentin-sued-tirol": _66, "trentin-suedtirol": _66, "trentino": _66, "trentino-a-adige": _66, "trentino-aadige": _66, "trentino-alto-adige": _66, "trentino-altoadige": _66, "trentino-s-tirol": _66, "trentino-stirol": _66, "trentino-sud-tirol": _66, "xn--trentino-sd-tirol-c3b": _66, "trentino-süd-tirol": _66, "trentino-sudtirol": _66, "xn--trentino-sdtirol-szb": _66, "trentino-südtirol": _66, "trentino-sued-tirol": _66, "trentino-suedtirol": _66, "trentinoa-adige": _66, "trentinoaadige": _66, "trentinoalto-adige": _66, "trentinoaltoadige": _66, "trentinos-tirol": _66, "trentinostirol": _66, "trentinosud-tirol": _66, "xn--trentinosd-tirol-rzb": _66, "trentinosüd-tirol": _66, "trentinosudtirol": _66, "xn--trentinosdtirol-7vb": _66, "trentinosüdtirol": _66, "trentinosued-tirol": _66, "trentinosuedtirol": _66, "trentinsud-tirol": _66, "xn--trentinsd-tirol-6vb": _66, "trentinsüd-tirol": _66, "trentinsudtirol": _66, "xn--trentinsdtirol-nsb": _66, "trentinsüdtirol": _66, "trentinsued-tirol": _66, "trentinsuedtirol": _66, "tuscany": _66, "umb": _66, "umbria": _66, "val-d-aosta": _66, "val-daosta": _66, "vald-aosta": _66, "valdaosta": _66, "valle-aosta": _66, "valle-d-aosta": _66, "valle-daosta": _66, "valleaosta": _66, "valled-aosta": _66, "valledaosta": _66, "vallee-aoste": _66, "xn--valle-aoste-ebb": _66, "vallée-aoste": _66, "vallee-d-aoste": _66, "xn--valle-d-aoste-ehb": _66, "vallée-d-aoste": _66, "valleeaoste": _66, "xn--valleaoste-e7a": _66, "valléeaoste": _66, "valleedaoste": _66, "xn--valledaoste-ebb": _66, "valléedaoste": _66, "vao": _66, "vda": _66, "ven": _66, "veneto": _66, "ag": _66, "agrigento": _66, "al": _66, "alessandria": _66, "alto-adige": _66, "altoadige": _66, "an": _66, "ancona": _66, "andria-barletta-trani": _66, "andria-trani-barletta": _66, "andriabarlettatrani": _66, "andriatranibarletta": _66, "ao": _66, "aosta": _66, "aoste": _66, "ap": _66, "aq": _66, "aquila": _66, "ar": _66, "arezzo": _66, "ascoli-piceno": _66, "ascolipiceno": _66, "asti": _66, "at": _66, "av": _66, "avellino": _66, "ba": _66, "balsan": _66, "balsan-sudtirol": _66, "xn--balsan-sdtirol-nsb": _66, "balsan-südtirol": _66, "balsan-suedtirol": _66, "bari": _66, "barletta-trani-andria": _66, "barlettatraniandria": _66, "belluno": _66, "benevento": _66, "bergamo": _66, "bg": _66, "bi": _66, "biella": _66, "bl": _66, "bn": _66, "bo": _66, "bologna": _66, "bolzano": _66, "bolzano-altoadige": _66, "bozen": _66, "bozen-sudtirol": _66, "xn--bozen-sdtirol-2ob": _66, "bozen-südtirol": _66, "bozen-suedtirol": _66, "br": _66, "brescia": _66, "brindisi": _66, "bs": _66, "bt": _66, "bulsan": _66, "bulsan-sudtirol": _66, "xn--bulsan-sdtirol-nsb": _66, "bulsan-südtirol": _66, "bulsan-suedtirol": _66, "bz": _66, "ca": _66, "cagliari": _66, "caltanissetta": _66, "campidano-medio": _66, "campidanomedio": _66, "campobasso": _66, "carbonia-iglesias": _66, "carboniaiglesias": _66, "carrara-massa": _66, "carraramassa": _66, "caserta": _66, "catania": _66, "catanzaro": _66, "cb": _66, "ce": _66, "cesena-forli": _66, "xn--cesena-forl-mcb": _66, "cesena-forlì": _66, "cesenaforli": _66, "xn--cesenaforl-i8a": _66, "cesenaforlì": _66, "ch": _66, "chieti": _66, "ci": _66, "cl": _66, "cn": _66, "co": _66, "como": _66, "cosenza": _66, "cr": _66, "cremona": _66, "crotone": _66, "cs": _66, "ct": _66, "cuneo": _66, "cz": _66, "dell-ogliastra": _66, "dellogliastra": _66, "en": _66, "enna": _66, "fc": _66, "fe": _66, "fermo": _66, "ferrara": _66, "fg": _66, "fi": _66, "firenze": _66, "florence": _66, "fm": _66, "foggia": _66, "forli-cesena": _66, "xn--forl-cesena-fcb": _66, "forlì-cesena": _66, "forlicesena": _66, "xn--forlcesena-c8a": _66, "forlìcesena": _66, "fr": _66, "frosinone": _66, "ge": _66, "genoa": _66, "genova": _66, "go": _66, "gorizia": _66, "gr": _66, "grosseto": _66, "iglesias-carbonia": _66, "iglesiascarbonia": _66, "im": _66, "imperia": _66, "is": _66, "isernia": _66, "kr": _66, "la-spezia": _66, "laquila": _66, "laspezia": _66, "latina": _66, "lc": _66, "le": _66, "lecce": _66, "lecco": _66, "li": _66, "livorno": _66, "lo": _66, "lodi": _66, "lt": _66, "lu": _66, "lucca": _66, "macerata": _66, "mantova": _66, "massa-carrara": _66, "massacarrara": _66, "matera": _66, "mb": _66, "mc": _66, "me": _66, "medio-campidano": _66, "mediocampidano": _66, "messina": _66, "mi": _66, "milan": _66, "milano": _66, "mn": _66, "mo": _66, "modena": _66, "monza": _66, "monza-brianza": _66, "monza-e-della-brianza": _66, "monzabrianza": _66, "monzaebrianza": _66, "monzaedellabrianza": _66, "ms": _66, "mt": _66, "na": _66, "naples": _66, "napoli": _66, "no": _66, "novara": _66, "nu": _66, "nuoro": _66, "og": _66, "ogliastra": _66, "olbia-tempio": _66, "olbiatempio": _66, "or": _66, "oristano": _66, "ot": _66, "pa": _66, "padova": _66, "padua": _66, "palermo": _66, "parma": _66, "pavia": _66, "pc": _66, "pd": _66, "pe": _66, "perugia": _66, "pesaro-urbino": _66, "pesarourbino": _66, "pescara": _66, "pg": _66, "pi": _66, "piacenza": _66, "pisa": _66, "pistoia": _66, "pn": _66, "po": _66, "pordenone": _66, "potenza": _66, "pr": _66, "prato": _66, "pt": _66, "pu": _66, "pv": _66, "pz": _66, "ra": _66, "ragusa": _66, "ravenna": _66, "rc": _66, "re": _66, "reggio-calabria": _66, "reggio-emilia": _66, "reggiocalabria": _66, "reggioemilia": _66, "rg": _66, "ri": _66, "rieti": _66, "rimini": _66, "rm": _66, "rn": _66, "ro": _66, "roma": _66, "rome": _66, "rovigo": _66, "sa": _66, "salerno": _66, "sassari": _66, "savona": _66, "si": _66, "siena": _66, "siracusa": _66, "so": _66, "sondrio": _66, "sp": _66, "sr": _66, "ss": _66, "xn--sdtirol-n2a": _66, "südtirol": _66, "suedtirol": _66, "sv": _66, "ta": _66, "taranto": _66, "te": _66, "tempio-olbia": _66, "tempioolbia": _66, "teramo": _66, "terni": _66, "tn": _66, "to": _66, "torino": _66, "tp": _66, "tr": _66, "trani-andria-barletta": _66, "trani-barletta-andria": _66, "traniandriabarletta": _66, "tranibarlettaandria": _66, "trapani": _66, "trento": _66, "treviso": _66, "trieste": _66, "ts": _66, "turin": _66, "tv": _66, "ud": _66, "udine": _66, "urbino-pesaro": _66, "urbinopesaro": _66, "va": _66, "varese": _66, "vb": _66, "vc": _66, "ve": _66, "venezia": _66, "venice": _66, "verbania": _66, "vercelli": _66, "verona": _66, "vi": _66, "vibo-valentia": _66, "vibovalentia": _66, "vicenza": _66, "viterbo": _66, "vr": _66, "vs": _66, "vt": _66, "vv": _66 }], "je": _73, "jm": _70, "jo": [1, { "agri": _66, "ai": _66, "com": _66, "edu": _66, "eng": _66, "fm": _66, "gov": _66, "mil": _66, "net": _66, "org": _66, "per": _66, "phd": _66, "sch": _66, "tv": _66 }], "jobs": _66, "jp": [1, { "ac": _66, "ad": _66, "co": _66, "ed": _66, "go": _66, "gr": _66, "lg": _66, "ne": _66, "or": _66, "aichi": [1, { "aisai": _66, "ama": _66, "anjo": _66, "asuke": _66, "chiryu": _66, "chita": _66, "fuso": _66, "gamagori": _66, "handa": _66, "hazu": _66, "hekinan": _66, "higashiura": _66, "ichinomiya": _66, "inazawa": _66, "inuyama": _66, "isshiki": _66, "iwakura": _66, "kanie": _66, "kariya": _66, "kasugai": _66, "kira": _66, "kiyosu": _66, "komaki": _66, "konan": _66, "kota": _66, "mihama": _66, "miyoshi": _66, "nishio": _66, "nisshin": _66, "obu": _66, "oguchi": _66, "oharu": _66, "okazaki": _66, "owariasahi": _66, "seto": _66, "shikatsu": _66, "shinshiro": _66, "shitara": _66, "tahara": _66, "takahama": _66, "tobishima": _66, "toei": _66, "togo": _66, "tokai": _66, "tokoname": _66, "toyoake": _66, "toyohashi": _66, "toyokawa": _66, "toyone": _66, "toyota": _66, "tsushima": _66, "yatomi": _66 }], "akita": [1, { "akita": _66, "daisen": _66, "fujisato": _66, "gojome": _66, "hachirogata": _66, "happou": _66, "higashinaruse": _66, "honjo": _66, "honjyo": _66, "ikawa": _66, "kamikoani": _66, "kamioka": _66, "katagami": _66, "kazuno": _66, "kitaakita": _66, "kosaka": _66, "kyowa": _66, "misato": _66, "mitane": _66, "moriyoshi": _66, "nikaho": _66, "noshiro": _66, "odate": _66, "oga": _66, "ogata": _66, "semboku": _66, "yokote": _66, "yurihonjo": _66 }], "aomori": [1, { "aomori": _66, "gonohe": _66, "hachinohe": _66, "hashikami": _66, "hiranai": _66, "hirosaki": _66, "itayanagi": _66, "kuroishi": _66, "misawa": _66, "mutsu": _66, "nakadomari": _66, "noheji": _66, "oirase": _66, "owani": _66, "rokunohe": _66, "sannohe": _66, "shichinohe": _66, "shingo": _66, "takko": _66, "towada": _66, "tsugaru": _66, "tsuruta": _66 }], "chiba": [1, { "abiko": _66, "asahi": _66, "chonan": _66, "chosei": _66, "choshi": _66, "chuo": _66, "funabashi": _66, "futtsu": _66, "hanamigawa": _66, "ichihara": _66, "ichikawa": _66, "ichinomiya": _66, "inzai": _66, "isumi": _66, "kamagaya": _66, "kamogawa": _66, "kashiwa": _66, "katori": _66, "katsuura": _66, "kimitsu": _66, "kisarazu": _66, "kozaki": _66, "kujukuri": _66, "kyonan": _66, "matsudo": _66, "midori": _66, "mihama": _66, "minamiboso": _66, "mobara": _66, "mutsuzawa": _66, "nagara": _66, "nagareyama": _66, "narashino": _66, "narita": _66, "noda": _66, "oamishirasato": _66, "omigawa": _66, "onjuku": _66, "otaki": _66, "sakae": _66, "sakura": _66, "shimofusa": _66, "shirako": _66, "shiroi": _66, "shisui": _66, "sodegaura": _66, "sosa": _66, "tako": _66, "tateyama": _66, "togane": _66, "tohnosho": _66, "tomisato": _66, "urayasu": _66, "yachimata": _66, "yachiyo": _66, "yokaichiba": _66, "yokoshibahikari": _66, "yotsukaido": _66 }], "ehime": [1, { "ainan": _66, "honai": _66, "ikata": _66, "imabari": _66, "iyo": _66, "kamijima": _66, "kihoku": _66, "kumakogen": _66, "masaki": _66, "matsuno": _66, "matsuyama": _66, "namikata": _66, "niihama": _66, "ozu": _66, "saijo": _66, "seiyo": _66, "shikokuchuo": _66, "tobe": _66, "toon": _66, "uchiko": _66, "uwajima": _66, "yawatahama": _66 }], "fukui": [1, { "echizen": _66, "eiheiji": _66, "fukui": _66, "ikeda": _66, "katsuyama": _66, "mihama": _66, "minamiechizen": _66, "obama": _66, "ohi": _66, "ono": _66, "sabae": _66, "sakai": _66, "takahama": _66, "tsuruga": _66, "wakasa": _66 }], "fukuoka": [1, { "ashiya": _66, "buzen": _66, "chikugo": _66, "chikuho": _66, "chikujo": _66, "chikushino": _66, "chikuzen": _66, "chuo": _66, "dazaifu": _66, "fukuchi": _66, "hakata": _66, "higashi": _66, "hirokawa": _66, "hisayama": _66, "iizuka": _66, "inatsuki": _66, "kaho": _66, "kasuga": _66, "kasuya": _66, "kawara": _66, "keisen": _66, "koga": _66, "kurate": _66, "kurogi": _66, "kurume": _66, "minami": _66, "miyako": _66, "miyama": _66, "miyawaka": _66, "mizumaki": _66, "munakata": _66, "nakagawa": _66, "nakama": _66, "nishi": _66, "nogata": _66, "ogori": _66, "okagaki": _66, "okawa": _66, "oki": _66, "omuta": _66, "onga": _66, "onojo": _66, "oto": _66, "saigawa": _66, "sasaguri": _66, "shingu": _66, "shinyoshitomi": _66, "shonai": _66, "soeda": _66, "sue": _66, "tachiarai": _66, "tagawa": _66, "takata": _66, "toho": _66, "toyotsu": _66, "tsuiki": _66, "ukiha": _66, "umi": _66, "usui": _66, "yamada": _66, "yame": _66, "yanagawa": _66, "yukuhashi": _66 }], "fukushima": [1, { "aizubange": _66, "aizumisato": _66, "aizuwakamatsu": _66, "asakawa": _66, "bandai": _66, "date": _66, "fukushima": _66, "furudono": _66, "futaba": _66, "hanawa": _66, "higashi": _66, "hirata": _66, "hirono": _66, "iitate": _66, "inawashiro": _66, "ishikawa": _66, "iwaki": _66, "izumizaki": _66, "kagamiishi": _66, "kaneyama": _66, "kawamata": _66, "kitakata": _66, "kitashiobara": _66, "koori": _66, "koriyama": _66, "kunimi": _66, "miharu": _66, "mishima": _66, "namie": _66, "nango": _66, "nishiaizu": _66, "nishigo": _66, "okuma": _66, "omotego": _66, "ono": _66, "otama": _66, "samegawa": _66, "shimogo": _66, "shirakawa": _66, "showa": _66, "soma": _66, "sukagawa": _66, "taishin": _66, "tamakawa": _66, "tanagura": _66, "tenei": _66, "yabuki": _66, "yamato": _66, "yamatsuri": _66, "yanaizu": _66, "yugawa": _66 }], "gifu": [1, { "anpachi": _66, "ena": _66, "gifu": _66, "ginan": _66, "godo": _66, "gujo": _66, "hashima": _66, "hichiso": _66, "hida": _66, "higashishirakawa": _66, "ibigawa": _66, "ikeda": _66, "kakamigahara": _66, "kani": _66, "kasahara": _66, "kasamatsu": _66, "kawaue": _66, "kitagata": _66, "mino": _66, "minokamo": _66, "mitake": _66, "mizunami": _66, "motosu": _66, "nakatsugawa": _66, "ogaki": _66, "sakahogi": _66, "seki": _66, "sekigahara": _66, "shirakawa": _66, "tajimi": _66, "takayama": _66, "tarui": _66, "toki": _66, "tomika": _66, "wanouchi": _66, "yamagata": _66, "yaotsu": _66, "yoro": _66 }], "gunma": [1, { "annaka": _66, "chiyoda": _66, "fujioka": _66, "higashiagatsuma": _66, "isesaki": _66, "itakura": _66, "kanna": _66, "kanra": _66, "katashina": _66, "kawaba": _66, "kiryu": _66, "kusatsu": _66, "maebashi": _66, "meiwa": _66, "midori": _66, "minakami": _66, "naganohara": _66, "nakanojo": _66, "nanmoku": _66, "numata": _66, "oizumi": _66, "ora": _66, "ota": _66, "shibukawa": _66, "shimonita": _66, "shinto": _66, "showa": _66, "takasaki": _66, "takayama": _66, "tamamura": _66, "tatebayashi": _66, "tomioka": _66, "tsukiyono": _66, "tsumagoi": _66, "ueno": _66, "yoshioka": _66 }], "hiroshima": [1, { "asaminami": _66, "daiwa": _66, "etajima": _66, "fuchu": _66, "fukuyama": _66, "hatsukaichi": _66, "higashihiroshima": _66, "hongo": _66, "jinsekikogen": _66, "kaita": _66, "kui": _66, "kumano": _66, "kure": _66, "mihara": _66, "miyoshi": _66, "naka": _66, "onomichi": _66, "osakikamijima": _66, "otake": _66, "saka": _66, "sera": _66, "seranishi": _66, "shinichi": _66, "shobara": _66, "takehara": _66 }], "hokkaido": [1, { "abashiri": _66, "abira": _66, "aibetsu": _66, "akabira": _66, "akkeshi": _66, "asahikawa": _66, "ashibetsu": _66, "ashoro": _66, "assabu": _66, "atsuma": _66, "bibai": _66, "biei": _66, "bifuka": _66, "bihoro": _66, "biratori": _66, "chippubetsu": _66, "chitose": _66, "date": _66, "ebetsu": _66, "embetsu": _66, "eniwa": _66, "erimo": _66, "esan": _66, "esashi": _66, "fukagawa": _66, "fukushima": _66, "furano": _66, "furubira": _66, "haboro": _66, "hakodate": _66, "hamatonbetsu": _66, "hidaka": _66, "higashikagura": _66, "higashikawa": _66, "hiroo": _66, "hokuryu": _66, "hokuto": _66, "honbetsu": _66, "horokanai": _66, "horonobe": _66, "ikeda": _66, "imakane": _66, "ishikari": _66, "iwamizawa": _66, "iwanai": _66, "kamifurano": _66, "kamikawa": _66, "kamishihoro": _66, "kamisunagawa": _66, "kamoenai": _66, "kayabe": _66, "kembuchi": _66, "kikonai": _66, "kimobetsu": _66, "kitahiroshima": _66, "kitami": _66, "kiyosato": _66, "koshimizu": _66, "kunneppu": _66, "kuriyama": _66, "kuromatsunai": _66, "kushiro": _66, "kutchan": _66, "kyowa": _66, "mashike": _66, "matsumae": _66, "mikasa": _66, "minamifurano": _66, "mombetsu": _66, "moseushi": _66, "mukawa": _66, "muroran": _66, "naie": _66, "nakagawa": _66, "nakasatsunai": _66, "nakatombetsu": _66, "nanae": _66, "nanporo": _66, "nayoro": _66, "nemuro": _66, "niikappu": _66, "niki": _66, "nishiokoppe": _66, "noboribetsu": _66, "numata": _66, "obihiro": _66, "obira": _66, "oketo": _66, "okoppe": _66, "otaru": _66, "otobe": _66, "otofuke": _66, "otoineppu": _66, "oumu": _66, "ozora": _66, "pippu": _66, "rankoshi": _66, "rebun": _66, "rikubetsu": _66, "rishiri": _66, "rishirifuji": _66, "saroma": _66, "sarufutsu": _66, "shakotan": _66, "shari": _66, "shibecha": _66, "shibetsu": _66, "shikabe": _66, "shikaoi": _66, "shimamaki": _66, "shimizu": _66, "shimokawa": _66, "shinshinotsu": _66, "shintoku": _66, "shiranuka": _66, "shiraoi": _66, "shiriuchi": _66, "sobetsu": _66, "sunagawa": _66, "taiki": _66, "takasu": _66, "takikawa": _66, "takinoue": _66, "teshikaga": _66, "tobetsu": _66, "tohma": _66, "tomakomai": _66, "tomari": _66, "toya": _66, "toyako": _66, "toyotomi": _66, "toyoura": _66, "tsubetsu": _66, "tsukigata": _66, "urakawa": _66, "urausu": _66, "uryu": _66, "utashinai": _66, "wakkanai": _66, "wassamu": _66, "yakumo": _66, "yoichi": _66 }], "hyogo": [1, { "aioi": _66, "akashi": _66, "ako": _66, "amagasaki": _66, "aogaki": _66, "asago": _66, "ashiya": _66, "awaji": _66, "fukusaki": _66, "goshiki": _66, "harima": _66, "himeji": _66, "ichikawa": _66, "inagawa": _66, "itami": _66, "kakogawa": _66, "kamigori": _66, "kamikawa": _66, "kasai": _66, "kasuga": _66, "kawanishi": _66, "miki": _66, "minamiawaji": _66, "nishinomiya": _66, "nishiwaki": _66, "ono": _66, "sanda": _66, "sannan": _66, "sasayama": _66, "sayo": _66, "shingu": _66, "shinonsen": _66, "shiso": _66, "sumoto": _66, "taishi": _66, "taka": _66, "takarazuka": _66, "takasago": _66, "takino": _66, "tamba": _66, "tatsuno": _66, "toyooka": _66, "yabu": _66, "yashiro": _66, "yoka": _66, "yokawa": _66 }], "ibaraki": [1, { "ami": _66, "asahi": _66, "bando": _66, "chikusei": _66, "daigo": _66, "fujishiro": _66, "hitachi": _66, "hitachinaka": _66, "hitachiomiya": _66, "hitachiota": _66, "ibaraki": _66, "ina": _66, "inashiki": _66, "itako": _66, "iwama": _66, "joso": _66, "kamisu": _66, "kasama": _66, "kashima": _66, "kasumigaura": _66, "koga": _66, "miho": _66, "mito": _66, "moriya": _66, "naka": _66, "namegata": _66, "oarai": _66, "ogawa": _66, "omitama": _66, "ryugasaki": _66, "sakai": _66, "sakuragawa": _66, "shimodate": _66, "shimotsuma": _66, "shirosato": _66, "sowa": _66, "suifu": _66, "takahagi": _66, "tamatsukuri": _66, "tokai": _66, "tomobe": _66, "tone": _66, "toride": _66, "tsuchiura": _66, "tsukuba": _66, "uchihara": _66, "ushiku": _66, "yachiyo": _66, "yamagata": _66, "yawara": _66, "yuki": _66 }], "ishikawa": [1, { "anamizu": _66, "hakui": _66, "hakusan": _66, "kaga": _66, "kahoku": _66, "kanazawa": _66, "kawakita": _66, "komatsu": _66, "nakanoto": _66, "nanao": _66, "nomi": _66, "nonoichi": _66, "noto": _66, "shika": _66, "suzu": _66, "tsubata": _66, "tsurugi": _66, "uchinada": _66, "wajima": _66 }], "iwate": [1, { "fudai": _66, "fujisawa": _66, "hanamaki": _66, "hiraizumi": _66, "hirono": _66, "ichinohe": _66, "ichinoseki": _66, "iwaizumi": _66, "iwate": _66, "joboji": _66, "kamaishi": _66, "kanegasaki": _66, "karumai": _66, "kawai": _66, "kitakami": _66, "kuji": _66, "kunohe": _66, "kuzumaki": _66, "miyako": _66, "mizusawa": _66, "morioka": _66, "ninohe": _66, "noda": _66, "ofunato": _66, "oshu": _66, "otsuchi": _66, "rikuzentakata": _66, "shiwa": _66, "shizukuishi": _66, "sumita": _66, "tanohata": _66, "tono": _66, "yahaba": _66, "yamada": _66 }], "kagawa": [1, { "ayagawa": _66, "higashikagawa": _66, "kanonji": _66, "kotohira": _66, "manno": _66, "marugame": _66, "mitoyo": _66, "naoshima": _66, "sanuki": _66, "tadotsu": _66, "takamatsu": _66, "tonosho": _66, "uchinomi": _66, "utazu": _66, "zentsuji": _66 }], "kagoshima": [1, { "akune": _66, "amami": _66, "hioki": _66, "isa": _66, "isen": _66, "izumi": _66, "kagoshima": _66, "kanoya": _66, "kawanabe": _66, "kinko": _66, "kouyama": _66, "makurazaki": _66, "matsumoto": _66, "minamitane": _66, "nakatane": _66, "nishinoomote": _66, "satsumasendai": _66, "soo": _66, "tarumizu": _66, "yusui": _66 }], "kanagawa": [1, { "aikawa": _66, "atsugi": _66, "ayase": _66, "chigasaki": _66, "ebina": _66, "fujisawa": _66, "hadano": _66, "hakone": _66, "hiratsuka": _66, "isehara": _66, "kaisei": _66, "kamakura": _66, "kiyokawa": _66, "matsuda": _66, "minamiashigara": _66, "miura": _66, "nakai": _66, "ninomiya": _66, "odawara": _66, "oi": _66, "oiso": _66, "sagamihara": _66, "samukawa": _66, "tsukui": _66, "yamakita": _66, "yamato": _66, "yokosuka": _66, "yugawara": _66, "zama": _66, "zushi": _66 }], "kochi": [1, { "aki": _66, "geisei": _66, "hidaka": _66, "higashitsuno": _66, "ino": _66, "kagami": _66, "kami": _66, "kitagawa": _66, "kochi": _66, "mihara": _66, "motoyama": _66, "muroto": _66, "nahari": _66, "nakamura": _66, "nankoku": _66, "nishitosa": _66, "niyodogawa": _66, "ochi": _66, "okawa": _66, "otoyo": _66, "otsuki": _66, "sakawa": _66, "sukumo": _66, "susaki": _66, "tosa": _66, "tosashimizu": _66, "toyo": _66, "tsuno": _66, "umaji": _66, "yasuda": _66, "yusuhara": _66 }], "kumamoto": [1, { "amakusa": _66, "arao": _66, "aso": _66, "choyo": _66, "gyokuto": _66, "kamiamakusa": _66, "kikuchi": _66, "kumamoto": _66, "mashiki": _66, "mifune": _66, "minamata": _66, "minamioguni": _66, "nagasu": _66, "nishihara": _66, "oguni": _66, "ozu": _66, "sumoto": _66, "takamori": _66, "uki": _66, "uto": _66, "yamaga": _66, "yamato": _66, "yatsushiro": _66 }], "kyoto": [1, { "ayabe": _66, "fukuchiyama": _66, "higashiyama": _66, "ide": _66, "ine": _66, "joyo": _66, "kameoka": _66, "kamo": _66, "kita": _66, "kizu": _66, "kumiyama": _66, "kyotamba": _66, "kyotanabe": _66, "kyotango": _66, "maizuru": _66, "minami": _66, "minamiyamashiro": _66, "miyazu": _66, "muko": _66, "nagaokakyo": _66, "nakagyo": _66, "nantan": _66, "oyamazaki": _66, "sakyo": _66, "seika": _66, "tanabe": _66, "uji": _66, "ujitawara": _66, "wazuka": _66, "yamashina": _66, "yawata": _66 }], "mie": [1, { "asahi": _66, "inabe": _66, "ise": _66, "kameyama": _66, "kawagoe": _66, "kiho": _66, "kisosaki": _66, "kiwa": _66, "komono": _66, "kumano": _66, "kuwana": _66, "matsusaka": _66, "meiwa": _66, "mihama": _66, "minamiise": _66, "misugi": _66, "miyama": _66, "nabari": _66, "shima": _66, "suzuka": _66, "tado": _66, "taiki": _66, "taki": _66, "tamaki": _66, "toba": _66, "tsu": _66, "udono": _66, "ureshino": _66, "watarai": _66, "yokkaichi": _66 }], "miyagi": [1, { "furukawa": _66, "higashimatsushima": _66, "ishinomaki": _66, "iwanuma": _66, "kakuda": _66, "kami": _66, "kawasaki": _66, "marumori": _66, "matsushima": _66, "minamisanriku": _66, "misato": _66, "murata": _66, "natori": _66, "ogawara": _66, "ohira": _66, "onagawa": _66, "osaki": _66, "rifu": _66, "semine": _66, "shibata": _66, "shichikashuku": _66, "shikama": _66, "shiogama": _66, "shiroishi": _66, "tagajo": _66, "taiwa": _66, "tome": _66, "tomiya": _66, "wakuya": _66, "watari": _66, "yamamoto": _66, "zao": _66 }], "miyazaki": [1, { "aya": _66, "ebino": _66, "gokase": _66, "hyuga": _66, "kadogawa": _66, "kawaminami": _66, "kijo": _66, "kitagawa": _66, "kitakata": _66, "kitaura": _66, "kobayashi": _66, "kunitomi": _66, "kushima": _66, "mimata": _66, "miyakonojo": _66, "miyazaki": _66, "morotsuka": _66, "nichinan": _66, "nishimera": _66, "nobeoka": _66, "saito": _66, "shiiba": _66, "shintomi": _66, "takaharu": _66, "takanabe": _66, "takazaki": _66, "tsuno": _66 }], "nagano": [1, { "achi": _66, "agematsu": _66, "anan": _66, "aoki": _66, "asahi": _66, "azumino": _66, "chikuhoku": _66, "chikuma": _66, "chino": _66, "fujimi": _66, "hakuba": _66, "hara": _66, "hiraya": _66, "iida": _66, "iijima": _66, "iiyama": _66, "iizuna": _66, "ikeda": _66, "ikusaka": _66, "ina": _66, "karuizawa": _66, "kawakami": _66, "kiso": _66, "kisofukushima": _66, "kitaaiki": _66, "komagane": _66, "komoro": _66, "matsukawa": _66, "matsumoto": _66, "miasa": _66, "minamiaiki": _66, "minamimaki": _66, "minamiminowa": _66, "minowa": _66, "miyada": _66, "miyota": _66, "mochizuki": _66, "nagano": _66, "nagawa": _66, "nagiso": _66, "nakagawa": _66, "nakano": _66, "nozawaonsen": _66, "obuse": _66, "ogawa": _66, "okaya": _66, "omachi": _66, "omi": _66, "ookuwa": _66, "ooshika": _66, "otaki": _66, "otari": _66, "sakae": _66, "sakaki": _66, "saku": _66, "sakuho": _66, "shimosuwa": _66, "shinanomachi": _66, "shiojiri": _66, "suwa": _66, "suzaka": _66, "takagi": _66, "takamori": _66, "takayama": _66, "tateshina": _66, "tatsuno": _66, "togakushi": _66, "togura": _66, "tomi": _66, "ueda": _66, "wada": _66, "yamagata": _66, "yamanouchi": _66, "yasaka": _66, "yasuoka": _66 }], "nagasaki": [1, { "chijiwa": _66, "futsu": _66, "goto": _66, "hasami": _66, "hirado": _66, "iki": _66, "isahaya": _66, "kawatana": _66, "kuchinotsu": _66, "matsuura": _66, "nagasaki": _66, "obama": _66, "omura": _66, "oseto": _66, "saikai": _66, "sasebo": _66, "seihi": _66, "shimabara": _66, "shinkamigoto": _66, "togitsu": _66, "tsushima": _66, "unzen": _66 }], "nara": [1, { "ando": _66, "gose": _66, "heguri": _66, "higashiyoshino": _66, "ikaruga": _66, "ikoma": _66, "kamikitayama": _66, "kanmaki": _66, "kashiba": _66, "kashihara": _66, "katsuragi": _66, "kawai": _66, "kawakami": _66, "kawanishi": _66, "koryo": _66, "kurotaki": _66, "mitsue": _66, "miyake": _66, "nara": _66, "nosegawa": _66, "oji": _66, "ouda": _66, "oyodo": _66, "sakurai": _66, "sango": _66, "shimoichi": _66, "shimokitayama": _66, "shinjo": _66, "soni": _66, "takatori": _66, "tawaramoto": _66, "tenkawa": _66, "tenri": _66, "uda": _66, "yamatokoriyama": _66, "yamatotakada": _66, "yamazoe": _66, "yoshino": _66 }], "niigata": [1, { "aga": _66, "agano": _66, "gosen": _66, "itoigawa": _66, "izumozaki": _66, "joetsu": _66, "kamo": _66, "kariwa": _66, "kashiwazaki": _66, "minamiuonuma": _66, "mitsuke": _66, "muika": _66, "murakami": _66, "myoko": _66, "nagaoka": _66, "niigata": _66, "ojiya": _66, "omi": _66, "sado": _66, "sanjo": _66, "seiro": _66, "seirou": _66, "sekikawa": _66, "shibata": _66, "tagami": _66, "tainai": _66, "tochio": _66, "tokamachi": _66, "tsubame": _66, "tsunan": _66, "uonuma": _66, "yahiko": _66, "yoita": _66, "yuzawa": _66 }], "oita": [1, { "beppu": _66, "bungoono": _66, "bungotakada": _66, "hasama": _66, "hiji": _66, "himeshima": _66, "hita": _66, "kamitsue": _66, "kokonoe": _66, "kuju": _66, "kunisaki": _66, "kusu": _66, "oita": _66, "saiki": _66, "taketa": _66, "tsukumi": _66, "usa": _66, "usuki": _66, "yufu": _66 }], "okayama": [1, { "akaiwa": _66, "asakuchi": _66, "bizen": _66, "hayashima": _66, "ibara": _66, "kagamino": _66, "kasaoka": _66, "kibichuo": _66, "kumenan": _66, "kurashiki": _66, "maniwa": _66, "misaki": _66, "nagi": _66, "niimi": _66, "nishiawakura": _66, "okayama": _66, "satosho": _66, "setouchi": _66, "shinjo": _66, "shoo": _66, "soja": _66, "takahashi": _66, "tamano": _66, "tsuyama": _66, "wake": _66, "yakage": _66 }], "okinawa": [1, { "aguni": _66, "ginowan": _66, "ginoza": _66, "gushikami": _66, "haebaru": _66, "higashi": _66, "hirara": _66, "iheya": _66, "ishigaki": _66, "ishikawa": _66, "itoman": _66, "izena": _66, "kadena": _66, "kin": _66, "kitadaito": _66, "kitanakagusuku": _66, "kumejima": _66, "kunigami": _66, "minamidaito": _66, "motobu": _66, "nago": _66, "naha": _66, "nakagusuku": _66, "nakijin": _66, "nanjo": _66, "nishihara": _66, "ogimi": _66, "okinawa": _66, "onna": _66, "shimoji": _66, "taketomi": _66, "tarama": _66, "tokashiki": _66, "tomigusuku": _66, "tonaki": _66, "urasoe": _66, "uruma": _66, "yaese": _66, "yomitan": _66, "yonabaru": _66, "yonaguni": _66, "zamami": _66 }], "osaka": [1, { "abeno": _66, "chihayaakasaka": _66, "chuo": _66, "daito": _66, "fujiidera": _66, "habikino": _66, "hannan": _66, "higashiosaka": _66, "higashisumiyoshi": _66, "higashiyodogawa": _66, "hirakata": _66, "ibaraki": _66, "ikeda": _66, "izumi": _66, "izumiotsu": _66, "izumisano": _66, "kadoma": _66, "kaizuka": _66, "kanan": _66, "kashiwara": _66, "katano": _66, "kawachinagano": _66, "kishiwada": _66, "kita": _66, "kumatori": _66, "matsubara": _66, "minato": _66, "minoh": _66, "misaki": _66, "moriguchi": _66, "neyagawa": _66, "nishi": _66, "nose": _66, "osakasayama": _66, "sakai": _66, "sayama": _66, "sennan": _66, "settsu": _66, "shijonawate": _66, "shimamoto": _66, "suita": _66, "tadaoka": _66, "taishi": _66, "tajiri": _66, "takaishi": _66, "takatsuki": _66, "tondabayashi": _66, "toyonaka": _66, "toyono": _66, "yao": _66 }], "saga": [1, { "ariake": _66, "arita": _66, "fukudomi": _66, "genkai": _66, "hamatama": _66, "hizen": _66, "imari": _66, "kamimine": _66, "kanzaki": _66, "karatsu": _66, "kashima": _66, "kitagata": _66, "kitahata": _66, "kiyama": _66, "kouhoku": _66, "kyuragi": _66, "nishiarita": _66, "ogi": _66, "omachi": _66, "ouchi": _66, "saga": _66, "shiroishi": _66, "taku": _66, "tara": _66, "tosu": _66, "yoshinogari": _66 }], "saitama": [1, { "arakawa": _66, "asaka": _66, "chichibu": _66, "fujimi": _66, "fujimino": _66, "fukaya": _66, "hanno": _66, "hanyu": _66, "hasuda": _66, "hatogaya": _66, "hatoyama": _66, "hidaka": _66, "higashichichibu": _66, "higashimatsuyama": _66, "honjo": _66, "ina": _66, "iruma": _66, "iwatsuki": _66, "kamiizumi": _66, "kamikawa": _66, "kamisato": _66, "kasukabe": _66, "kawagoe": _66, "kawaguchi": _66, "kawajima": _66, "kazo": _66, "kitamoto": _66, "koshigaya": _66, "kounosu": _66, "kuki": _66, "kumagaya": _66, "matsubushi": _66, "minano": _66, "misato": _66, "miyashiro": _66, "miyoshi": _66, "moroyama": _66, "nagatoro": _66, "namegawa": _66, "niiza": _66, "ogano": _66, "ogawa": _66, "ogose": _66, "okegawa": _66, "omiya": _66, "otaki": _66, "ranzan": _66, "ryokami": _66, "saitama": _66, "sakado": _66, "satte": _66, "sayama": _66, "shiki": _66, "shiraoka": _66, "soka": _66, "sugito": _66, "toda": _66, "tokigawa": _66, "tokorozawa": _66, "tsurugashima": _66, "urawa": _66, "warabi": _66, "yashio": _66, "yokoze": _66, "yono": _66, "yorii": _66, "yoshida": _66, "yoshikawa": _66, "yoshimi": _66 }], "shiga": [1, { "aisho": _66, "gamo": _66, "higashiomi": _66, "hikone": _66, "koka": _66, "konan": _66, "kosei": _66, "koto": _66, "kusatsu": _66, "maibara": _66, "moriyama": _66, "nagahama": _66, "nishiazai": _66, "notogawa": _66, "omihachiman": _66, "otsu": _66, "ritto": _66, "ryuoh": _66, "takashima": _66, "takatsuki": _66, "torahime": _66, "toyosato": _66, "yasu": _66 }], "shimane": [1, { "akagi": _66, "ama": _66, "gotsu": _66, "hamada": _66, "higashiizumo": _66, "hikawa": _66, "hikimi": _66, "izumo": _66, "kakinoki": _66, "masuda": _66, "matsue": _66, "misato": _66, "nishinoshima": _66, "ohda": _66, "okinoshima": _66, "okuizumo": _66, "shimane": _66, "tamayu": _66, "tsuwano": _66, "unnan": _66, "yakumo": _66, "yasugi": _66, "yatsuka": _66 }], "shizuoka": [1, { "arai": _66, "atami": _66, "fuji": _66, "fujieda": _66, "fujikawa": _66, "fujinomiya": _66, "fukuroi": _66, "gotemba": _66, "haibara": _66, "hamamatsu": _66, "higashiizu": _66, "ito": _66, "iwata": _66, "izu": _66, "izunokuni": _66, "kakegawa": _66, "kannami": _66, "kawanehon": _66, "kawazu": _66, "kikugawa": _66, "kosai": _66, "makinohara": _66, "matsuzaki": _66, "minamiizu": _66, "mishima": _66, "morimachi": _66, "nishiizu": _66, "numazu": _66, "omaezaki": _66, "shimada": _66, "shimizu": _66, "shimoda": _66, "shizuoka": _66, "susono": _66, "yaizu": _66, "yoshida": _66 }], "tochigi": [1, { "ashikaga": _66, "bato": _66, "haga": _66, "ichikai": _66, "iwafune": _66, "kaminokawa": _66, "kanuma": _66, "karasuyama": _66, "kuroiso": _66, "mashiko": _66, "mibu": _66, "moka": _66, "motegi": _66, "nasu": _66, "nasushiobara": _66, "nikko": _66, "nishikata": _66, "nogi": _66, "ohira": _66, "ohtawara": _66, "oyama": _66, "sakura": _66, "sano": _66, "shimotsuke": _66, "shioya": _66, "takanezawa": _66, "tochigi": _66, "tsuga": _66, "ujiie": _66, "utsunomiya": _66, "yaita": _66 }], "tokushima": [1, { "aizumi": _66, "anan": _66, "ichiba": _66, "itano": _66, "kainan": _66, "komatsushima": _66, "matsushige": _66, "mima": _66, "minami": _66, "miyoshi": _66, "mugi": _66, "nakagawa": _66, "naruto": _66, "sanagochi": _66, "shishikui": _66, "tokushima": _66, "wajiki": _66 }], "tokyo": [1, { "adachi": _66, "akiruno": _66, "akishima": _66, "aogashima": _66, "arakawa": _66, "bunkyo": _66, "chiyoda": _66, "chofu": _66, "chuo": _66, "edogawa": _66, "fuchu": _66, "fussa": _66, "hachijo": _66, "hachioji": _66, "hamura": _66, "higashikurume": _66, "higashimurayama": _66, "higashiyamato": _66, "hino": _66, "hinode": _66, "hinohara": _66, "inagi": _66, "itabashi": _66, "katsushika": _66, "kita": _66, "kiyose": _66, "kodaira": _66, "koganei": _66, "kokubunji": _66, "komae": _66, "koto": _66, "kouzushima": _66, "kunitachi": _66, "machida": _66, "meguro": _66, "minato": _66, "mitaka": _66, "mizuho": _66, "musashimurayama": _66, "musashino": _66, "nakano": _66, "nerima": _66, "ogasawara": _66, "okutama": _66, "ome": _66, "oshima": _66, "ota": _66, "setagaya": _66, "shibuya": _66, "shinagawa": _66, "shinjuku": _66, "suginami": _66, "sumida": _66, "tachikawa": _66, "taito": _66, "tama": _66, "toshima": _66 }], "tottori": [1, { "chizu": _66, "hino": _66, "kawahara": _66, "koge": _66, "kotoura": _66, "misasa": _66, "nanbu": _66, "nichinan": _66, "sakaiminato": _66, "tottori": _66, "wakasa": _66, "yazu": _66, "yonago": _66 }], "toyama": [1, { "asahi": _66, "fuchu": _66, "fukumitsu": _66, "funahashi": _66, "himi": _66, "imizu": _66, "inami": _66, "johana": _66, "kamiichi": _66, "kurobe": _66, "nakaniikawa": _66, "namerikawa": _66, "nanto": _66, "nyuzen": _66, "oyabe": _66, "taira": _66, "takaoka": _66, "tateyama": _66, "toga": _66, "tonami": _66, "toyama": _66, "unazuki": _66, "uozu": _66, "yamada": _66 }], "wakayama": [1, { "arida": _66, "aridagawa": _66, "gobo": _66, "hashimoto": _66, "hidaka": _66, "hirogawa": _66, "inami": _66, "iwade": _66, "kainan": _66, "kamitonda": _66, "katsuragi": _66, "kimino": _66, "kinokawa": _66, "kitayama": _66, "koya": _66, "koza": _66, "kozagawa": _66, "kudoyama": _66, "kushimoto": _66, "mihama": _66, "misato": _66, "nachikatsuura": _66, "shingu": _66, "shirahama": _66, "taiji": _66, "tanabe": _66, "wakayama": _66, "yuasa": _66, "yura": _66 }], "yamagata": [1, { "asahi": _66, "funagata": _66, "higashine": _66, "iide": _66, "kahoku": _66, "kaminoyama": _66, "kaneyama": _66, "kawanishi": _66, "mamurogawa": _66, "mikawa": _66, "murayama": _66, "nagai": _66, "nakayama": _66, "nanyo": _66, "nishikawa": _66, "obanazawa": _66, "oe": _66, "oguni": _66, "ohkura": _66, "oishida": _66, "sagae": _66, "sakata": _66, "sakegawa": _66, "shinjo": _66, "shirataka": _66, "shonai": _66, "takahata": _66, "tendo": _66, "tozawa": _66, "tsuruoka": _66, "yamagata": _66, "yamanobe": _66, "yonezawa": _66, "yuza": _66 }], "yamaguchi": [1, { "abu": _66, "hagi": _66, "hikari": _66, "hofu": _66, "iwakuni": _66, "kudamatsu": _66, "mitou": _66, "nagato": _66, "oshima": _66, "shimonoseki": _66, "shunan": _66, "tabuse": _66, "tokuyama": _66, "toyota": _66, "ube": _66, "yuu": _66 }], "yamanashi": [1, { "chuo": _66, "doshi": _66, "fuefuki": _66, "fujikawa": _66, "fujikawaguchiko": _66, "fujiyoshida": _66, "hayakawa": _66, "hokuto": _66, "ichikawamisato": _66, "kai": _66, "kofu": _66, "koshu": _66, "kosuge": _66, "minami-alps": _66, "minobu": _66, "nakamichi": _66, "nanbu": _66, "narusawa": _66, "nirasaki": _66, "nishikatsura": _66, "oshino": _66, "otsuki": _66, "showa": _66, "tabayama": _66, "tsuru": _66, "uenohara": _66, "yamanakako": _66, "yamanashi": _66 }], "xn--ehqz56n": _66, "三重": _66, "xn--1lqs03n": _66, "京都": _66, "xn--qqqt11m": _66, "佐賀": _66, "xn--f6qx53a": _66, "兵庫": _66, "xn--djrs72d6uy": _66, "北海道": _66, "xn--mkru45i": _66, "千葉": _66, "xn--0trq7p7nn": _66, "和歌山": _66, "xn--5js045d": _66, "埼玉": _66, "xn--kbrq7o": _66, "大分": _66, "xn--pssu33l": _66, "大阪": _66, "xn--ntsq17g": _66, "奈良": _66, "xn--uisz3g": _66, "宮城": _66, "xn--6btw5a": _66, "宮崎": _66, "xn--1ctwo": _66, "富山": _66, "xn--6orx2r": _66, "山口": _66, "xn--rht61e": _66, "山形": _66, "xn--rht27z": _66, "山梨": _66, "xn--nit225k": _66, "岐阜": _66, "xn--rht3d": _66, "岡山": _66, "xn--djty4k": _66, "岩手": _66, "xn--klty5x": _66, "島根": _66, "xn--kltx9a": _66, "広島": _66, "xn--kltp7d": _66, "徳島": _66, "xn--c3s14m": _66, "愛媛": _66, "xn--vgu402c": _66, "愛知": _66, "xn--efvn9s": _66, "新潟": _66, "xn--1lqs71d": _66, "東京": _66, "xn--4pvxs": _66, "栃木": _66, "xn--uuwu58a": _66, "沖縄": _66, "xn--zbx025d": _66, "滋賀": _66, "xn--8pvr4u": _66, "熊本": _66, "xn--5rtp49c": _66, "石川": _66, "xn--ntso0iqx3a": _66, "神奈川": _66, "xn--elqq16h": _66, "福井": _66, "xn--4it168d": _66, "福岡": _66, "xn--klt787d": _66, "福島": _66, "xn--rny31h": _66, "秋田": _66, "xn--7t0a264c": _66, "群馬": _66, "xn--uist22h": _66, "茨城": _66, "xn--8ltr62k": _66, "長崎": _66, "xn--2m4a15e": _66, "長野": _66, "xn--32vp30h": _66, "青森": _66, "xn--4it797k": _66, "静岡": _66, "xn--5rtq34k": _66, "香川": _66, "xn--k7yn95e": _66, "高知": _66, "xn--tor131o": _66, "鳥取": _66, "xn--d5qv7z876c": _66, "鹿児島": _66, "kawasaki": _70, "kitakyushu": _70, "kobe": _70, "nagoya": _70, "sapporo": _70, "sendai": _70, "yokohama": _70 }], "ke": [1, { "ac": _66, "co": _66, "go": _66, "info": _66, "me": _66, "mobi": _66, "ne": _66, "or": _66, "sc": _66 }], "kg": _67, "kh": _70, "ki": _75, "km": [1, { "ass": _66, "com": _66, "edu": _66, "gov": _66, "mil": _66, "nom": _66, "org": _66, "prd": _66, "tm": _66, "asso": _66, "coop": _66, "gouv": _66, "medecin": _66, "notaires": _66, "pharmaciens": _66, "presse": _66, "veterinaire": _66 }], "kn": [1, { "edu": _66, "gov": _66, "net": _66, "org": _66 }], "kp": [1, { "com": _66, "edu": _66, "gov": _66, "org": _66, "rep": _66, "tra": _66 }], "kr": [1, { "ac": _66, "ai": _66, "co": _66, "es": _66, "go": _66, "hs": _66, "io": _66, "it": _66, "kg": _66, "me": _66, "mil": _66, "ms": _66, "ne": _66, "or": _66, "pe": _66, "re": _66, "sc": _66, "busan": _66, "chungbuk": _66, "chungnam": _66, "daegu": _66, "daejeon": _66, "gangwon": _66, "gwangju": _66, "gyeongbuk": _66, "gyeonggi": _66, "gyeongnam": _66, "incheon": _66, "jeju": _66, "jeonbuk": _66, "jeonnam": _66, "seoul": _66, "ulsan": _66 }], "kw": [1, { "com": _66, "edu": _66, "emb": _66, "gov": _66, "ind": _66, "net": _66, "org": _66 }], "ky": _72, "kz": _67, "la": [1, { "com": _66, "edu": _66, "gov": _66, "info": _66, "int": _66, "net": _66, "org": _66, "per": _66 }], "lb": _68, "lc": _71, "li": _66, "lk": [1, { "ac": _66, "assn": _66, "com": _66, "edu": _66, "gov": _66, "grp": _66, "hotel": _66, "int": _66, "ltd": _66, "net": _66, "ngo": _66, "org": _66, "sch": _66, "soc": _66, "web": _66 }], "lr": _68, "ls": [1, { "ac": _66, "biz": _66, "co": _66, "edu": _66, "gov": _66, "info": _66, "net": _66, "org": _66, "sc": _66 }], "lt": _69, "lu": _66, "lv": [1, { "asn": _66, "com": _66, "conf": _66, "edu": _66, "gov": _66, "id": _66, "mil": _66, "net": _66, "org": _66 }], "ly": [1, { "com": _66, "edu": _66, "gov": _66, "id": _66, "med": _66, "net": _66, "org": _66, "plc": _66, "sch": _66 }], "ma": [1, { "ac": _66, "co": _66, "gov": _66, "net": _66, "org": _66, "press": _66 }], "mc": [1, { "asso": _66, "tm": _66 }], "md": _66, "me": [1, { "ac": _66, "co": _66, "edu": _66, "gov": _66, "its": _66, "net": _66, "org": _66, "priv": _66 }], "mg": [1, { "co": _66, "com": _66, "edu": _66, "gov": _66, "mil": _66, "nom": _66, "org": _66, "prd": _66 }], "mh": _66, "mil": _66, "mk": [1, { "com": _66, "edu": _66, "gov": _66, "inf": _66, "name": _66, "net": _66, "org": _66 }], "ml": [1, { "ac": _66, "art": _66, "asso": _66, "com": _66, "edu": _66, "gouv": _66, "gov": _66, "info": _66, "inst": _66, "net": _66, "org": _66, "pr": _66, "presse": _66 }], "mm": _70, "mn": [1, { "edu": _66, "gov": _66, "org": _66 }], "mo": _68, "mobi": _66, "mp": _66, "mq": _66, "mr": _69, "ms": _68, "mt": _72, "mu": [1, { "ac": _66, "co": _66, "com": _66, "gov": _66, "net": _66, "or": _66, "org": _66 }], "museum": _66, "mv": [1, { "aero": _66, "biz": _66, "com": _66, "coop": _66, "edu": _66, "gov": _66, "info": _66, "int": _66, "mil": _66, "museum": _66, "name": _66, "net": _66, "org": _66, "pro": _66 }], "mw": [1, { "ac": _66, "biz": _66, "co": _66, "com": _66, "coop": _66, "edu": _66, "gov": _66, "int": _66, "net": _66, "org": _66 }], "mx": [1, { "com": _66, "edu": _66, "gob": _66, "net": _66, "org": _66 }], "my": [1, { "biz": _66, "com": _66, "edu": _66, "gov": _66, "mil": _66, "name": _66, "net": _66, "org": _66 }], "mz": [1, { "ac": _66, "adv": _66, "co": _66, "edu": _66, "gov": _66, "mil": _66, "net": _66, "org": _66 }], "na": [1, { "alt": _66, "co": _66, "com": _66, "gov": _66, "net": _66, "org": _66 }], "name": _66, "nc": [1, { "asso": _66, "nom": _66 }], "ne": _66, "net": _66, "nf": [1, { "arts": _66, "com": _66, "firm": _66, "info": _66, "net": _66, "other": _66, "per": _66, "rec": _66, "store": _66, "web": _66 }], "ng": [1, { "com": _66, "edu": _66, "gov": _66, "i": _66, "mil": _66, "mobi": _66, "name": _66, "net": _66, "org": _66, "sch": _66 }], "ni": [1, { "ac": _66, "biz": _66, "co": _66, "com": _66, "edu": _66, "gob": _66, "in": _66, "info": _66, "int": _66, "mil": _66, "net": _66, "nom": _66, "org": _66, "web": _66 }], "nl": _66, "no": [1, { "fhs": _66, "folkebibl": _66, "fylkesbibl": _66, "idrett": _66, "museum": _66, "priv": _66, "vgs": _66, "dep": _66, "herad": _66, "kommune": _66, "mil": _66, "stat": _66, "aa": _76, "ah": _76, "bu": _76, "fm": _76, "hl": _76, "hm": _76, "jan-mayen": _76, "mr": _76, "nl": _76, "nt": _76, "of": _76, "ol": _76, "oslo": _76, "rl": _76, "sf": _76, "st": _76, "svalbard": _76, "tm": _76, "tr": _76, "va": _76, "vf": _76, "akrehamn": _66, "xn--krehamn-dxa": _66, "åkrehamn": _66, "algard": _66, "xn--lgrd-poac": _66, "ålgård": _66, "arna": _66, "bronnoysund": _66, "xn--brnnysund-m8ac": _66, "brønnøysund": _66, "brumunddal": _66, "bryne": _66, "drobak": _66, "xn--drbak-wua": _66, "drøbak": _66, "egersund": _66, "fetsund": _66, "floro": _66, "xn--flor-jra": _66, "florø": _66, "fredrikstad": _66, "hokksund": _66, "honefoss": _66, "xn--hnefoss-q1a": _66, "hønefoss": _66, "jessheim": _66, "jorpeland": _66, "xn--jrpeland-54a": _66, "jørpeland": _66, "kirkenes": _66, "kopervik": _66, "krokstadelva": _66, "langevag": _66, "xn--langevg-jxa": _66, "langevåg": _66, "leirvik": _66, "mjondalen": _66, "xn--mjndalen-64a": _66, "mjøndalen": _66, "mo-i-rana": _66, "mosjoen": _66, "xn--mosjen-eya": _66, "mosjøen": _66, "nesoddtangen": _66, "orkanger": _66, "osoyro": _66, "xn--osyro-wua": _66, "osøyro": _66, "raholt": _66, "xn--rholt-mra": _66, "råholt": _66, "sandnessjoen": _66, "xn--sandnessjen-ogb": _66, "sandnessjøen": _66, "skedsmokorset": _66, "slattum": _66, "spjelkavik": _66, "stathelle": _66, "stavern": _66, "stjordalshalsen": _66, "xn--stjrdalshalsen-sqb": _66, "stjørdalshalsen": _66, "tananger": _66, "tranby": _66, "vossevangen": _66, "aarborte": _66, "aejrie": _66, "afjord": _66, "xn--fjord-lra": _66, "åfjord": _66, "agdenes": _66, "akershus": _77, "aknoluokta": _66, "xn--koluokta-7ya57h": _66, "ákŋoluokta": _66, "al": _66, "xn--l-1fa": _66, "ål": _66, "alaheadju": _66, "xn--laheadju-7ya": _66, "álaheadju": _66, "alesund": _66, "xn--lesund-hua": _66, "ålesund": _66, "alstahaug": _66, "alta": _66, "xn--lt-liac": _66, "áltá": _66, "alvdal": _66, "amli": _66, "xn--mli-tla": _66, "åmli": _66, "amot": _66, "xn--mot-tla": _66, "åmot": _66, "andasuolo": _66, "andebu": _66, "andoy": _66, "xn--andy-ira": _66, "andøy": _66, "ardal": _66, "xn--rdal-poa": _66, "årdal": _66, "aremark": _66, "arendal": _66, "xn--s-1fa": _66, "ås": _66, "aseral": _66, "xn--seral-lra": _66, "åseral": _66, "asker": _66, "askim": _66, "askoy": _66, "xn--asky-ira": _66, "askøy": _66, "askvoll": _66, "asnes": _66, "xn--snes-poa": _66, "åsnes": _66, "audnedaln": _66, "aukra": _66, "aure": _66, "aurland": _66, "aurskog-holand": _66, "xn--aurskog-hland-jnb": _66, "aurskog-høland": _66, "austevoll": _66, "austrheim": _66, "averoy": _66, "xn--avery-yua": _66, "averøy": _66, "badaddja": _66, "xn--bdddj-mrabd": _66, "bådåddjå": _66, "xn--brum-voa": _66, "bærum": _66, "bahcavuotna": _66, "xn--bhcavuotna-s4a": _66, "báhcavuotna": _66, "bahccavuotna": _66, "xn--bhccavuotna-k7a": _66, "báhccavuotna": _66, "baidar": _66, "xn--bidr-5nac": _66, "báidár": _66, "bajddar": _66, "xn--bjddar-pta": _66, "bájddar": _66, "balat": _66, "xn--blt-elab": _66, "bálát": _66, "balestrand": _66, "ballangen": _66, "balsfjord": _66, "bamble": _66, "bardu": _66, "barum": _66, "batsfjord": _66, "xn--btsfjord-9za": _66, "båtsfjord": _66, "bearalvahki": _66, "xn--bearalvhki-y4a": _66, "bearalváhki": _66, "beardu": _66, "beiarn": _66, "berg": _66, "bergen": _66, "berlevag": _66, "xn--berlevg-jxa": _66, "berlevåg": _66, "bievat": _66, "xn--bievt-0qa": _66, "bievát": _66, "bindal": _66, "birkenes": _66, "bjarkoy": _66, "xn--bjarky-fya": _66, "bjarkøy": _66, "bjerkreim": _66, "bjugn": _66, "bodo": _66, "xn--bod-2na": _66, "bodø": _66, "bokn": _66, "bomlo": _66, "xn--bmlo-gra": _66, "bømlo": _66, "bremanger": _66, "bronnoy": _66, "xn--brnny-wuac": _66, "brønnøy": _66, "budejju": _66, "buskerud": _77, "bygland": _66, "bykle": _66, "cahcesuolo": _66, "xn--hcesuolo-7ya35b": _66, "čáhcesuolo": _66, "davvenjarga": _66, "xn--davvenjrga-y4a": _66, "davvenjárga": _66, "davvesiida": _66, "deatnu": _66, "dielddanuorri": _66, "divtasvuodna": _66, "divttasvuotna": _66, "donna": _66, "xn--dnna-gra": _66, "dønna": _66, "dovre": _66, "drammen": _66, "drangedal": _66, "dyroy": _66, "xn--dyry-ira": _66, "dyrøy": _66, "eid": _66, "eidfjord": _66, "eidsberg": _66, "eidskog": _66, "eidsvoll": _66, "eigersund": _66, "elverum": _66, "enebakk": _66, "engerdal": _66, "etne": _66, "etnedal": _66, "evenassi": _66, "xn--eveni-0qa01ga": _66, "evenášši": _66, "evenes": _66, "evje-og-hornnes": _66, "farsund": _66, "fauske": _66, "fedje": _66, "fet": _66, "finnoy": _66, "xn--finny-yua": _66, "finnøy": _66, "fitjar": _66, "fjaler": _66, "fjell": _66, "fla": _66, "xn--fl-zia": _66, "flå": _66, "flakstad": _66, "flatanger": _66, "flekkefjord": _66, "flesberg": _66, "flora": _66, "folldal": _66, "forde": _66, "xn--frde-gra": _66, "førde": _66, "forsand": _66, "fosnes": _66, "xn--frna-woa": _66, "fræna": _66, "frana": _66, "frei": _66, "frogn": _66, "froland": _66, "frosta": _66, "froya": _66, "xn--frya-hra": _66, "frøya": _66, "fuoisku": _66, "fuossko": _66, "fusa": _66, "fyresdal": _66, "gaivuotna": _66, "xn--givuotna-8ya": _66, "gáivuotna": _66, "galsa": _66, "xn--gls-elac": _66, "gálsá": _66, "gamvik": _66, "gangaviika": _66, "xn--ggaviika-8ya47h": _66, "gáŋgaviika": _66, "gaular": _66, "gausdal": _66, "giehtavuoatna": _66, "gildeskal": _66, "xn--gildeskl-g0a": _66, "gildeskål": _66, "giske": _66, "gjemnes": _66, "gjerdrum": _66, "gjerstad": _66, "gjesdal": _66, "gjovik": _66, "xn--gjvik-wua": _66, "gjøvik": _66, "gloppen": _66, "gol": _66, "gran": _66, "grane": _66, "granvin": _66, "gratangen": _66, "grimstad": _66, "grong": _66, "grue": _66, "gulen": _66, "guovdageaidnu": _66, "ha": _66, "xn--h-2fa": _66, "hå": _66, "habmer": _66, "xn--hbmer-xqa": _66, "hábmer": _66, "hadsel": _66, "xn--hgebostad-g3a": _66, "hægebostad": _66, "hagebostad": _66, "halden": _66, "halsa": _66, "hamar": _66, "hamaroy": _66, "hammarfeasta": _66, "xn--hmmrfeasta-s4ac": _66, "hámmárfeasta": _66, "hammerfest": _66, "hapmir": _66, "xn--hpmir-xqa": _66, "hápmir": _66, "haram": _66, "hareid": _66, "harstad": _66, "hasvik": _66, "hattfjelldal": _66, "haugesund": _66, "hedmark": [0, { "os": _66, "valer": _66, "xn--vler-qoa": _66, "våler": _66 }], "hemne": _66, "hemnes": _66, "hemsedal": _66, "hitra": _66, "hjartdal": _66, "hjelmeland": _66, "hobol": _66, "xn--hobl-ira": _66, "hobøl": _66, "hof": _66, "hol": _66, "hole": _66, "holmestrand": _66, "holtalen": _66, "xn--holtlen-hxa": _66, "holtålen": _66, "hordaland": [0, { "os": _66 }], "hornindal": _66, "horten": _66, "hoyanger": _66, "xn--hyanger-q1a": _66, "høyanger": _66, "hoylandet": _66, "xn--hylandet-54a": _66, "høylandet": _66, "hurdal": _66, "hurum": _66, "hvaler": _66, "hyllestad": _66, "ibestad": _66, "inderoy": _66, "xn--indery-fya": _66, "inderøy": _66, "iveland": _66, "ivgu": _66, "jevnaker": _66, "jolster": _66, "xn--jlster-bya": _66, "jølster": _66, "jondal": _66, "kafjord": _66, "xn--kfjord-iua": _66, "kåfjord": _66, "karasjohka": _66, "xn--krjohka-hwab49j": _66, "kárášjohka": _66, "karasjok": _66, "karlsoy": _66, "karmoy": _66, "xn--karmy-yua": _66, "karmøy": _66, "kautokeino": _66, "klabu": _66, "xn--klbu-woa": _66, "klæbu": _66, "klepp": _66, "kongsberg": _66, "kongsvinger": _66, "kraanghke": _66, "xn--kranghke-b0a": _66, "kråanghke": _66, "kragero": _66, "xn--krager-gya": _66, "kragerø": _66, "kristiansand": _66, "kristiansund": _66, "krodsherad": _66, "xn--krdsherad-m8a": _66, "krødsherad": _66, "xn--kvfjord-nxa": _66, "kvæfjord": _66, "xn--kvnangen-k0a": _66, "kvænangen": _66, "kvafjord": _66, "kvalsund": _66, "kvam": _66, "kvanangen": _66, "kvinesdal": _66, "kvinnherad": _66, "kviteseid": _66, "kvitsoy": _66, "xn--kvitsy-fya": _66, "kvitsøy": _66, "laakesvuemie": _66, "xn--lrdal-sra": _66, "lærdal": _66, "lahppi": _66, "xn--lhppi-xqa": _66, "láhppi": _66, "lardal": _66, "larvik": _66, "lavagis": _66, "lavangen": _66, "leangaviika": _66, "xn--leagaviika-52b": _66, "leaŋgaviika": _66, "lebesby": _66, "leikanger": _66, "leirfjord": _66, "leka": _66, "leksvik": _66, "lenvik": _66, "lerdal": _66, "lesja": _66, "levanger": _66, "lier": _66, "lierne": _66, "lillehammer": _66, "lillesand": _66, "lindas": _66, "xn--linds-pra": _66, "lindås": _66, "lindesnes": _66, "loabat": _66, "xn--loabt-0qa": _66, "loabát": _66, "lodingen": _66, "xn--ldingen-q1a": _66, "lødingen": _66, "lom": _66, "loppa": _66, "lorenskog": _66, "xn--lrenskog-54a": _66, "lørenskog": _66, "loten": _66, "xn--lten-gra": _66, "løten": _66, "lund": _66, "lunner": _66, "luroy": _66, "xn--lury-ira": _66, "lurøy": _66, "luster": _66, "lyngdal": _66, "lyngen": _66, "malatvuopmi": _66, "xn--mlatvuopmi-s4a": _66, "málatvuopmi": _66, "malselv": _66, "xn--mlselv-iua": _66, "målselv": _66, "malvik": _66, "mandal": _66, "marker": _66, "marnardal": _66, "masfjorden": _66, "masoy": _66, "xn--msy-ula0h": _66, "måsøy": _66, "matta-varjjat": _66, "xn--mtta-vrjjat-k7af": _66, "mátta-várjjat": _66, "meland": _66, "meldal": _66, "melhus": _66, "meloy": _66, "xn--mely-ira": _66, "meløy": _66, "meraker": _66, "xn--merker-kua": _66, "meråker": _66, "midsund": _66, "midtre-gauldal": _66, "moareke": _66, "xn--moreke-jua": _66, "moåreke": _66, "modalen": _66, "modum": _66, "molde": _66, "more-og-romsdal": [0, { "heroy": _66, "sande": _66 }], "xn--mre-og-romsdal-qqb": [0, { "xn--hery-ira": _66, "sande": _66 }], "møre-og-romsdal": [0, { "herøy": _66, "sande": _66 }], "moskenes": _66, "moss": _66, "mosvik": _66, "muosat": _66, "xn--muost-0qa": _66, "muosát": _66, "naamesjevuemie": _66, "xn--nmesjevuemie-tcba": _66, "nååmesjevuemie": _66, "xn--nry-yla5g": _66, "nærøy": _66, "namdalseid": _66, "namsos": _66, "namsskogan": _66, "nannestad": _66, "naroy": _66, "narviika": _66, "narvik": _66, "naustdal": _66, "navuotna": _66, "xn--nvuotna-hwa": _66, "návuotna": _66, "nedre-eiker": _66, "nesna": _66, "nesodden": _66, "nesseby": _66, "nesset": _66, "nissedal": _66, "nittedal": _66, "nord-aurdal": _66, "nord-fron": _66, "nord-odal": _66, "norddal": _66, "nordkapp": _66, "nordland": [0, { "bo": _66, "xn--b-5ga": _66, "bø": _66, "heroy": _66, "xn--hery-ira": _66, "herøy": _66 }], "nordre-land": _66, "nordreisa": _66, "nore-og-uvdal": _66, "notodden": _66, "notteroy": _66, "xn--nttery-byae": _66, "nøtterøy": _66, "odda": _66, "oksnes": _66, "xn--ksnes-uua": _66, "øksnes": _66, "omasvuotna": _66, "oppdal": _66, "oppegard": _66, "xn--oppegrd-ixa": _66, "oppegård": _66, "orkdal": _66, "orland": _66, "xn--rland-uua": _66, "ørland": _66, "orskog": _66, "xn--rskog-uua": _66, "ørskog": _66, "orsta": _66, "xn--rsta-fra": _66, "ørsta": _66, "osen": _66, "osteroy": _66, "xn--ostery-fya": _66, "osterøy": _66, "ostfold": [0, { "valer": _66 }], "xn--stfold-9xa": [0, { "xn--vler-qoa": _66 }], "østfold": [0, { "våler": _66 }], "ostre-toten": _66, "xn--stre-toten-zcb": _66, "østre-toten": _66, "overhalla": _66, "ovre-eiker": _66, "xn--vre-eiker-k8a": _66, "øvre-eiker": _66, "oyer": _66, "xn--yer-zna": _66, "øyer": _66, "oygarden": _66, "xn--ygarden-p1a": _66, "øygarden": _66, "oystre-slidre": _66, "xn--ystre-slidre-ujb": _66, "øystre-slidre": _66, "porsanger": _66, "porsangu": _66, "xn--porsgu-sta26f": _66, "porsáŋgu": _66, "porsgrunn": _66, "rade": _66, "xn--rde-ula": _66, "råde": _66, "radoy": _66, "xn--rady-ira": _66, "radøy": _66, "xn--rlingen-mxa": _66, "rælingen": _66, "rahkkeravju": _66, "xn--rhkkervju-01af": _66, "ráhkkerávju": _66, "raisa": _66, "xn--risa-5na": _66, "ráisa": _66, "rakkestad": _66, "ralingen": _66, "rana": _66, "randaberg": _66, "rauma": _66, "rendalen": _66, "rennebu": _66, "rennesoy": _66, "xn--rennesy-v1a": _66, "rennesøy": _66, "rindal": _66, "ringebu": _66, "ringerike": _66, "ringsaker": _66, "risor": _66, "xn--risr-ira": _66, "risør": _66, "rissa": _66, "roan": _66, "rodoy": _66, "xn--rdy-0nab": _66, "rødøy": _66, "rollag": _66, "romsa": _66, "romskog": _66, "xn--rmskog-bya": _66, "rømskog": _66, "roros": _66, "xn--rros-gra": _66, "røros": _66, "rost": _66, "xn--rst-0na": _66, "røst": _66, "royken": _66, "xn--ryken-vua": _66, "røyken": _66, "royrvik": _66, "xn--ryrvik-bya": _66, "røyrvik": _66, "ruovat": _66, "rygge": _66, "salangen": _66, "salat": _66, "xn--slat-5na": _66, "sálat": _66, "xn--slt-elab": _66, "sálát": _66, "saltdal": _66, "samnanger": _66, "sandefjord": _66, "sandnes": _66, "sandoy": _66, "xn--sandy-yua": _66, "sandøy": _66, "sarpsborg": _66, "sauda": _66, "sauherad": _66, "sel": _66, "selbu": _66, "selje": _66, "seljord": _66, "siellak": _66, "sigdal": _66, "siljan": _66, "sirdal": _66, "skanit": _66, "xn--sknit-yqa": _66, "skánit": _66, "skanland": _66, "xn--sknland-fxa": _66, "skånland": _66, "skaun": _66, "skedsmo": _66, "ski": _66, "skien": _66, "skierva": _66, "xn--skierv-uta": _66, "skiervá": _66, "skiptvet": _66, "skjak": _66, "xn--skjk-soa": _66, "skjåk": _66, "skjervoy": _66, "xn--skjervy-v1a": _66, "skjervøy": _66, "skodje": _66, "smola": _66, "xn--smla-hra": _66, "smøla": _66, "snaase": _66, "xn--snase-nra": _66, "snåase": _66, "snasa": _66, "xn--snsa-roa": _66, "snåsa": _66, "snillfjord": _66, "snoasa": _66, "sogndal": _66, "sogne": _66, "xn--sgne-gra": _66, "søgne": _66, "sokndal": _66, "sola": _66, "solund": _66, "somna": _66, "xn--smna-gra": _66, "sømna": _66, "sondre-land": _66, "xn--sndre-land-0cb": _66, "søndre-land": _66, "songdalen": _66, "sor-aurdal": _66, "xn--sr-aurdal-l8a": _66, "sør-aurdal": _66, "sor-fron": _66, "xn--sr-fron-q1a": _66, "sør-fron": _66, "sor-odal": _66, "xn--sr-odal-q1a": _66, "sør-odal": _66, "sor-varanger": _66, "xn--sr-varanger-ggb": _66, "sør-varanger": _66, "sorfold": _66, "xn--srfold-bya": _66, "sørfold": _66, "sorreisa": _66, "xn--srreisa-q1a": _66, "sørreisa": _66, "sortland": _66, "sorum": _66, "xn--srum-gra": _66, "sørum": _66, "spydeberg": _66, "stange": _66, "stavanger": _66, "steigen": _66, "steinkjer": _66, "stjordal": _66, "xn--stjrdal-s1a": _66, "stjørdal": _66, "stokke": _66, "stor-elvdal": _66, "stord": _66, "stordal": _66, "storfjord": _66, "strand": _66, "stranda": _66, "stryn": _66, "sula": _66, "suldal": _66, "sund": _66, "sunndal": _66, "surnadal": _66, "sveio": _66, "svelvik": _66, "sykkylven": _66, "tana": _66, "telemark": [0, { "bo": _66, "xn--b-5ga": _66, "bø": _66 }], "time": _66, "tingvoll": _66, "tinn": _66, "tjeldsund": _66, "tjome": _66, "xn--tjme-hra": _66, "tjøme": _66, "tokke": _66, "tolga": _66, "tonsberg": _66, "xn--tnsberg-q1a": _66, "tønsberg": _66, "torsken": _66, "xn--trna-woa": _66, "træna": _66, "trana": _66, "tranoy": _66, "xn--trany-yua": _66, "tranøy": _66, "troandin": _66, "trogstad": _66, "xn--trgstad-r1a": _66, "trøgstad": _66, "tromsa": _66, "tromso": _66, "xn--troms-zua": _66, "tromsø": _66, "trondheim": _66, "trysil": _66, "tvedestrand": _66, "tydal": _66, "tynset": _66, "tysfjord": _66, "tysnes": _66, "xn--tysvr-vra": _66, "tysvær": _66, "tysvar": _66, "ullensaker": _66, "ullensvang": _66, "ulvik": _66, "unjarga": _66, "xn--unjrga-rta": _66, "unjárga": _66, "utsira": _66, "vaapste": _66, "vadso": _66, "xn--vads-jra": _66, "vadsø": _66, "xn--vry-yla5g": _66, "værøy": _66, "vaga": _66, "xn--vg-yiab": _66, "vågå": _66, "vagan": _66, "xn--vgan-qoa": _66, "vågan": _66, "vagsoy": _66, "xn--vgsy-qoa0j": _66, "vågsøy": _66, "vaksdal": _66, "valle": _66, "vang": _66, "vanylven": _66, "vardo": _66, "xn--vard-jra": _66, "vardø": _66, "varggat": _66, "xn--vrggt-xqad": _66, "várggát": _66, "varoy": _66, "vefsn": _66, "vega": _66, "vegarshei": _66, "xn--vegrshei-c0a": _66, "vegårshei": _66, "vennesla": _66, "verdal": _66, "verran": _66, "vestby": _66, "vestfold": [0, { "sande": _66 }], "vestnes": _66, "vestre-slidre": _66, "vestre-toten": _66, "vestvagoy": _66, "xn--vestvgy-ixa6o": _66, "vestvågøy": _66, "vevelstad": _66, "vik": _66, "vikna": _66, "vindafjord": _66, "voagat": _66, "volda": _66, "voss": _66 }], "np": _70, "nr": _75, "nu": _66, "nz": [1, { "ac": _66, "co": _66, "cri": _66, "geek": _66, "gen": _66, "govt": _66, "health": _66, "iwi": _66, "kiwi": _66, "maori": _66, "xn--mori-qsa": _66, "māori": _66, "mil": _66, "net": _66, "org": _66, "parliament": _66, "school": _66 }], "om": [1, { "co": _66, "com": _66, "edu": _66, "gov": _66, "med": _66, "museum": _66, "net": _66, "org": _66, "pro": _66 }], "onion": _66, "org": _66, "pa": [1, { "abo": _66, "ac": _66, "com": _66, "edu": _66, "gob": _66, "ing": _66, "med": _66, "net": _66, "nom": _66, "org": _66, "sld": _66 }], "pe": [1, { "com": _66, "edu": _66, "gob": _66, "mil": _66, "net": _66, "nom": _66, "org": _66 }], "pf": [1, { "com": _66, "edu": _66, "org": _66 }], "pg": _70, "ph": [1, { "com": _66, "edu": _66, "gov": _66, "i": _66, "mil": _66, "net": _66, "ngo": _66, "org": _66 }], "pk": [1, { "ac": _66, "biz": _66, "com": _66, "edu": _66, "fam": _66, "gkp": _66, "gob": _66, "gog": _66, "gok": _66, "gop": _66, "gos": _66, "gov": _66, "net": _66, "org": _66, "web": _66 }], "pl": [1, { "com": _66, "net": _66, "org": _66, "agro": _66, "aid": _66, "atm": _66, "auto": _66, "biz": _66, "edu": _66, "gmina": _66, "gsm": _66, "info": _66, "mail": _66, "media": _66, "miasta": _66, "mil": _66, "nieruchomosci": _66, "nom": _66, "pc": _66, "powiat": _66, "priv": _66, "realestate": _66, "rel": _66, "sex": _66, "shop": _66, "sklep": _66, "sos": _66, "szkola": _66, "targi": _66, "tm": _66, "tourism": _66, "travel": _66, "turystyka": _66, "gov": [1, { "ap": _66, "griw": _66, "ic": _66, "is": _66, "kmpsp": _66, "konsulat": _66, "kppsp": _66, "kwp": _66, "kwpsp": _66, "mup": _66, "mw": _66, "oia": _66, "oirm": _66, "oke": _66, "oow": _66, "oschr": _66, "oum": _66, "pa": _66, "pinb": _66, "piw": _66, "po": _66, "pr": _66, "psp": _66, "psse": _66, "pup": _66, "rzgw": _66, "sa": _66, "sdn": _66, "sko": _66, "so": _66, "sr": _66, "starostwo": _66, "ug": _66, "ugim": _66, "um": _66, "umig": _66, "upow": _66, "uppo": _66, "us": _66, "uw": _66, "uzs": _66, "wif": _66, "wiih": _66, "winb": _66, "wios": _66, "witd": _66, "wiw": _66, "wkz": _66, "wsa": _66, "wskr": _66, "wsse": _66, "wuoz": _66, "wzmiuw": _66, "zp": _66, "zpisdn": _66 }], "augustow": _66, "babia-gora": _66, "bedzin": _66, "beskidy": _66, "bialowieza": _66, "bialystok": _66, "bielawa": _66, "bieszczady": _66, "boleslawiec": _66, "bydgoszcz": _66, "bytom": _66, "cieszyn": _66, "czeladz": _66, "czest": _66, "dlugoleka": _66, "elblag": _66, "elk": _66, "glogow": _66, "gniezno": _66, "gorlice": _66, "grajewo": _66, "ilawa": _66, "jaworzno": _66, "jelenia-gora": _66, "jgora": _66, "kalisz": _66, "karpacz": _66, "kartuzy": _66, "kaszuby": _66, "katowice": _66, "kazimierz-dolny": _66, "kepno": _66, "ketrzyn": _66, "klodzko": _66, "kobierzyce": _66, "kolobrzeg": _66, "konin": _66, "konskowola": _66, "kutno": _66, "lapy": _66, "lebork": _66, "legnica": _66, "lezajsk": _66, "limanowa": _66, "lomza": _66, "lowicz": _66, "lubin": _66, "lukow": _66, "malbork": _66, "malopolska": _66, "mazowsze": _66, "mazury": _66, "mielec": _66, "mielno": _66, "mragowo": _66, "naklo": _66, "nowaruda": _66, "nysa": _66, "olawa": _66, "olecko": _66, "olkusz": _66, "olsztyn": _66, "opoczno": _66, "opole": _66, "ostroda": _66, "ostroleka": _66, "ostrowiec": _66, "ostrowwlkp": _66, "pila": _66, "pisz": _66, "podhale": _66, "podlasie": _66, "polkowice": _66, "pomorskie": _66, "pomorze": _66, "prochowice": _66, "pruszkow": _66, "przeworsk": _66, "pulawy": _66, "radom": _66, "rawa-maz": _66, "rybnik": _66, "rzeszow": _66, "sanok": _66, "sejny": _66, "skoczow": _66, "slask": _66, "slupsk": _66, "sosnowiec": _66, "stalowa-wola": _66, "starachowice": _66, "stargard": _66, "suwalki": _66, "swidnica": _66, "swiebodzin": _66, "swinoujscie": _66, "szczecin": _66, "szczytno": _66, "tarnobrzeg": _66, "tgory": _66, "turek": _66, "tychy": _66, "ustka": _66, "walbrzych": _66, "warmia": _66, "warszawa": _66, "waw": _66, "wegrow": _66, "wielun": _66, "wlocl": _66, "wloclawek": _66, "wodzislaw": _66, "wolomin": _66, "wroclaw": _66, "zachpomor": _66, "zagan": _66, "zarow": _66, "zgora": _66, "zgorzelec": _66 }], "pm": _66, "pn": [1, { "co": _66, "edu": _66, "gov": _66, "net": _66, "org": _66 }], "post": _66, "pr": [1, { "biz": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "isla": _66, "name": _66, "net": _66, "org": _66, "pro": _66, "ac": _66, "est": _66, "prof": _66 }], "pro": [1, { "aaa": _66, "aca": _66, "acct": _66, "avocat": _66, "bar": _66, "cpa": _66, "eng": _66, "jur": _66, "law": _66, "med": _66, "recht": _66 }], "ps": [1, { "com": _66, "edu": _66, "gov": _66, "net": _66, "org": _66, "plo": _66, "sec": _66 }], "pt": [1, { "com": _66, "edu": _66, "gov": _66, "int": _66, "net": _66, "nome": _66, "org": _66, "publ": _66 }], "pw": _69, "py": [1, { "com": _66, "coop": _66, "edu": _66, "gov": _66, "mil": _66, "net": _66, "org": _66 }], "qa": [1, { "com": _66, "edu": _66, "gov": _66, "mil": _66, "name": _66, "net": _66, "org": _66, "sch": _66 }], "re": [1, { "asso": _66, "com": _66 }], "ro": [1, { "arts": _66, "com": _66, "firm": _66, "info": _66, "nom": _66, "nt": _66, "org": _66, "rec": _66, "store": _66, "tm": _66, "www": _66 }], "rs": [1, { "ac": _66, "co": _66, "edu": _66, "gov": _66, "in": _66, "org": _66 }], "ru": _66, "rw": [1, { "ac": _66, "co": _66, "coop": _66, "gov": _66, "mil": _66, "net": _66, "org": _66 }], "sa": [1, { "com": _66, "edu": _66, "gov": _66, "med": _66, "net": _66, "org": _66, "pub": _66, "sch": _66 }], "sb": _68, "sc": _68, "sd": [1, { "com": _66, "edu": _66, "gov": _66, "info": _66, "med": _66, "net": _66, "org": _66, "tv": _66 }], "se": [1, { "a": _66, "ac": _66, "b": _66, "bd": _66, "brand": _66, "c": _66, "d": _66, "e": _66, "f": _66, "fh": _66, "fhsk": _66, "fhv": _66, "g": _66, "h": _66, "i": _66, "k": _66, "komforb": _66, "kommunalforbund": _66, "komvux": _66, "l": _66, "lanbib": _66, "m": _66, "n": _66, "naturbruksgymn": _66, "o": _66, "org": _66, "p": _66, "parti": _66, "pp": _66, "press": _66, "r": _66, "s": _66, "t": _66, "tm": _66, "u": _66, "w": _66, "x": _66, "y": _66, "z": _66 }], "sg": _68, "sh": [1, { "com": _66, "gov": _66, "mil": _66, "net": _66, "org": _66 }], "si": _66, "sj": _66, "sk": _66, "sl": _68, "sm": _66, "sn": [1, { "art": _66, "com": _66, "edu": _66, "gouv": _66, "org": _66, "perso": _66, "univ": _66 }], "so": [1, { "com": _66, "edu": _66, "gov": _66, "me": _66, "net": _66, "org": _66 }], "sr": _66, "ss": [1, { "biz": _66, "co": _66, "com": _66, "edu": _66, "gov": _66, "me": _66, "net": _66, "org": _66, "sch": _66 }], "st": [1, { "co": _66, "com": _66, "consulado": _66, "edu": _66, "embaixada": _66, "mil": _66, "net": _66, "org": _66, "principe": _66, "saotome": _66, "store": _66 }], "su": _66, "sv": [1, { "com": _66, "edu": _66, "gob": _66, "org": _66, "red": _66 }], "sx": _69, "sy": _67, "sz": [1, { "ac": _66, "co": _66, "org": _66 }], "tc": _66, "td": _66, "tel": _66, "tf": _66, "tg": _66, "th": [1, { "ac": _66, "co": _66, "go": _66, "in": _66, "mi": _66, "net": _66, "or": _66 }], "tj": [1, { "ac": _66, "biz": _66, "co": _66, "com": _66, "edu": _66, "go": _66, "gov": _66, "int": _66, "mil": _66, "name": _66, "net": _66, "nic": _66, "org": _66, "test": _66, "web": _66 }], "tk": _66, "tl": _69, "tm": _74, "tn": [1, { "com": _66, "ens": _66, "fin": _66, "gov": _66, "ind": _66, "info": _66, "intl": _66, "mincom": _66, "nat": _66, "net": _66, "org": _66, "perso": _66, "tourism": _66 }], "to": _67, "tr": [1, { "av": _66, "bbs": _66, "bel": _66, "biz": _66, "com": _66, "dr": _66, "edu": _66, "gen": _66, "gov": _66, "info": _66, "k12": _66, "kep": _66, "mil": _66, "name": _66, "net": _66, "org": _66, "pol": _66, "tel": _66, "tsk": _66, "tv": _66, "web": _66, "nc": _69 }], "tt": [1, { "biz": _66, "co": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "mil": _66, "name": _66, "net": _66, "org": _66, "pro": _66 }], "tv": _66, "tw": [1, { "club": _66, "com": _66, "ebiz": _66, "edu": _66, "game": _66, "gov": _66, "idv": _66, "mil": _66, "net": _66, "org": _66 }], "tz": [1, { "ac": _66, "co": _66, "go": _66, "hotel": _66, "info": _66, "me": _66, "mil": _66, "mobi": _66, "ne": _66, "or": _66, "sc": _66, "tv": _66 }], "ua": [1, { "com": _66, "edu": _66, "gov": _66, "in": _66, "net": _66, "org": _66, "cherkassy": _66, "cherkasy": _66, "chernigov": _66, "chernihiv": _66, "chernivtsi": _66, "chernovtsy": _66, "ck": _66, "cn": _66, "cr": _66, "crimea": _66, "cv": _66, "dn": _66, "dnepropetrovsk": _66, "dnipropetrovsk": _66, "donetsk": _66, "dp": _66, "if": _66, "ivano-frankivsk": _66, "kh": _66, "kharkiv": _66, "kharkov": _66, "kherson": _66, "khmelnitskiy": _66, "khmelnytskyi": _66, "kiev": _66, "kirovograd": _66, "km": _66, "kr": _66, "kropyvnytskyi": _66, "krym": _66, "ks": _66, "kv": _66, "kyiv": _66, "lg": _66, "lt": _66, "lugansk": _66, "luhansk": _66, "lutsk": _66, "lv": _66, "lviv": _66, "mk": _66, "mykolaiv": _66, "nikolaev": _66, "od": _66, "odesa": _66, "odessa": _66, "pl": _66, "poltava": _66, "rivne": _66, "rovno": _66, "rv": _66, "sb": _66, "sebastopol": _66, "sevastopol": _66, "sm": _66, "sumy": _66, "te": _66, "ternopil": _66, "uz": _66, "uzhgorod": _66, "uzhhorod": _66, "vinnica": _66, "vinnytsia": _66, "vn": _66, "volyn": _66, "yalta": _66, "zakarpattia": _66, "zaporizhzhe": _66, "zaporizhzhia": _66, "zhitomir": _66, "zhytomyr": _66, "zp": _66, "zt": _66 }], "ug": [1, { "ac": _66, "co": _66, "com": _66, "edu": _66, "go": _66, "gov": _66, "mil": _66, "ne": _66, "or": _66, "org": _66, "sc": _66, "us": _66 }], "uk": [1, { "ac": _66, "co": _66, "gov": _66, "ltd": _66, "me": _66, "net": _66, "nhs": _66, "org": _66, "plc": _66, "police": _66, "sch": _70 }], "us": [1, { "dni": _66, "isa": _66, "nsn": _66, "ak": _78, "al": _78, "ar": _78, "as": _78, "az": _78, "ca": _78, "co": _78, "ct": _78, "dc": _78, "de": _79, "fl": _78, "ga": _78, "gu": _78, "hi": _80, "ia": _78, "id": _78, "il": _78, "in": _78, "ks": _78, "ky": _78, "la": _78, "ma": [1, { "k12": [1, { "chtr": _66, "paroch": _66, "pvt": _66 }], "cc": _66, "lib": _66 }], "md": _78, "me": _78, "mi": [1, { "k12": _66, "cc": _66, "lib": _66, "ann-arbor": _66, "cog": _66, "dst": _66, "eaton": _66, "gen": _66, "mus": _66, "tec": _66, "washtenaw": _66 }], "mn": _78, "mo": _78, "ms": _78, "mt": _78, "nc": _78, "nd": _80, "ne": _78, "nh": _78, "nj": _78, "nm": _78, "nv": _78, "ny": _78, "oh": _78, "ok": _78, "or": _78, "pa": _78, "pr": _78, "ri": _80, "sc": _78, "sd": _80, "tn": _78, "tx": _78, "ut": _78, "va": _78, "vi": _78, "vt": _78, "wa": _78, "wi": _78, "wv": _79, "wy": _78 }], "uy": [1, { "com": _66, "edu": _66, "gub": _66, "mil": _66, "net": _66, "org": _66 }], "uz": [1, { "co": _66, "com": _66, "net": _66, "org": _66 }], "va": _66, "vc": _67, "ve": [1, { "arts": _66, "bib": _66, "co": _66, "com": _66, "e12": _66, "edu": _66, "emprende": _66, "firm": _66, "gob": _66, "gov": _66, "info": _66, "int": _66, "mil": _66, "net": _66, "nom": _66, "org": _66, "rar": _66, "rec": _66, "store": _66, "tec": _66, "web": _66 }], "vg": [1, { "edu": _66 }], "vi": [1, { "co": _66, "com": _66, "k12": _66, "net": _66, "org": _66 }], "vn": [1, { "ac": _66, "ai": _66, "biz": _66, "com": _66, "edu": _66, "gov": _66, "health": _66, "id": _66, "info": _66, "int": _66, "io": _66, "name": _66, "net": _66, "org": _66, "pro": _66, "angiang": _66, "bacgiang": _66, "backan": _66, "baclieu": _66, "bacninh": _66, "baria-vungtau": _66, "bentre": _66, "binhdinh": _66, "binhduong": _66, "binhphuoc": _66, "binhthuan": _66, "camau": _66, "cantho": _66, "caobang": _66, "daklak": _66, "daknong": _66, "danang": _66, "dienbien": _66, "dongnai": _66, "dongthap": _66, "gialai": _66, "hagiang": _66, "haiduong": _66, "haiphong": _66, "hanam": _66, "hanoi": _66, "hatinh": _66, "haugiang": _66, "hoabinh": _66, "hungyen": _66, "khanhhoa": _66, "kiengiang": _66, "kontum": _66, "laichau": _66, "lamdong": _66, "langson": _66, "laocai": _66, "longan": _66, "namdinh": _66, "nghean": _66, "ninhbinh": _66, "ninhthuan": _66, "phutho": _66, "phuyen": _66, "quangbinh": _66, "quangnam": _66, "quangngai": _66, "quangninh": _66, "quangtri": _66, "soctrang": _66, "sonla": _66, "tayninh": _66, "thaibinh": _66, "thainguyen": _66, "thanhhoa": _66, "thanhphohochiminh": _66, "thuathienhue": _66, "tiengiang": _66, "travinh": _66, "tuyenquang": _66, "vinhlong": _66, "vinhphuc": _66, "yenbai": _66 }], "vu": _72, "wf": _66, "ws": _68, "yt": _66, "xn--mgbaam7a8h": _66, "امارات": _66, "xn--y9a3aq": _66, "հայ": _66, "xn--54b7fta0cc": _66, "বাংলা": _66, "xn--90ae": _66, "бг": _66, "xn--mgbcpq6gpa1a": _66, "البحرين": _66, "xn--90ais": _66, "бел": _66, "xn--fiqs8s": _66, "中国": _66, "xn--fiqz9s": _66, "中國": _66, "xn--lgbbat1ad8j": _66, "الجزائر": _66, "xn--wgbh1c": _66, "مصر": _66, "xn--e1a4c": _66, "ею": _66, "xn--qxa6a": _66, "ευ": _66, "xn--mgbah1a3hjkrd": _66, "موريتانيا": _66, "xn--node": _66, "გე": _66, "xn--qxam": _66, "ελ": _66, "xn--j6w193g": [1, { "xn--gmqw5a": _66, "xn--55qx5d": _66, "xn--mxtq1m": _66, "xn--wcvs22d": _66, "xn--uc0atv": _66, "xn--od0alg": _66 }], "香港": [1, { "個人": _66, "公司": _66, "政府": _66, "教育": _66, "組織": _66, "網絡": _66 }], "xn--2scrj9c": _66, "ಭಾರತ": _66, "xn--3hcrj9c": _66, "ଭାରତ": _66, "xn--45br5cyl": _66, "ভাৰত": _66, "xn--h2breg3eve": _66, "भारतम्": _66, "xn--h2brj9c8c": _66, "भारोत": _66, "xn--mgbgu82a": _66, "ڀارت": _66, "xn--rvc1e0am3e": _66, "ഭാരതം": _66, "xn--h2brj9c": _66, "भारत": _66, "xn--mgbbh1a": _66, "بارت": _66, "xn--mgbbh1a71e": _66, "بھارت": _66, "xn--fpcrj9c3d": _66, "భారత్": _66, "xn--gecrj9c": _66, "ભારત": _66, "xn--s9brj9c": _66, "ਭਾਰਤ": _66, "xn--45brj9c": _66, "ভারত": _66, "xn--xkc2dl3a5ee0h": _66, "இந்தியா": _66, "xn--mgba3a4f16a": _66, "ایران": _66, "xn--mgba3a4fra": _66, "ايران": _66, "xn--mgbtx2b": _66, "عراق": _66, "xn--mgbayh7gpa": _66, "الاردن": _66, "xn--3e0b707e": _66, "한국": _66, "xn--80ao21a": _66, "қаз": _66, "xn--q7ce6a": _66, "ລາວ": _66, "xn--fzc2c9e2c": _66, "ලංකා": _66, "xn--xkc2al3hye2a": _66, "இலங்கை": _66, "xn--mgbc0a9azcg": _66, "المغرب": _66, "xn--d1alf": _66, "мкд": _66, "xn--l1acc": _66, "мон": _66, "xn--mix891f": _66, "澳門": _66, "xn--mix082f": _66, "澳门": _66, "xn--mgbx4cd0ab": _66, "مليسيا": _66, "xn--mgb9awbf": _66, "عمان": _66, "xn--mgbai9azgqp6j": _66, "پاکستان": _66, "xn--mgbai9a5eva00b": _66, "پاكستان": _66, "xn--ygbi2ammx": _66, "فلسطين": _66, "xn--90a3ac": [1, { "xn--80au": _66, "xn--90azh": _66, "xn--d1at": _66, "xn--c1avg": _66, "xn--o1ac": _66, "xn--o1ach": _66 }], "срб": [1, { "ак": _66, "обр": _66, "од": _66, "орг": _66, "пр": _66, "упр": _66 }], "xn--p1ai": _66, "рф": _66, "xn--wgbl6a": _66, "قطر": _66, "xn--mgberp4a5d4ar": _66, "السعودية": _66, "xn--mgberp4a5d4a87g": _66, "السعودیة": _66, "xn--mgbqly7c0a67fbc": _66, "السعودیۃ": _66, "xn--mgbqly7cvafr": _66, "السعوديه": _66, "xn--mgbpl2fh": _66, "سودان": _66, "xn--yfro4i67o": _66, "新加坡": _66, "xn--clchc0ea0b2g2a9gcd": _66, "சிங்கப்பூர்": _66, "xn--ogbpf8fl": _66, "سورية": _66, "xn--mgbtf8fl": _66, "سوريا": _66, "xn--o3cw4h": [1, { "xn--o3cyx2a": _66, "xn--12co0c3b4eva": _66, "xn--m3ch0j3a": _66, "xn--h3cuzk1di": _66, "xn--12c1fe0br": _66, "xn--12cfi8ixb8l": _66 }], "ไทย": [1, { "ทหาร": _66, "ธุรกิจ": _66, "เน็ต": _66, "รัฐบาล": _66, "ศึกษา": _66, "องค์กร": _66 }], "xn--pgbs0dh": _66, "تونس": _66, "xn--kpry57d": _66, "台灣": _66, "xn--kprw13d": _66, "台湾": _66, "xn--nnx388a": _66, "臺灣": _66, "xn--j1amh": _66, "укр": _66, "xn--mgb2ddes": _66, "اليمن": _66, "xxx": _66, "ye": _67, "za": [0, { "ac": _66, "agric": _66, "alt": _66, "co": _66, "edu": _66, "gov": _66, "grondar": _66, "law": _66, "mil": _66, "net": _66, "ngo": _66, "nic": _66, "nis": _66, "nom": _66, "org": _66, "school": _66, "tm": _66, "web": _66 }], "zm": [1, { "ac": _66, "biz": _66, "co": _66, "com": _66, "edu": _66, "gov": _66, "info": _66, "mil": _66, "net": _66, "org": _66, "sch": _66 }], "zw": [1, { "ac": _66, "co": _66, "gov": _66, "mil": _66, "org": _66 }], "aaa": _66, "aarp": _66, "abb": _66, "abbott": _66, "abbvie": _66, "abc": _66, "able": _66, "abogado": _66, "abudhabi": _66, "academy": _66, "accenture": _66, "accountant": _66, "accountants": _66, "aco": _66, "actor": _66, "ads": _66, "adult": _66, "aeg": _66, "aetna": _66, "afl": _66, "africa": _66, "agakhan": _66, "agency": _66, "aig": _66, "airbus": _66, "airforce": _66, "airtel": _66, "akdn": _66, "alibaba": _66, "alipay": _66, "allfinanz": _66, "allstate": _66, "ally": _66, "alsace": _66, "alstom": _66, "amazon": _66, "americanexpress": _66, "americanfamily": _66, "amex": _66, "amfam": _66, "amica": _66, "amsterdam": _66, "analytics": _66, "android": _66, "anquan": _66, "anz": _66, "aol": _66, "apartments": _66, "app": _66, "apple": _66, "aquarelle": _66, "arab": _66, "aramco": _66, "archi": _66, "army": _66, "art": _66, "arte": _66, "asda": _66, "associates": _66, "athleta": _66, "attorney": _66, "auction": _66, "audi": _66, "audible": _66, "audio": _66, "auspost": _66, "author": _66, "auto": _66, "autos": _66, "aws": _66, "axa": _66, "azure": _66, "baby": _66, "baidu": _66, "banamex": _66, "band": _66, "bank": _66, "bar": _66, "barcelona": _66, "barclaycard": _66, "barclays": _66, "barefoot": _66, "bargains": _66, "baseball": _66, "basketball": _66, "bauhaus": _66, "bayern": _66, "bbc": _66, "bbt": _66, "bbva": _66, "bcg": _66, "bcn": _66, "beats": _66, "beauty": _66, "beer": _66, "bentley": _66, "berlin": _66, "best": _66, "bestbuy": _66, "bet": _66, "bharti": _66, "bible": _66, "bid": _66, "bike": _66, "bing": _66, "bingo": _66, "bio": _66, "black": _66, "blackfriday": _66, "blockbuster": _66, "blog": _66, "bloomberg": _66, "blue": _66, "bms": _66, "bmw": _66, "bnpparibas": _66, "boats": _66, "boehringer": _66, "bofa": _66, "bom": _66, "bond": _66, "boo": _66, "book": _66, "booking": _66, "bosch": _66, "bostik": _66, "boston": _66, "bot": _66, "boutique": _66, "box": _66, "bradesco": _66, "bridgestone": _66, "broadway": _66, "broker": _66, "brother": _66, "brussels": _66, "build": _66, "builders": _66, "business": _66, "buy": _66, "buzz": _66, "bzh": _66, "cab": _66, "cafe": _66, "cal": _66, "call": _66, "calvinklein": _66, "cam": _66, "camera": _66, "camp": _66, "canon": _66, "capetown": _66, "capital": _66, "capitalone": _66, "car": _66, "caravan": _66, "cards": _66, "care": _66, "career": _66, "careers": _66, "cars": _66, "casa": _66, "case": _66, "cash": _66, "casino": _66, "catering": _66, "catholic": _66, "cba": _66, "cbn": _66, "cbre": _66, "center": _66, "ceo": _66, "cern": _66, "cfa": _66, "cfd": _66, "chanel": _66, "channel": _66, "charity": _66, "chase": _66, "chat": _66, "cheap": _66, "chintai": _66, "christmas": _66, "chrome": _66, "church": _66, "cipriani": _66, "circle": _66, "cisco": _66, "citadel": _66, "citi": _66, "citic": _66, "city": _66, "claims": _66, "cleaning": _66, "click": _66, "clinic": _66, "clinique": _66, "clothing": _66, "cloud": _66, "club": _66, "clubmed": _66, "coach": _66, "codes": _66, "coffee": _66, "college": _66, "cologne": _66, "commbank": _66, "community": _66, "company": _66, "compare": _66, "computer": _66, "comsec": _66, "condos": _66, "construction": _66, "consulting": _66, "contact": _66, "contractors": _66, "cooking": _66, "cool": _66, "corsica": _66, "country": _66, "coupon": _66, "coupons": _66, "courses": _66, "cpa": _66, "credit": _66, "creditcard": _66, "creditunion": _66, "cricket": _66, "crown": _66, "crs": _66, "cruise": _66, "cruises": _66, "cuisinella": _66, "cymru": _66, "cyou": _66, "dad": _66, "dance": _66, "data": _66, "date": _66, "dating": _66, "datsun": _66, "day": _66, "dclk": _66, "dds": _66, "deal": _66, "dealer": _66, "deals": _66, "degree": _66, "delivery": _66, "dell": _66, "deloitte": _66, "delta": _66, "democrat": _66, "dental": _66, "dentist": _66, "desi": _66, "design": _66, "dev": _66, "dhl": _66, "diamonds": _66, "diet": _66, "digital": _66, "direct": _66, "directory": _66, "discount": _66, "discover": _66, "dish": _66, "diy": _66, "dnp": _66, "docs": _66, "doctor": _66, "dog": _66, "domains": _66, "dot": _66, "download": _66, "drive": _66, "dtv": _66, "dubai": _66, "dunlop": _66, "dupont": _66, "durban": _66, "dvag": _66, "dvr": _66, "earth": _66, "eat": _66, "eco": _66, "edeka": _66, "education": _66, "email": _66, "emerck": _66, "energy": _66, "engineer": _66, "engineering": _66, "enterprises": _66, "epson": _66, "equipment": _66, "ericsson": _66, "erni": _66, "esq": _66, "estate": _66, "eurovision": _66, "eus": _66, "events": _66, "exchange": _66, "expert": _66, "exposed": _66, "express": _66, "extraspace": _66, "fage": _66, "fail": _66, "fairwinds": _66, "faith": _66, "family": _66, "fan": _66, "fans": _66, "farm": _66, "farmers": _66, "fashion": _66, "fast": _66, "fedex": _66, "feedback": _66, "ferrari": _66, "ferrero": _66, "fidelity": _66, "fido": _66, "film": _66, "final": _66, "finance": _66, "financial": _66, "fire": _66, "firestone": _66, "firmdale": _66, "fish": _66, "fishing": _66, "fit": _66, "fitness": _66, "flickr": _66, "flights": _66, "flir": _66, "florist": _66, "flowers": _66, "fly": _66, "foo": _66, "food": _66, "football": _66, "ford": _66, "forex": _66, "forsale": _66, "forum": _66, "foundation": _66, "fox": _66, "free": _66, "fresenius": _66, "frl": _66, "frogans": _66, "frontier": _66, "ftr": _66, "fujitsu": _66, "fun": _66, "fund": _66, "furniture": _66, "futbol": _66, "fyi": _66, "gal": _66, "gallery": _66, "gallo": _66, "gallup": _66, "game": _66, "games": _66, "gap": _66, "garden": _66, "gay": _66, "gbiz": _66, "gdn": _66, "gea": _66, "gent": _66, "genting": _66, "george": _66, "ggee": _66, "gift": _66, "gifts": _66, "gives": _66, "giving": _66, "glass": _66, "gle": _66, "global": _66, "globo": _66, "gmail": _66, "gmbh": _66, "gmo": _66, "gmx": _66, "godaddy": _66, "gold": _66, "goldpoint": _66, "golf": _66, "goo": _66, "goodyear": _66, "goog": _66, "google": _66, "gop": _66, "got": _66, "grainger": _66, "graphics": _66, "gratis": _66, "green": _66, "gripe": _66, "grocery": _66, "group": _66, "gucci": _66, "guge": _66, "guide": _66, "guitars": _66, "guru": _66, "hair": _66, "hamburg": _66, "hangout": _66, "haus": _66, "hbo": _66, "hdfc": _66, "hdfcbank": _66, "health": _66, "healthcare": _66, "help": _66, "helsinki": _66, "here": _66, "hermes": _66, "hiphop": _66, "hisamitsu": _66, "hitachi": _66, "hiv": _66, "hkt": _66, "hockey": _66, "holdings": _66, "holiday": _66, "homedepot": _66, "homegoods": _66, "homes": _66, "homesense": _66, "honda": _66, "horse": _66, "hospital": _66, "host": _66, "hosting": _66, "hot": _66, "hotels": _66, "hotmail": _66, "house": _66, "how": _66, "hsbc": _66, "hughes": _66, "hyatt": _66, "hyundai": _66, "ibm": _66, "icbc": _66, "ice": _66, "icu": _66, "ieee": _66, "ifm": _66, "ikano": _66, "imamat": _66, "imdb": _66, "immo": _66, "immobilien": _66, "inc": _66, "industries": _66, "infiniti": _66, "ing": _66, "ink": _66, "institute": _66, "insurance": _66, "insure": _66, "international": _66, "intuit": _66, "investments": _66, "ipiranga": _66, "irish": _66, "ismaili": _66, "ist": _66, "istanbul": _66, "itau": _66, "itv": _66, "jaguar": _66, "java": _66, "jcb": _66, "jeep": _66, "jetzt": _66, "jewelry": _66, "jio": _66, "jll": _66, "jmp": _66, "jnj": _66, "joburg": _66, "jot": _66, "joy": _66, "jpmorgan": _66, "jprs": _66, "juegos": _66, "juniper": _66, "kaufen": _66, "kddi": _66, "kerryhotels": _66, "kerryproperties": _66, "kfh": _66, "kia": _66, "kids": _66, "kim": _66, "kindle": _66, "kitchen": _66, "kiwi": _66, "koeln": _66, "komatsu": _66, "kosher": _66, "kpmg": _66, "kpn": _66, "krd": _66, "kred": _66, "kuokgroup": _66, "kyoto": _66, "lacaixa": _66, "lamborghini": _66, "lamer": _66, "lancaster": _66, "land": _66, "landrover": _66, "lanxess": _66, "lasalle": _66, "lat": _66, "latino": _66, "latrobe": _66, "law": _66, "lawyer": _66, "lds": _66, "lease": _66, "leclerc": _66, "lefrak": _66, "legal": _66, "lego": _66, "lexus": _66, "lgbt": _66, "lidl": _66, "life": _66, "lifeinsurance": _66, "lifestyle": _66, "lighting": _66, "like": _66, "lilly": _66, "limited": _66, "limo": _66, "lincoln": _66, "link": _66, "live": _66, "living": _66, "llc": _66, "llp": _66, "loan": _66, "loans": _66, "locker": _66, "locus": _66, "lol": _66, "london": _66, "lotte": _66, "lotto": _66, "love": _66, "lpl": _66, "lplfinancial": _66, "ltd": _66, "ltda": _66, "lundbeck": _66, "luxe": _66, "luxury": _66, "madrid": _66, "maif": _66, "maison": _66, "makeup": _66, "man": _66, "management": _66, "mango": _66, "map": _66, "market": _66, "marketing": _66, "markets": _66, "marriott": _66, "marshalls": _66, "mattel": _66, "mba": _66, "mckinsey": _66, "med": _66, "media": _66, "meet": _66, "melbourne": _66, "meme": _66, "memorial": _66, "men": _66, "menu": _66, "merck": _66, "merckmsd": _66, "miami": _66, "microsoft": _66, "mini": _66, "mint": _66, "mit": _66, "mitsubishi": _66, "mlb": _66, "mls": _66, "mma": _66, "mobile": _66, "moda": _66, "moe": _66, "moi": _66, "mom": _66, "monash": _66, "money": _66, "monster": _66, "mormon": _66, "mortgage": _66, "moscow": _66, "moto": _66, "motorcycles": _66, "mov": _66, "movie": _66, "msd": _66, "mtn": _66, "mtr": _66, "music": _66, "nab": _66, "nagoya": _66, "navy": _66, "nba": _66, "nec": _66, "netbank": _66, "netflix": _66, "network": _66, "neustar": _66, "new": _66, "news": _66, "next": _66, "nextdirect": _66, "nexus": _66, "nfl": _66, "ngo": _66, "nhk": _66, "nico": _66, "nike": _66, "nikon": _66, "ninja": _66, "nissan": _66, "nissay": _66, "nokia": _66, "norton": _66, "now": _66, "nowruz": _66, "nowtv": _66, "nra": _66, "nrw": _66, "ntt": _66, "nyc": _66, "obi": _66, "observer": _66, "office": _66, "okinawa": _66, "olayan": _66, "olayangroup": _66, "ollo": _66, "omega": _66, "one": _66, "ong": _66, "onl": _66, "online": _66, "ooo": _66, "open": _66, "oracle": _66, "orange": _66, "organic": _66, "origins": _66, "osaka": _66, "otsuka": _66, "ott": _66, "ovh": _66, "page": _66, "panasonic": _66, "paris": _66, "pars": _66, "partners": _66, "parts": _66, "party": _66, "pay": _66, "pccw": _66, "pet": _66, "pfizer": _66, "pharmacy": _66, "phd": _66, "philips": _66, "phone": _66, "photo": _66, "photography": _66, "photos": _66, "physio": _66, "pics": _66, "pictet": _66, "pictures": _66, "pid": _66, "pin": _66, "ping": _66, "pink": _66, "pioneer": _66, "pizza": _66, "place": _66, "play": _66, "playstation": _66, "plumbing": _66, "plus": _66, "pnc": _66, "pohl": _66, "poker": _66, "politie": _66, "porn": _66, "pramerica": _66, "praxi": _66, "press": _66, "prime": _66, "prod": _66, "productions": _66, "prof": _66, "progressive": _66, "promo": _66, "properties": _66, "property": _66, "protection": _66, "pru": _66, "prudential": _66, "pub": _66, "pwc": _66, "qpon": _66, "quebec": _66, "quest": _66, "racing": _66, "radio": _66, "read": _66, "realestate": _66, "realtor": _66, "realty": _66, "recipes": _66, "red": _66, "redstone": _66, "redumbrella": _66, "rehab": _66, "reise": _66, "reisen": _66, "reit": _66, "reliance": _66, "ren": _66, "rent": _66, "rentals": _66, "repair": _66, "report": _66, "republican": _66, "rest": _66, "restaurant": _66, "review": _66, "reviews": _66, "rexroth": _66, "rich": _66, "richardli": _66, "ricoh": _66, "ril": _66, "rio": _66, "rip": _66, "rocks": _66, "rodeo": _66, "rogers": _66, "room": _66, "rsvp": _66, "rugby": _66, "ruhr": _66, "run": _66, "rwe": _66, "ryukyu": _66, "saarland": _66, "safe": _66, "safety": _66, "sakura": _66, "sale": _66, "salon": _66, "samsclub": _66, "samsung": _66, "sandvik": _66, "sandvikcoromant": _66, "sanofi": _66, "sap": _66, "sarl": _66, "sas": _66, "save": _66, "saxo": _66, "sbi": _66, "sbs": _66, "scb": _66, "schaeffler": _66, "schmidt": _66, "scholarships": _66, "school": _66, "schule": _66, "schwarz": _66, "science": _66, "scot": _66, "search": _66, "seat": _66, "secure": _66, "security": _66, "seek": _66, "select": _66, "sener": _66, "services": _66, "seven": _66, "sew": _66, "sex": _66, "sexy": _66, "sfr": _66, "shangrila": _66, "sharp": _66, "shell": _66, "shia": _66, "shiksha": _66, "shoes": _66, "shop": _66, "shopping": _66, "shouji": _66, "show": _66, "silk": _66, "sina": _66, "singles": _66, "site": _66, "ski": _66, "skin": _66, "sky": _66, "skype": _66, "sling": _66, "smart": _66, "smile": _66, "sncf": _66, "soccer": _66, "social": _66, "softbank": _66, "software": _66, "sohu": _66, "solar": _66, "solutions": _66, "song": _66, "sony": _66, "soy": _66, "spa": _66, "space": _66, "sport": _66, "spot": _66, "srl": _66, "stada": _66, "staples": _66, "star": _66, "statebank": _66, "statefarm": _66, "stc": _66, "stcgroup": _66, "stockholm": _66, "storage": _66, "store": _66, "stream": _66, "studio": _66, "study": _66, "style": _66, "sucks": _66, "supplies": _66, "supply": _66, "support": _66, "surf": _66, "surgery": _66, "suzuki": _66, "swatch": _66, "swiss": _66, "sydney": _66, "systems": _66, "tab": _66, "taipei": _66, "talk": _66, "taobao": _66, "target": _66, "tatamotors": _66, "tatar": _66, "tattoo": _66, "tax": _66, "taxi": _66, "tci": _66, "tdk": _66, "team": _66, "tech": _66, "technology": _66, "temasek": _66, "tennis": _66, "teva": _66, "thd": _66, "theater": _66, "theatre": _66, "tiaa": _66, "tickets": _66, "tienda": _66, "tips": _66, "tires": _66, "tirol": _66, "tjmaxx": _66, "tjx": _66, "tkmaxx": _66, "tmall": _66, "today": _66, "tokyo": _66, "tools": _66, "top": _66, "toray": _66, "toshiba": _66, "total": _66, "tours": _66, "town": _66, "toyota": _66, "toys": _66, "trade": _66, "trading": _66, "training": _66, "travel": _66, "travelers": _66, "travelersinsurance": _66, "trust": _66, "trv": _66, "tube": _66, "tui": _66, "tunes": _66, "tushu": _66, "tvs": _66, "ubank": _66, "ubs": _66, "unicom": _66, "university": _66, "uno": _66, "uol": _66, "ups": _66, "vacations": _66, "vana": _66, "vanguard": _66, "vegas": _66, "ventures": _66, "verisign": _66, "versicherung": _66, "vet": _66, "viajes": _66, "video": _66, "vig": _66, "viking": _66, "villas": _66, "vin": _66, "vip": _66, "virgin": _66, "visa": _66, "vision": _66, "viva": _66, "vivo": _66, "vlaanderen": _66, "vodka": _66, "volvo": _66, "vote": _66, "voting": _66, "voto": _66, "voyage": _66, "wales": _66, "walmart": _66, "walter": _66, "wang": _66, "wanggou": _66, "watch": _66, "watches": _66, "weather": _66, "weatherchannel": _66, "webcam": _66, "weber": _66, "website": _66, "wed": _66, "wedding": _66, "weibo": _66, "weir": _66, "whoswho": _66, "wien": _66, "wiki": _66, "williamhill": _66, "win": _66, "windows": _66, "wine": _66, "winners": _66, "wme": _66, "wolterskluwer": _66, "woodside": _66, "work": _66, "works": _66, "world": _66, "wow": _66, "wtc": _66, "wtf": _66, "xbox": _66, "xerox": _66, "xihuan": _66, "xin": _66, "xn--11b4c3d": _66, "कॉम": _66, "xn--1ck2e1b": _66, "セール": _66, "xn--1qqw23a": _66, "佛山": _66, "xn--30rr7y": _66, "慈善": _66, "xn--3bst00m": _66, "集团": _66, "xn--3ds443g": _66, "在线": _66, "xn--3pxu8k": _66, "点看": _66, "xn--42c2d9a": _66, "คอม": _66, "xn--45q11c": _66, "八卦": _66, "xn--4gbrim": _66, "موقع": _66, "xn--55qw42g": _66, "公益": _66, "xn--55qx5d": _66, "公司": _66, "xn--5su34j936bgsg": _66, "香格里拉": _66, "xn--5tzm5g": _66, "网站": _66, "xn--6frz82g": _66, "移动": _66, "xn--6qq986b3xl": _66, "我爱你": _66, "xn--80adxhks": _66, "москва": _66, "xn--80aqecdr1a": _66, "католик": _66, "xn--80asehdb": _66, "онлайн": _66, "xn--80aswg": _66, "сайт": _66, "xn--8y0a063a": _66, "联通": _66, "xn--9dbq2a": _66, "קום": _66, "xn--9et52u": _66, "时尚": _66, "xn--9krt00a": _66, "微博": _66, "xn--b4w605ferd": _66, "淡马锡": _66, "xn--bck1b9a5dre4c": _66, "ファッション": _66, "xn--c1avg": _66, "орг": _66, "xn--c2br7g": _66, "नेट": _66, "xn--cck2b3b": _66, "ストア": _66, "xn--cckwcxetd": _66, "アマゾン": _66, "xn--cg4bki": _66, "삼성": _66, "xn--czr694b": _66, "商标": _66, "xn--czrs0t": _66, "商店": _66, "xn--czru2d": _66, "商城": _66, "xn--d1acj3b": _66, "дети": _66, "xn--eckvdtc9d": _66, "ポイント": _66, "xn--efvy88h": _66, "新闻": _66, "xn--fct429k": _66, "家電": _66, "xn--fhbei": _66, "كوم": _66, "xn--fiq228c5hs": _66, "中文网": _66, "xn--fiq64b": _66, "中信": _66, "xn--fjq720a": _66, "娱乐": _66, "xn--flw351e": _66, "谷歌": _66, "xn--fzys8d69uvgm": _66, "電訊盈科": _66, "xn--g2xx48c": _66, "购物": _66, "xn--gckr3f0f": _66, "クラウド": _66, "xn--gk3at1e": _66, "通販": _66, "xn--hxt814e": _66, "网店": _66, "xn--i1b6b1a6a2e": _66, "संगठन": _66, "xn--imr513n": _66, "餐厅": _66, "xn--io0a7i": _66, "网络": _66, "xn--j1aef": _66, "ком": _66, "xn--jlq480n2rg": _66, "亚马逊": _66, "xn--jvr189m": _66, "食品": _66, "xn--kcrx77d1x4a": _66, "飞利浦": _66, "xn--kput3i": _66, "手机": _66, "xn--mgba3a3ejt": _66, "ارامكو": _66, "xn--mgba7c0bbn0a": _66, "العليان": _66, "xn--mgbab2bd": _66, "بازار": _66, "xn--mgbca7dzdo": _66, "ابوظبي": _66, "xn--mgbi4ecexp": _66, "كاثوليك": _66, "xn--mgbt3dhd": _66, "همراه": _66, "xn--mk1bu44c": _66, "닷컴": _66, "xn--mxtq1m": _66, "政府": _66, "xn--ngbc5azd": _66, "شبكة": _66, "xn--ngbe9e0a": _66, "بيتك": _66, "xn--ngbrx": _66, "عرب": _66, "xn--nqv7f": _66, "机构": _66, "xn--nqv7fs00ema": _66, "组织机构": _66, "xn--nyqy26a": _66, "健康": _66, "xn--otu796d": _66, "招聘": _66, "xn--p1acf": _66, "рус": _66, "xn--pssy2u": _66, "大拿": _66, "xn--q9jyb4c": _66, "みんな": _66, "xn--qcka1pmc": _66, "グーグル": _66, "xn--rhqv96g": _66, "世界": _66, "xn--rovu88b": _66, "書籍": _66, "xn--ses554g": _66, "网址": _66, "xn--t60b56a": _66, "닷넷": _66, "xn--tckwe": _66, "コム": _66, "xn--tiq49xqyj": _66, "天主教": _66, "xn--unup4y": _66, "游戏": _66, "xn--vermgensberater-ctb": _66, "vermögensberater": _66, "xn--vermgensberatung-pwb": _66, "vermögensberatung": _66, "xn--vhquv": _66, "企业": _66, "xn--vuq861b": _66, "信息": _66, "xn--w4r85el8fhu5dnra": _66, "嘉里大酒店": _66, "xn--w4rs40l": _66, "嘉里": _66, "xn--xhq521b": _66, "广东": _66, "xn--zfr164b": _66, "政务": _66, "xyz": _66, "yachts": _66, "yahoo": _66, "yamaxun": _66, "yandex": _66, "yodobashi": _66, "yoga": _66, "yokohama": _66, "you": _66, "youtube": _66, "yun": _66, "zappos": _66, "zara": _66, "zero": _66, "zip": _66, "zone": _66, "zuerich": _66 }];
    return rules;
})();

/**
 * Lookup parts of domain in Trie
 */
function lookupInTrie(parts, trie, index) {
    let result = null;
    let node = trie;
    while (node !== undefined) {
        // We have a match!
        if (node[0] === 1) {
            result = {
                index: index + 1,
            };
        }
        // No more `parts` to look for
        if (index === -1) {
            break;
        }
        const succ = node[1];
        node = Object.prototype.hasOwnProperty.call(succ, parts[index])
            ? succ[parts[index]]
            : succ['*'];
        index -= 1;
    }
    return result;
}
/**
 * Check if `hostname` has a valid public suffix in `trie`.
 */
function suffixLookup(hostname, options, out) {
    var _a;
    if (fastPathLookup(hostname, options, out)) {
        return;
    }
    const hostnameParts = hostname.split('.');
    // Look for exceptions
    const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1);
    if (exceptionMatch !== null) {
        out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join('.');
        return;
    }
    // Look for a match in rules
    const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1);
    if (rulesMatch !== null) {
        out.publicSuffix = hostnameParts.slice(rulesMatch.index).join('.');
        return;
    }
    // No match found...
    // Prevailing rule is '*' so we consider the top-level domain to be the
    // public suffix of `hostname` (e.g.: 'example.org' => 'org').
    out.publicSuffix = (_a = hostnameParts[hostnameParts.length - 1]) !== null && _a !== void 0 ? _a : null;
}

// For all methods but 'parse', it does not make sense to allocate an object
// every single time to only return the value of a specific attribute. To avoid
// this un-necessary allocation, we use a global object which is re-used.
const RESULT = getEmptyResult();
function parse(url, options = {}) {
    return parseImpl(url, 5 /* FLAG.ALL */, suffixLookup, options, getEmptyResult());
}
function getHostname(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 0 /* FLAG.HOSTNAME */, suffixLookup, options, RESULT).hostname;
}
function getPublicSuffix(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 2 /* FLAG.PUBLIC_SUFFIX */, suffixLookup, options, RESULT)
        .publicSuffix;
}
function getDomain(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 3 /* FLAG.DOMAIN */, suffixLookup, options, RESULT).domain;
}
function getSubdomain(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 4 /* FLAG.SUB_DOMAIN */, suffixLookup, options, RESULT)
        .subdomain;
}
function getDomainWithoutSuffix(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 5 /* FLAG.ALL */, suffixLookup, options, RESULT)
        .domainWithoutSuffix;
}

exports.getDomain = getDomain;
exports.getDomainWithoutSuffix = getDomainWithoutSuffix;
exports.getHostname = getHostname;
exports.getPublicSuffix = getPublicSuffix;
exports.getSubdomain = getSubdomain;
exports.parse = parse;
//# sourceMappingURL=index.js.map
