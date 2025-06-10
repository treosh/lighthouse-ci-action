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
exports.safeIdentifier = exports.createImportSymbol = exports.getSyntaxComments = exports.getPackageComments = exports.getDeclarationString = exports.getComments = exports.createEcmaScriptPlugin = exports.runNodeJs = void 0;
var run_node_js_1 = require("./run-node.js");
Object.defineProperty(exports, "runNodeJs", { enumerable: true, get: function () { return run_node_js_1.runNodeJs; } });
var create_es_plugin_js_1 = require("./create-es-plugin.js");
Object.defineProperty(exports, "createEcmaScriptPlugin", { enumerable: true, get: function () { return create_es_plugin_js_1.createEcmaScriptPlugin; } });
var source_code_info_js_1 = require("./source-code-info.js");
Object.defineProperty(exports, "getComments", { enumerable: true, get: function () { return source_code_info_js_1.getComments; } });
Object.defineProperty(exports, "getDeclarationString", { enumerable: true, get: function () { return source_code_info_js_1.getDeclarationString; } });
Object.defineProperty(exports, "getPackageComments", { enumerable: true, get: function () { return source_code_info_js_1.getPackageComments; } });
Object.defineProperty(exports, "getSyntaxComments", { enumerable: true, get: function () { return source_code_info_js_1.getSyntaxComments; } });
var import_symbol_js_1 = require("./import-symbol.js");
Object.defineProperty(exports, "createImportSymbol", { enumerable: true, get: function () { return import_symbol_js_1.createImportSymbol; } });
var safe_identifier_js_1 = require("./safe-identifier.js");
Object.defineProperty(exports, "safeIdentifier", { enumerable: true, get: function () { return safe_identifier_js_1.safeIdentifier; } });
