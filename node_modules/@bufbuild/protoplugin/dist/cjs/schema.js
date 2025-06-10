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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = createSchema;
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const reflect_1 = require("@bufbuild/protobuf/reflect");
const generated_file_js_1 = require("./generated-file.js");
const import_symbol_js_1 = require("./import-symbol.js");
const import_path_js_1 = require("./import-path.js");
const file_preamble_js_1 = require("./file-preamble.js");
const names_js_1 = require("./names.js");
const runtime_imports_js_1 = require("./runtime-imports.js");
function createSchema(request, parameter, pluginName, pluginVersion, minimumEdition, maximumEdition) {
    const { allFiles, filesToGenerate } = getFilesToGenerate(request, minimumEdition, maximumEdition);
    let target;
    const generatedFiles = [];
    const runtime = (0, runtime_imports_js_1.createRuntimeImports)(parameter.parsed.bootstrapWkt);
    const resolveDescImport = (desc, typeOnly) => (0, import_symbol_js_1.createImportSymbol)((0, names_js_1.generatedDescName)(desc), (0, names_js_1.generateFilePath)(desc.kind == "file" ? desc : desc.file, parameter.parsed.bootstrapWkt, filesToGenerate), typeOnly);
    const resolveShapeImport = (desc) => (0, import_symbol_js_1.createImportSymbol)((0, names_js_1.generatedShapeName)(desc), (0, names_js_1.generateFilePath)(desc.file, parameter.parsed.bootstrapWkt, filesToGenerate), true);
    const resolveJsonImport = (desc) => (0, import_symbol_js_1.createImportSymbol)((0, names_js_1.generatedJsonTypeName)(desc), (0, names_js_1.generateFilePath)(desc.file, parameter.parsed.bootstrapWkt, filesToGenerate), true);
    const resolveValidImport = (desc) => (0, import_symbol_js_1.createImportSymbol)((0, names_js_1.generatedValidTypeName)(desc), (0, names_js_1.generateFilePath)(desc.file, parameter.parsed.bootstrapWkt, filesToGenerate), true);
    const createPreamble = (descFile) => (0, file_preamble_js_1.makeFilePreamble)(descFile, pluginName, pluginVersion, parameter.sanitized, parameter.parsed.tsNocheck);
    const rewriteImport = (importPath) => (0, import_path_js_1.rewriteImportPath)(importPath, parameter.parsed.rewriteImports, parameter.parsed.importExtension);
    return {
        targets: parameter.parsed.targets,
        proto: request,
        files: filesToGenerate,
        allFiles: allFiles,
        options: parameter.parsed,
        typesInFile: reflect_1.nestedTypes,
        generateFile(name) {
            if (target === undefined) {
                throw new Error("prepareGenerate() must be called before generateFile()");
            }
            const genFile = (0, generated_file_js_1.createGeneratedFile)(name, (0, import_path_js_1.deriveImportPath)(name), target === "js" ? parameter.parsed.jsImportStyle : "module", // ts and dts always use import/export, only js may use commonjs
            rewriteImport, resolveDescImport, resolveShapeImport, resolveJsonImport, resolveValidImport, createPreamble, runtime);
            generatedFiles.push(genFile);
            return genFile;
        },
        getFileInfo() {
            return generatedFiles
                .map((f) => f.getFileInfo())
                .filter((fi) => parameter.parsed.keepEmptyFiles || fi.content.length > 0);
        },
        prepareGenerate(newTarget) {
            target = newTarget;
        },
    };
}
function getFilesToGenerate(request, minimumEdition, maximumEdition) {
    if (minimumEdition > maximumEdition) {
        throw new Error(`configured minimumEdition ${editionToString(minimumEdition)} > maximumEdition ${editionToString(maximumEdition)} - please contact plugin author`);
    }
    const missing = request.fileToGenerate.filter((fileToGenerate) => !request.protoFile.find((f) => f.name === fileToGenerate));
    if (missing.length) {
        throw new Error(`files_to_generate missing in the request: ${missing.join(", ")}`);
    }
    for (const file of request.protoFile) {
        if (request.fileToGenerate.includes(file.name)) {
            let edition;
            switch (file.syntax) {
                case "":
                case "proto2":
                    edition = wkt_1.Edition.EDITION_PROTO2;
                    break;
                case "proto3":
                    edition = wkt_1.Edition.EDITION_PROTO3;
                    break;
                case "editions":
                    edition = file.edition;
                    break;
                default:
                    edition = wkt_1.Edition.EDITION_UNKNOWN;
                    break;
            }
            if (edition < minimumEdition) {
                throw new Error(`${file.name}: unsupported edition ${editionToString(edition)} - the earliest supported edition is ${editionToString(minimumEdition)}`);
            }
            if (edition > maximumEdition) {
                throw new Error(`${file.name}: unsupported edition ${editionToString(edition)} - the latest supported edition is ${editionToString(maximumEdition)}`);
            }
        }
    }
    // Our goal is to provide options with source retention to plugin authors.
    // CodeGeneratorRequest.proto_file elides options with source retention for
    // files to generate. For these files, we take the file from source_file_descriptors,
    // which does include options with source retention.
    const allProtoWithSourceOptions = request.protoFile.map((protoFile) => {
        const sourceFile = request.sourceFileDescriptors.find((s) => s.name == protoFile.name);
        return sourceFile !== null && sourceFile !== void 0 ? sourceFile : protoFile;
    });
    const registry = (0, protobuf_1.createFileRegistry)((0, protobuf_1.create)(wkt_1.FileDescriptorSetSchema, {
        file: allProtoWithSourceOptions,
    }));
    const allFiles = [];
    const filesToGenerate = [];
    for (const file of registry.files) {
        allFiles.push(file);
        if (request.fileToGenerate.includes(file.proto.name)) {
            filesToGenerate.push(file);
        }
    }
    return { allFiles, filesToGenerate };
}
function editionToString(edition) {
    if (edition in wkt_1.Edition) {
        return wkt_1.Edition[edition].replace(/^EDITION_/, "");
    }
    return `unknown (${edition})`;
}
