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
exports.createJsDocTextFromDesc = createJsDocTextFromDesc;
exports.formatJsDocBlock = formatJsDocBlock;
const source_code_info_js_1 = require("./source-code-info.js");
const reflect_1 = require("@bufbuild/protobuf/reflect");
function createJsDocTextFromDesc(desc) {
    const comments = (0, source_code_info_js_1.getComments)(desc);
    let text = "";
    if (comments.leading !== undefined) {
        text += comments.leading;
        if (text.endsWith("\n")) {
            text = text.substring(0, text.length - 1);
        }
    }
    if (comments.trailing !== undefined) {
        if (text.length > 0) {
            text += "\n\n";
        }
        text += comments.trailing;
        if (text.endsWith("\n")) {
            text = text.substring(0, text.length - 1);
        }
    }
    if (text.length > 0) {
        text += "\n\n";
    }
    text = text
        .split("\n")
        .map((line) => (line.startsWith(" ") ? line.substring(1) : line))
        .join("\n");
    switch (desc.kind) {
        case "enum_value":
            text += `@generated from enum value: ${(0, source_code_info_js_1.getDeclarationString)(desc)};`;
            break;
        case "field":
            text += `@generated from field: ${(0, source_code_info_js_1.getDeclarationString)(desc)};`;
            break;
        case "extension":
            text += `@generated from extension: ${(0, source_code_info_js_1.getDeclarationString)(desc)};`;
            break;
        case "message":
        case "enum": {
            text += `@generated from ${desc.toString()}`;
            const featureOptions = (0, source_code_info_js_1.getFeatureOptionStrings)(desc);
            if (featureOptions.length > 0) {
                text += `\n@generated with ${featureOptions.length > 1 ? "options" : "option"} ${featureOptions.join(", ")}`;
            }
            break;
        }
        default:
            text += `@generated from ${desc.toString()}`;
            break;
    }
    let deprecated;
    switch (desc.kind) {
        case "field":
        case "enum_value":
        case "rpc":
            deprecated = desc.deprecated;
            break;
        default:
            deprecated =
                desc.deprecated || (0, reflect_1.parentTypes)(desc).some((d) => d.deprecated);
            break;
    }
    if (deprecated) {
        text += "\n@deprecated";
    }
    return text;
}
function formatJsDocBlock(text, indentation) {
    if (text.trim().length == 0) {
        return "";
    }
    let lines = text.split("\n");
    if (lines.length === 0) {
        return "";
    }
    lines = lines.map((l) => l.split("*/").join("*\\/"));
    lines = lines.map((l) => (l.length > 0 ? " " + l : l));
    const i = indentation !== null && indentation !== void 0 ? indentation : "";
    return [`${i}/**\n`, ...lines.map((l) => `${i} *${l}\n`), `${i} */`].join("");
}
