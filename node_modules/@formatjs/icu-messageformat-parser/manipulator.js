"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoistSelectors = void 0;
var tslib_1 = require("tslib");
var types_1 = require("./types");
function cloneDeep(obj) {
    if (Array.isArray(obj)) {
        // @ts-expect-error meh
        return tslib_1.__spreadArray([], obj.map(cloneDeep), true);
    }
    if (obj !== null && typeof obj === 'object') {
        // @ts-expect-error meh
        return Object.keys(obj).reduce(function (cloned, k) {
            // @ts-expect-error meh
            cloned[k] = cloneDeep(obj[k]);
            return cloned;
        }, {});
    }
    return obj;
}
function hoistPluralOrSelectElement(ast, el, positionToInject) {
    // pull this out of the ast and move it to the top
    var cloned = cloneDeep(el);
    var options = cloned.options;
    cloned.options = Object.keys(options).reduce(function (all, k) {
        var newValue = hoistSelectors(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], ast.slice(0, positionToInject), true), options[k].value, true), ast.slice(positionToInject + 1), true));
        all[k] = {
            value: newValue,
        };
        return all;
    }, {});
    return cloned;
}
function isPluralOrSelectElement(el) {
    return (0, types_1.isPluralElement)(el) || (0, types_1.isSelectElement)(el);
}
function findPluralOrSelectElement(ast) {
    return !!ast.find(function (el) {
        if (isPluralOrSelectElement(el)) {
            return true;
        }
        if ((0, types_1.isTagElement)(el)) {
            return findPluralOrSelectElement(el.children);
        }
        return false;
    });
}
/**
 * Hoist all selectors to the beginning of the AST & flatten the
 * resulting options. E.g:
 * "I have {count, plural, one{a dog} other{many dogs}}"
 * becomes "{count, plural, one{I have a dog} other{I have many dogs}}".
 * If there are multiple selectors, the order of which one is hoisted 1st
 * is non-deterministic.
 * The goal is to provide as many full sentences as possible since fragmented
 * sentences are not translator-friendly
 * @param ast AST
 */
function hoistSelectors(ast) {
    for (var i = 0; i < ast.length; i++) {
        var el = ast[i];
        if (isPluralOrSelectElement(el)) {
            return [hoistPluralOrSelectElement(ast, el, i)];
        }
        if ((0, types_1.isTagElement)(el) && findPluralOrSelectElement([el])) {
            throw new Error('Cannot hoist plural/select within a tag element. Please put the tag element inside each plural/select option');
        }
    }
    return ast;
}
exports.hoistSelectors = hoistSelectors;
