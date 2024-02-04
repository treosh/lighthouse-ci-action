import { fastPathLookup, } from 'tldts-core';
import { exceptions, rules } from './data/trie';
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
export default function suffixLookup(hostname, options, out) {
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
//# sourceMappingURL=suffix-trie.js.map