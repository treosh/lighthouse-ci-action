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
exports.createImportSymbol = createImportSymbol;
/**
 * Create a new import symbol.
 */
function createImportSymbol(name, from, typeOnly) {
    return {
        kind: "es_symbol",
        name,
        from,
        typeOnly: typeOnly !== null && typeOnly !== void 0 ? typeOnly : false,
        id: `import("${from}").${name}`,
        toTypeOnly() {
            return Object.assign(Object.assign({}, this), { typeOnly: true });
        },
    };
}
