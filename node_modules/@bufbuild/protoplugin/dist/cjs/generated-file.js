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
exports.createGeneratedFile = createGeneratedFile;
const protobuf_1 = require("@bufbuild/protobuf");
const import_symbol_js_1 = require("./import-symbol.js");
const import_path_js_1 = require("./import-path.js");
const jsdoc_js_1 = require("./jsdoc.js");
function createGeneratedFile(name, importPath, jsImportStyle, rewriteImport, resolveDescImport, resolveShapeImport, resolveJsonImport, resolveValidImport, createPreamble, runtime) {
    let preamble;
    const el = [];
    return {
        preamble(file) {
            preamble = createPreamble(file);
        },
        print(printableOrFragments, ...rest) {
            let printables;
            if (printableOrFragments != null &&
                Object.prototype.hasOwnProperty.call(printableOrFragments, "raw")) {
                // If called with a tagged template literal
                printables = buildPrintablesFromFragments(printableOrFragments, rest);
            }
            else {
                // If called with just an array of Printables
                printables =
                    printableOrFragments != null
                        ? [printableOrFragments, ...rest]
                        : rest;
            }
            printableToEl({
                el,
                runtime,
                resolveDescImport,
                resolveShapeImport,
                resolveJsonImport,
                resolveValidImport,
            }, printables);
            el.push("\n");
        },
        export(declaration, name) {
            return {
                kind: "es_export_stmt",
                name,
                declaration,
            };
        },
        string(string) {
            return {
                kind: "es_string",
                value: string,
            };
        },
        array(elements) {
            const p = [];
            p.push("[");
            for (const [index, element] of elements.entries()) {
                p.push(element);
                if (index < elements.length - 1) {
                    p.push(", ");
                }
            }
            p.push("]");
            return p;
        },
        jsDoc(textOrSchema, indentation) {
            return {
                kind: "es_jsdoc",
                text: typeof textOrSchema == "string"
                    ? textOrSchema
                    : (0, jsdoc_js_1.createJsDocTextFromDesc)(textOrSchema),
                indentation,
            };
        },
        importSchema(schema, typeOnly = false) {
            return resolveDescImport(schema, typeOnly);
        },
        importShape(schema) {
            return resolveShapeImport(schema);
        },
        importJson(desc) {
            return resolveJsonImport(desc);
        },
        importValid(desc) {
            return resolveValidImport(desc);
        },
        import(name, from, typeOnly = false) {
            return (0, import_symbol_js_1.createImportSymbol)(name, from, typeOnly);
        },
        jsImportStyle,
        runtime,
        getFileInfo() {
            return {
                name,
                content: elToContent(el, importPath, rewriteImport, jsImportStyle == "legacy_commonjs"),
                preamble,
            };
        },
    };
}
function elToContent(el, importerPath, rewriteImportPath, legacyCommonJs) {
    if (el.length == 0) {
        return "";
    }
    const c = [];
    if (legacyCommonJs) {
        c.push(`"use strict";\n`);
        c.push(`Object.defineProperty(exports, "__esModule", { value: true });\n`);
        c.push("\n");
    }
    const symbolToIdentifier = processImports(el, importerPath, rewriteImportPath, (typeOnly, from, names) => {
        if (legacyCommonJs) {
            const p = names.map(({ name, alias }) => alias == undefined ? name : `${name}: ${alias}`);
            const what = `{ ${p.join(", ")} }`;
            c.push(`const ${what} = require(${escapeString(from)});\n`);
        }
        else {
            const p = names.map(({ name, alias }) => alias == undefined ? name : `${name} as ${alias}`);
            const what = `{ ${p.join(", ")} }`;
            if (typeOnly) {
                c.push(`import type ${what} from ${escapeString(from)};\n`);
            }
            else {
                c.push(`import ${what} from ${escapeString(from)};\n`);
            }
        }
    });
    if (c.length > 0) {
        c.push("\n");
    }
    const legacyCommonJsExportNames = [];
    for (const e of el) {
        if (typeof e == "string") {
            c.push(e);
        }
        else {
            switch (e.kind) {
                case "es_symbol": {
                    const ident = symbolToIdentifier.get(e.id);
                    if (ident != undefined) {
                        c.push(ident);
                    }
                    break;
                }
                case "es_export_stmt":
                    if (legacyCommonJs) {
                        legacyCommonJsExportNames.push(e.name);
                    }
                    else {
                        c.push("export ");
                    }
                    if (e.declaration !== undefined && e.declaration.length > 0) {
                        c.push(e.declaration, " ");
                    }
                    c.push(e.name);
                    break;
            }
        }
    }
    if (legacyCommonJs) {
        if (legacyCommonJsExportNames.length > 0) {
            c.push("\n");
        }
        for (const name of legacyCommonJsExportNames) {
            c.push("exports.", name, " = ", name, ";\n");
        }
    }
    return c.join("");
}
function printableToEl(opt, printables) {
    const { el } = opt;
    for (const p of printables) {
        if (Array.isArray(p)) {
            printableToEl(opt, p);
        }
        else {
            switch (typeof p) {
                case "string":
                    el.push(p);
                    break;
                case "number":
                    if (Number.isNaN(p)) {
                        el.push("globalThis.NaN");
                    }
                    else if (p === Number.POSITIVE_INFINITY) {
                        el.push("globalThis.Infinity");
                    }
                    else if (p === Number.NEGATIVE_INFINITY) {
                        el.push("-globalThis.Infinity");
                    }
                    else {
                        el.push(p.toString(10));
                    }
                    break;
                case "boolean":
                    el.push(p.toString());
                    break;
                case "bigint":
                    if (p == protobuf_1.protoInt64.zero) {
                        // Loose comparison will match between 0n and 0.
                        el.push(opt.runtime.protoInt64, ".zero");
                    }
                    else {
                        el.push(opt.runtime.protoInt64, p > 0 ? ".uParse(" : ".parse(", escapeString(p.toString()), ")");
                    }
                    break;
                case "object":
                    if (p instanceof Uint8Array) {
                        if (p.length === 0) {
                            el.push("new Uint8Array(0)");
                        }
                        else {
                            el.push("new Uint8Array([");
                            const strings = [];
                            for (const n of p) {
                                strings.push("0x" + n.toString(16).toUpperCase().padStart(2, "0"));
                            }
                            el.push(strings.join(", "));
                            el.push("])");
                        }
                        break;
                    }
                    switch (p.kind) {
                        case "es_symbol":
                        case "es_export_stmt":
                            el.push(p);
                            break;
                        case "es_desc_ref":
                            el.push(opt.resolveDescImport(p.desc, p.typeOnly));
                            break;
                        case "es_shape_ref":
                            el.push(opt.resolveShapeImport(p.desc));
                            break;
                        case "es_json_type_ref":
                            el.push(opt.resolveJsonImport(p.desc));
                            break;
                        case "es_valid_type_ref":
                            el.push(opt.resolveValidImport(p.desc));
                            break;
                        case "es_jsdoc":
                            el.push((0, jsdoc_js_1.formatJsDocBlock)(p.text, p.indentation));
                            break;
                        case "es_string":
                            el.push(escapeString(p.value));
                            break;
                        case "es_proto_int64":
                            if (p.longAsString) {
                                el.push(escapeString(p.value.toString()));
                            }
                            else {
                                if (p.value == protobuf_1.protoInt64.zero) {
                                    // Loose comparison will match between 0n and 0.
                                    el.push(opt.runtime.protoInt64, ".zero");
                                }
                                else {
                                    switch (p.type) {
                                        case protobuf_1.ScalarType.UINT64:
                                        case protobuf_1.ScalarType.FIXED64:
                                            el.push(opt.runtime.protoInt64, ".uParse(", escapeString(p.value.toString()), ")");
                                            break;
                                        default:
                                            el.push(opt.runtime.protoInt64, ".parse(", escapeString(p.value.toString()), ")");
                                            break;
                                    }
                                }
                            }
                            break;
                        default:
                            throw `cannot print ${typeof p}`;
                    }
                    break;
                default:
                    throw `cannot print ${typeof p}`;
            }
        }
    }
}
function buildPrintablesFromFragments(fragments, values) {
    const printables = [];
    fragments.forEach((fragment, i) => {
        printables.push(fragment);
        if (fragments.length - 1 !== i) {
            printables.push(values[i]);
        }
    });
    return printables;
}
function processImports(el, importerPath, rewriteImportPath, makeImportStatement) {
    // identifiers to use in the output
    const symbolToIdentifier = new Map();
    // symbols that need a value import (as opposed to a type-only import)
    const symbolToIsValue = new Map();
    // taken in this file
    const identifiersTaken = new Set();
    // foreign symbols need an import
    const foreignSymbols = [];
    // Walk through all symbols used and populate the collections above.
    for (const s of el) {
        if (typeof s != "object") {
            continue;
        }
        switch (s.kind) {
            case "es_symbol":
                symbolToIdentifier.set(s.id, s.name);
                if (!s.typeOnly) {
                    // a symbol is only type-imported as long as all uses are type-only
                    symbolToIsValue.set(s.id, true);
                }
                if (s.from === importerPath) {
                    identifiersTaken.add(s.name);
                }
                else {
                    foreignSymbols.push(s);
                }
                break;
            case "es_export_stmt":
                identifiersTaken.add(s.name);
                break;
        }
    }
    // Walk through all foreign symbols and make their identifiers unique.
    const handledSymbols = new Set();
    for (const s of foreignSymbols) {
        if (handledSymbols.has(s.id)) {
            continue;
        }
        handledSymbols.add(s.id);
        if (!identifiersTaken.has(s.name)) {
            identifiersTaken.add(s.name);
            continue;
        }
        let i = 1;
        let alias;
        for (;;) {
            // We choose '$' because it is invalid in proto identifiers.
            alias = `${s.name}$${i}`;
            if (!identifiersTaken.has(alias)) {
                break;
            }
            i++;
        }
        identifiersTaken.add(alias);
        symbolToIdentifier.set(s.id, alias);
    }
    const sourceToImport = new Map();
    for (const s of foreignSymbols) {
        let i = sourceToImport.get(s.from);
        if (i == undefined) {
            i = {
                types: new Map(),
                values: new Map(),
            };
            sourceToImport.set(s.from, i);
        }
        let alias = symbolToIdentifier.get(s.id);
        if (alias == s.name) {
            alias = undefined;
        }
        if (symbolToIsValue.get(s.id)) {
            i.values.set(s.name, alias);
        }
        else {
            i.types.set(s.name, alias);
        }
    }
    // Make import statements.
    const handledSource = new Set();
    const buildNames = (map) => {
        const names = [];
        map.forEach((value, key) => names.push({ name: key, alias: value }));
        names.sort((a, b) => a.name.localeCompare(b.name));
        return names;
    };
    for (const s of foreignSymbols) {
        if (handledSource.has(s.from)) {
            continue;
        }
        handledSource.add(s.from);
        const i = sourceToImport.get(s.from);
        if (i == undefined) {
            // should never happen
            continue;
        }
        const from = (0, import_path_js_1.makeImportPathRelative)(importerPath, rewriteImportPath(s.from));
        if (i.types.size > 0) {
            makeImportStatement(true, from, buildNames(i.types));
        }
        if (i.values.size > 0) {
            makeImportStatement(false, from, buildNames(i.values));
        }
    }
    return symbolToIdentifier;
}
function escapeString(value) {
    return ('"' +
        value
            .split("\\")
            .join("\\\\")
            .split('"')
            .join('\\"')
            .split("\r")
            .join("\\r")
            .split("\n")
            .join("\\n") +
        '"');
}
