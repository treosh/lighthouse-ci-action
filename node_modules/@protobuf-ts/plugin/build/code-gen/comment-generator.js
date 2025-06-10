"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentGenerator = void 0;
const ts = require("typescript");
const protoplugin_1 = require("@bufbuild/protoplugin");
const typescript_comments_1 = require("../framework/typescript-comments");
class CommentGenerator {
    constructor() {
    }
    /**
     * Adds comments from the .proto as a JSDoc block.
     *
     * Looks up comments for the given descriptor in
     * the source code info.
     *
     * Adds `@deprecated` tag if the element is
     * marked deprecated. Also adds @deprecated if
     * the descriptor is a type (enum, message) and
     * the entire .proto file is marked deprecated.
     *
     * Adds `@generated` tag with source code
     * information.
     *
     * Leading detached comments are added as line
     * comments in front of the JSDoc block.
     *
     * Trailing comments are a bit weird. For .proto
     * enums and messages, they sit between open
     * bracket and first member. A message seems to
     * only ever have a trailing comment if it is
     * empty. For a simple solution, trailing
     * comments on enums and messages should simply
     * be appended to the leading block so that the
     * information is not discarded.
     */
    addCommentsForDescriptor(node, descriptor, trailingCommentsMode) {
        if (descriptor.kind == "file") {
            return;
        }
        const source = this.getComments(descriptor);
        // add leading detached comments as line comments
        typescript_comments_1.addCommentBlocksAsLeadingDetachedLines(node, ...source.leadingDetached);
        // start with leading block
        let leading = this.getCommentBlock(descriptor, trailingCommentsMode === "appendToLeadingBlock");
        // add leading block as jsdoc comment block
        typescript_comments_1.addCommentBlockAsJsDoc(node, leading);
        // add trailing comments as trailing line comments
        if (source.trailing && trailingCommentsMode === 'trailingLines') {
            let lines = source.trailing.split('\n').map(l => l[0] !== ' ' ? ` ${l}` : l);
            for (let line of lines) {
                ts.addSyntheticTrailingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, line, true);
            }
        }
    }
    getComments(desc) {
        if (desc.kind == "file") {
            return {
                leadingDetached: [],
            };
        }
        const comments = protoplugin_1.getComments(desc);
        return {
            leading: comments.leading !== undefined ? this.stripTrailingNewlines(comments.leading) : comments.leading,
            trailing: comments.trailing !== undefined ? this.stripTrailingNewlines(comments.trailing) : comments.trailing,
            leadingDetached: comments.leadingDetached.map(t => this.stripTrailingNewlines(t)),
        };
    }
    stripTrailingNewlines(block) {
        return block.endsWith('\n')
            ? block.slice(0, -1)
            : block;
    }
    /**
     * Returns a block of source comments (no leading detached!),
     * with @generated tags and @deprecated tag (if applicable).
     */
    getCommentBlock(descriptor, appendTrailingComments = false) {
        var _a;
        if (descriptor.kind == "file") {
            return "";
        }
        const source = this.getComments(descriptor);
        // start with leading block
        let commentBlock = (_a = source.leading) !== null && _a !== void 0 ? _a : '';
        // add trailing comments to the leading block
        if (source.trailing && appendTrailingComments) {
            if (commentBlock.length > 0) {
                commentBlock += '\n\n';
            }
            commentBlock += source.trailing;
        }
        // if there were any leading comments, we need some space
        if (commentBlock.length > 0) {
            commentBlock += '\n\n';
        }
        // add deprecated information to the leading block
        commentBlock += this.makeDeprecatedTag(descriptor);
        // add source info to the leading block
        commentBlock += this.makeGeneratedTag(descriptor);
        return commentBlock;
    }
    /**
     * Creates string like "@generated from protobuf field: string foo = 1;"
     */
    makeGeneratedTag(desc) {
        switch (desc.kind) {
            case "oneof":
                return `@generated from protobuf oneof: ${desc.name}`;
            case "enum_value":
                return `@generated from protobuf enum value: ${protoplugin_1.getDeclarationString(desc)};`;
            case "field":
                return `@generated from protobuf field: ${protoplugin_1.getDeclarationString(desc)}`;
            case "extension":
                return `@generated from protobuf extension: ${protoplugin_1.getDeclarationString(desc)}`;
            case "rpc":
                return `@generated from protobuf rpc: ${desc.name}`;
            case "message":
            case "enum":
            case "service":
            case "file":
                return `@generated from protobuf ${desc.toString()}`;
        }
    }
    /**
     * Returns "@deprecated\n" if explicitly deprecated.
     * For top level types, also returns "@deprecated\n" if entire file is deprecated.
     * Otherwise, returns "".
     */
    makeDeprecatedTag(desc) {
        if (CommentGenerator.isDeprecated(desc)) {
            return '@deprecated\n';
        }
        return '';
    }
    static isDeprecated(desc) {
        if (desc.kind == "file") {
            return false;
        }
        if (desc.deprecated) {
            return true;
        }
        switch (desc.kind) {
            case "enum":
            case "service":
            case "message":
            case "extension":
                return desc.file.deprecated;
            case "field":
            case "rpc":
            case "enum_value":
            case "oneof":
                return desc.parent.file.deprecated;
        }
    }
}
exports.CommentGenerator = CommentGenerator;
