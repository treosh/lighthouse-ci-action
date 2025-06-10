"use strict";
// Copyright 2021-2025 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpile = transpile;
const typescript_1 = __importDefault(require("typescript"));
const vfs_1 = require("@typescript/vfs");
/**
 * Create a transpiler using the given compiler options, which will compile the
 * content provided in the files array.
 *
 * Note:  this library intentionally transpiles with a pinned older version of
 * TypeScript for stability.  This version is denoted in this workspace's
 * package.json.  For the default set of compiler options, we use a lenient
 * set of options because the general goal is to emit code as best as we can.
 * For a list of the options used, see `const defaultOptions` in function transpile.
 *
 * If this is not desirable for plugin authors, they are free to provide their
 * own transpile function as part of the plugin initialization.  If one is
 * provided, it will be invoked instead and the framework's auto-transpilation
 * will be bypassed.
 *
 * In addition, note that there is a dependency on @typescript/vfs in the
 * top-level package as well as this package.  This is to avoid npm hoisting
 * @typescript/vfs to the top-level node_modules directory, which then causes
 * type mismatches when trying to use it with this package's version of
 * TypeScript.  Ideally we would use something like Yarn's nohoist here, but
 * npm does not support that yet.
 */
function createTranspiler(options, files) {
    const fsMap = (0, vfs_1.createDefaultMapFromNodeModules)({
        target: options.target,
    });
    for (const file of files) {
        fsMap.set(file.name, file.content);
    }
    const system = (0, vfs_1.createSystem)(fsMap);
    const host = (0, vfs_1.createVirtualCompilerHost)(system, options, typescript_1.default);
    return typescript_1.default.createProgram({
        rootNames: [...fsMap.keys()],
        options,
        host: host.compilerHost,
    });
}
function transpile(files, transpileJs, transpileDts, jsImportStyle) {
    const defaultOptions = {
        // Type checking
        strict: false,
        // modules
        module: typescript_1.default.ModuleKind.ES2020,
        moduleResolution: typescript_1.default.ModuleResolutionKind.Node10,
        noResolve: true,
        resolveJsonModule: false,
        // emit
        emitBOM: false,
        importsNotUsedAsValues: typescript_1.default.ImportsNotUsedAsValues.Preserve,
        newLine: typescript_1.default.NewLineKind.LineFeed,
        preserveValueImports: false,
        // JavaScript Support
        allowJs: true,
        checkJs: false,
        // Language and Environment
        lib: [],
        moduleDetection: typescript_1.default.ModuleDetectionKind.Force,
        target: typescript_1.default.ScriptTarget.ES2017,
        // Completeness
        skipLibCheck: true,
        skipDefaultLibCheck: false,
    };
    const options = Object.assign(Object.assign({}, defaultOptions), { declaration: transpileDts, emitDeclarationOnly: transpileDts && !transpileJs });
    if (jsImportStyle == "legacy_commonjs") {
        options.module = typescript_1.default.ModuleKind.CommonJS;
    }
    // Create the transpiler (a ts.Program object)
    const program = createTranspiler(options, files);
    const results = [];
    let err;
    const result = program.emit(undefined, (fileName, data, _writeByteOrderMark, _onError, sourceFiles) => {
        // We have to go through some hoops here because the header we add to each
        // file is not part of the AST. So we find the TypeScript file we
        // generated for each emitted file and add the header to each output ourselves.
        if (!sourceFiles) {
            err = new Error(`unable to map emitted file "${fileName}" to a source file: missing source files`);
            return;
        }
        if (sourceFiles.length !== 1) {
            err = new Error(`unable to map emitted file "${fileName}" to a source file: expected 1 source file, got ${sourceFiles.length}`);
            return;
        }
        const file = files.find((x) => sourceFiles[0].fileName === x.name);
        if (!file) {
            err = new Error(`unable to map emitted file "${fileName}" to a source file: not found`);
            return;
        }
        results.push({
            name: fileName,
            preamble: file.preamble,
            content: data,
        });
    });
    if (err) {
        throw err;
    }
    if (result.emitSkipped) {
        // When compilation fails, this error message is printed to stderr.
        const diagnostics = formatDiagnostics(result.diagnostics);
        throw Error(`A problem occurred during transpilation and files were not generated.  Contact the plugin author for support.\n\n${diagnostics}`);
    }
    return results;
}
function formatDiagnostics(diagnostics) {
    const sorted = typescript_1.default.sortAndDeduplicateDiagnostics(diagnostics);
    if (sorted.length == 0) {
        return "";
    }
    const first = sorted.slice(0, 3);
    const formatHost = {
        getCanonicalFileName(fileName) {
            return fileName;
        },
        getCurrentDirectory() {
            return ".";
        },
        getNewLine() {
            return "\n";
        },
    };
    let out = typescript_1.default.formatDiagnostics(first, formatHost).trim();
    if (first.length < sorted.length) {
        out += `\n${sorted.length - first.length} more diagnostics elided`;
    }
    return out;
}
