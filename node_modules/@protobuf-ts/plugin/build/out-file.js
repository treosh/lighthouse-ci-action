"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutFile = void 0;
const typescript_file_1 = require("./framework/typescript-file");
const protoplugin_1 = require("@bufbuild/protoplugin");
/**
 * A protobuf-ts output file.
 */
class OutFile extends typescript_file_1.TypescriptFile {
    constructor(name, descFile, options) {
        super(name);
        this.descFile = descFile;
        this.options = options;
    }
    getContent() {
        if (this.isEmpty()) {
            return "";
        }
        return this.getHeader() + super.getContent();
    }
    getHeader() {
        if (this.isEmpty()) {
            return "";
        }
        if (!this.header) {
            this.header = this.makeHeader();
        }
        return this.header;
    }
    makeHeader() {
        let props = [];
        if (this.descFile.proto.package.length > 0) {
            props.push('package "' + this.descFile.proto.package + '"');
        }
        props.push('syntax ' + (this.descFile.proto.syntax.length > 0 ? this.descFile.proto.syntax : 'proto2'));
        const header = [];
        if (this.options.esLintDisable) {
            header.push(`/* eslint-disable */`);
        }
        header.push(...[
            `// @generated ${this.options.pluginCredit}`,
            `// @generated from protobuf file "${this.descFile.proto.name}" (${props.join(', ')})`,
            `// tslint:disable`
        ]);
        if (this.options.tsNoCheck) {
            header.push(`// @ts-nocheck`);
        }
        if (this.descFile.deprecated) {
            header.push('// @deprecated');
        }
        [
            ...protoplugin_1.getSyntaxComments(this.descFile).leadingDetached,
            ...protoplugin_1.getPackageComments(this.descFile).leadingDetached
        ].map(block => block.endsWith("\n") ? block.substring(0, block.length - 1) : block)
            .every(block => header.push('//', ...block.split('\n').map(l => '//' + l), '//'));
        let head = header.join('\n');
        if (head.length > 0 && !head.endsWith('\n')) {
            head += '\n';
        }
        return head;
    }
}
exports.OutFile = OutFile;
