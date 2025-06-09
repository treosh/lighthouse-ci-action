"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const csp_1 = require("./csp");
const finding_1 = require("./finding");
const parser_1 = require("./parser");
describe('Test Csp', () => {
    it('ConvertToString', () => {
        const testCsp = 'default-src \'none\'; ' +
            'script-src \'nonce-unsafefoobar\' \'unsafe-eval\' \'unsafe-inline\' ' +
            'https://example.com/foo.js foo.bar; ' +
            'img-src \'self\' https: data: blob:; ';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.convertToString()).toBe(testCsp);
    });
    it('GetEffectiveCspVersion1', () => {
        const testCsp = 'default-src \'unsafe-inline\' \'strict-dynamic\' \'nonce-123\' ' +
            '\'sha256-foobar\' \'self\'; report-to foo.bar; worker-src *; manifest-src *; script-src-attr \'self\'; script-src-elem \'self\'; style-src-attr \'self\'; style-src-elem \'self\';';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const findings = [];
        const effectiveCsp = parsed.getEffectiveCsp(csp_1.Version.CSP1, findings);
        expect(findings.length)
            .toBe(0);
        expect(effectiveCsp.directives[csp_1.Directive.DEFAULT_SRC]).toEqual([
            '\'unsafe-inline\'', '\'self\''
        ]);
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.REPORT_TO))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.WORKER_SRC))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.MANIFEST_SRC))
            .toBeFalse();
    });
    it('GetEffectiveCspVersion2', () => {
        const testCsp = 'default-src \'unsafe-inline\' \'strict-dynamic\' \'nonce-123\' ' +
            '\'sha256-foobar\' \'self\'; report-to foo.bar; worker-src *; manifest-src *; script-src-attr \'self\'; script-src-elem \'self\'; style-src-attr \'self\'; style-src-elem \'self\';';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const findings = [];
        const effectiveCsp = parsed.getEffectiveCsp(csp_1.Version.CSP2, findings);
        expect(findings.length).toBe(1);
        expect(findings[0].value).toBe('\'unsafe-inline\'');
        expect(findings[0].type).toBe(finding_1.Type.IGNORED);
        expect(findings[0].severity).toBe(finding_1.Severity.NONE);
        expect(findings[0].directive).toBe(csp_1.Directive.DEFAULT_SRC);
        expect(effectiveCsp.directives[csp_1.Directive.DEFAULT_SRC]).toEqual([
            '\'nonce-123\'', '\'sha256-foobar\'', '\'self\''
        ]);
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.REPORT_TO))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.WORKER_SRC))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.MANIFEST_SRC))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.SCRIPT_SRC_ATTR))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.SCRIPT_SRC_ELEM))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.STYLE_SRC_ATTR))
            .toBeFalse();
        expect(effectiveCsp.directives.hasOwnProperty(csp_1.Directive.STYLE_SRC_ELEM))
            .toBeFalse();
    });
    it('GetEffectiveCspVersion3', () => {
        const testCsp = 'default-src \'unsafe-inline\' \'strict-dynamic\' \'nonce-123\' ' +
            '\'sha256-foobar\' \'self\'; report-to foo.bar; worker-src *; manifest-src *; script-src-attr \'self\'; script-src-elem \'self\'; style-src-attr \'self\'; style-src-elem \'self\';';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const findings = [];
        const effectiveCsp = parsed.getEffectiveCsp(csp_1.Version.CSP3, findings);
        expect(findings.length).toBe(3);
        expect(findings.every(f => f.type === finding_1.Type.IGNORED)).toBeTrue();
        expect(findings.every(f => f.severity === finding_1.Severity.NONE)).toBeTrue();
        expect(findings.every(f => f.directive === csp_1.Directive.DEFAULT_SRC))
            .toBeTrue();
        expect(effectiveCsp.directives[csp_1.Directive.DEFAULT_SRC]).toEqual([
            '\'strict-dynamic\'', '\'nonce-123\'', '\'sha256-foobar\''
        ]);
        expect(effectiveCsp.directives[csp_1.Directive.REPORT_TO]).toEqual(['foo.bar']);
        expect(effectiveCsp.directives[csp_1.Directive.WORKER_SRC]).toEqual(['*']);
        expect(effectiveCsp.directives[csp_1.Directive.MANIFEST_SRC]).toEqual(['*']);
        expect(effectiveCsp.directives[csp_1.Directive.SCRIPT_SRC_ATTR]).toEqual([
            '\'self\''
        ]);
        expect(effectiveCsp.directives[csp_1.Directive.SCRIPT_SRC_ELEM]).toEqual([
            '\'self\''
        ]);
        expect(effectiveCsp.directives[csp_1.Directive.STYLE_SRC_ATTR]).toEqual([
            '\'self\''
        ]);
        expect(effectiveCsp.directives[csp_1.Directive.STYLE_SRC_ELEM]).toEqual([
            '\'self\''
        ]);
    });
    it('GetEffectiveDirective', () => {
        const testCsp = 'default-src https:; script-src foo.bar';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const script = parsed.getEffectiveDirective(csp_1.Directive.SCRIPT_SRC);
        expect(script).toBe(csp_1.Directive.SCRIPT_SRC);
        const style = parsed.getEffectiveDirective(csp_1.Directive.STYLE_SRC);
        expect(style).toBe(csp_1.Directive.DEFAULT_SRC);
    });
    it('GetEffectiveDirectives', () => {
        const testCsp = 'default-src https:; script-src foo.bar';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const directives = parsed.getEffectiveDirectives([csp_1.Directive.SCRIPT_SRC, csp_1.Directive.STYLE_SRC]);
        expect(directives).toEqual([csp_1.Directive.SCRIPT_SRC, csp_1.Directive.DEFAULT_SRC]);
    });
    it('GetEffectiveDirectives', () => {
        const testCsp = 'default-src https:; style-src-elem foo.bar';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const directives = parsed.getEffectiveDirectives([
            csp_1.Directive.STYLE_SRC, csp_1.Directive.STYLE_SRC_ATTR, csp_1.Directive.STYLE_SRC_ELEM
        ]);
        expect(directives).toEqual([
            csp_1.Directive.DEFAULT_SRC, csp_1.Directive.STYLE_SRC_ELEM
        ]);
    });
    it('GetEffectiveDirectives', () => {
        const testCsp = 'default-src https:; script-src foo.bar; script-src-elem bar.baz; style-src foo.bar; style-src-elem bar.baz';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        const directives = parsed.getEffectiveDirectives([
            csp_1.Directive.SCRIPT_SRC, csp_1.Directive.STYLE_SRC, csp_1.Directive.SCRIPT_SRC_ATTR,
            csp_1.Directive.SCRIPT_SRC_ELEM, csp_1.Directive.STYLE_SRC_ATTR,
            csp_1.Directive.STYLE_SRC_ELEM
        ]);
        expect(directives).toEqual([
            csp_1.Directive.SCRIPT_SRC,
            csp_1.Directive.STYLE_SRC,
            csp_1.Directive.SCRIPT_SRC_ELEM,
            csp_1.Directive.STYLE_SRC_ELEM,
        ]);
    });
    it('PolicyHasScriptNoncesScriptSrcWithNonce', () => {
        const testCsp = 'default-src https:; script-src \'nonce-test123\'';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasScriptNonces()).toBeTrue();
    });
    it('PolicyHasScriptNoncesNoNonce', () => {
        const testCsp = 'default-src https: \'nonce-ignored\'; script-src nonce-invalid';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasScriptNonces()).toBeFalse();
    });
    it('PolicyHasScriptHashesScriptSrcWithHash', () => {
        const testCsp = 'default-src https:; script-src \'sha256-asdfASDF\'';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasScriptHashes()).toBeTrue();
    });
    it('PolicyHasScriptHashesNoHash', () => {
        const testCsp = 'default-src https: \'nonce-ignored\'; script-src sha256-invalid';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasScriptHashes()).toBeFalse();
    });
    it('PolicyHasStrictDynamicScriptSrcWithStrictDynamic', () => {
        const testCsp = 'default-src https:; script-src \'strict-dynamic\'';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasStrictDynamic()).toBeTrue();
    });
    it('PolicyHasStrictDynamicDefaultSrcWithStrictDynamic', () => {
        const testCsp = 'default-src https \'strict-dynamic\'';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasStrictDynamic()).toBeTrue();
    });
    it('PolicyHasStrictDynamicNoStrictDynamic', () => {
        const testCsp = 'default-src \'strict-dynamic\'; script-src foo.bar';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasStrictDynamic()).toBeFalse();
    });
    it('IsDirective', () => {
        const directives = Object.keys(csp_1.Directive).map((name) => csp_1.Directive[name]);
        expect(directives.every(csp_1.isDirective)).toBeTrue();
        expect(csp_1.isDirective('invalid-src')).toBeFalse();
    });
    it('IsKeyword', () => {
        const keywords = Object.keys(csp_1.Keyword).map((name) => (csp_1.Keyword[name]));
        expect(keywords.every(csp_1.isKeyword)).toBeTrue();
        expect(csp_1.isKeyword('invalid')).toBeFalse();
    });
    it('IsUrlScheme', () => {
        expect(csp_1.isUrlScheme('http:')).toBeTrue();
        expect(csp_1.isUrlScheme('https:')).toBeTrue();
        expect(csp_1.isUrlScheme('data:')).toBeTrue();
        expect(csp_1.isUrlScheme('blob:')).toBeTrue();
        expect(csp_1.isUrlScheme('b+l.o-b:')).toBeTrue();
        expect(csp_1.isUrlScheme('filesystem:')).toBeTrue();
        expect(csp_1.isUrlScheme('invalid')).toBeFalse();
        expect(csp_1.isUrlScheme('ht_tp:')).toBeFalse();
    });
    it('IsNonce', () => {
        expect(csp_1.isNonce('\'nonce-asdfASDF=\'')).toBeTrue();
        expect(csp_1.isNonce('\'sha256-asdfASDF=\'')).toBeFalse();
        expect(csp_1.isNonce('\'asdfASDF=\'')).toBeFalse();
        expect(csp_1.isNonce('example.com')).toBeFalse();
    });
    it('IsStrictNonce', () => {
        expect(csp_1.isNonce('\'nonce-asdfASDF=\'', true)).toBeTrue();
        expect(csp_1.isNonce('\'nonce-as+df/A0234SDF==\'', true)).toBeTrue();
        expect(csp_1.isNonce('\'nonce-as_dfASDF=\'', true)).toBeTrue();
        expect(csp_1.isNonce('\'nonce-asdfASDF===\'', true)).toBeFalse();
        expect(csp_1.isNonce('\'sha256-asdfASDF=\'', true)).toBeFalse();
    });
    it('IsHash', () => {
        expect(csp_1.isHash('\'sha256-asdfASDF=\'')).toBeTrue();
        expect(csp_1.isHash('\'sha777-asdfASDF=\'')).toBeFalse();
        expect(csp_1.isHash('\'asdfASDF=\'')).toBeFalse();
        expect(csp_1.isHash('example.com')).toBeFalse();
    });
    it('IsStrictHash', () => {
        expect(csp_1.isHash('\'sha256-asdfASDF=\'', true)).toBeTrue();
        expect(csp_1.isHash('\'sha256-as+d/f/ASD0+4F==\'', true)).toBeTrue();
        expect(csp_1.isHash('\'sha256-asdfASDF===\'', true)).toBeFalse();
        expect(csp_1.isHash('\'sha256-asd_fASDF=\'', true)).toBeFalse();
        expect(csp_1.isHash('\'sha777-asdfASDF=\'', true)).toBeFalse();
        expect(csp_1.isHash('\'asdfASDF=\'', true)).toBeFalse();
        expect(csp_1.isHash('example.com', true)).toBeFalse();
    });
    it('ParseNavigateTo', () => {
        const testCsp = 'navigate-to \'self\'; script-src \'nonce-foo\'';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasStrictDynamic()).toBeFalse();
        expect(parsed.policyHasScriptNonces()).toBeTrue();
    });
    it('ParseWebRtc', () => {
        const testCsp = 'web-rtc \'allow\'; script-src \'nonce-foo\'';
        const parsed = (new parser_1.CspParser(testCsp)).csp;
        expect(parsed.policyHasStrictDynamic()).toBeFalse();
        expect(parsed.policyHasScriptNonces()).toBeTrue();
    });
});
//# sourceMappingURL=csp_test.js.map