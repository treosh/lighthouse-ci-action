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
exports.createRuntimeImports = createRuntimeImports;
const import_symbol_js_1 = require("./import-symbol.js");
const codegenv2_1 = require("@bufbuild/protobuf/codegenv2");
function createRuntimeImports(bootstrapWkt) {
    return mapRecord(codegenv2_1.symbols, bootstrapWkt);
}
function mapRecord(record, bootstrapWkt) {
    const result = Object.create(null);
    for (const [key, value] of Object.entries(record)) {
        if (isSymbolInfo(value)) {
            result[key] = (0, import_symbol_js_1.createImportSymbol)(key, bootstrapWkt ? value.bootstrapWktFrom : value.from, value.typeOnly);
        }
        else {
            result[key] = mapRecord(record[key], bootstrapWkt);
        }
    }
    return result;
}
function isSymbolInfo(arg) {
    if (typeof arg != "object" || arg === null) {
        return false;
    }
    const wantNames = [
        "typeOnly",
        "from",
        "bootstrapWktFrom",
    ];
    const gotNames = Object.getOwnPropertyNames(arg);
    if (gotNames.length !== wantNames.length) {
        return false;
    }
    return wantNames.every((w) => gotNames.includes(w));
}
