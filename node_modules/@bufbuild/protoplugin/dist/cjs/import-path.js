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
exports.relativePathRE = void 0;
exports.rewriteImportPath = rewriteImportPath;
exports.deriveImportPath = deriveImportPath;
exports.makeImportPathRelative = makeImportPathRelative;
const cache = new WeakMap();
/**
 * Apply import rewrites to the given import path, and change all .js extensions
 * to the given import extension.
 */
function rewriteImportPath(importPath, rewriteImports, importExtension) {
    let ri = cache.get(rewriteImports);
    if (ri === undefined) {
        ri = rewriteImports.map(({ pattern, target }) => {
            return {
                pattern: starToRegExp(pattern),
                target,
            };
        });
        cache.set(rewriteImports, ri);
    }
    for (const { pattern, target } of ri) {
        if (pattern.test(importPath)) {
            if (exports.relativePathRE.test(importPath)) {
                importPath =
                    target.replace(/\/$/, "") + importPath.replace(exports.relativePathRE, "/");
            }
            else {
                importPath = target;
            }
            break;
        }
    }
    if (importPath.endsWith(".js")) {
        switch (importExtension) {
            case "none":
                return importPath.substring(0, importPath.length - 3);
            case "ts":
            case "js":
                return importPath.substring(0, importPath.length - 2) + importExtension;
        }
    }
    return importPath;
}
function starToRegExp(star) {
    const r = ["^"];
    for (let i = 0; i < star.length; i++) {
        switch (star[i]) {
            case "*":
                if (star[i + 1] === "*" && star[i + 2] === "/") {
                    i += 2;
                    r.push("([^\\/]+\\/)*");
                    break;
                }
                r.push("[^\\/]*");
                break;
            case ".":
            case "+":
            case "?":
            case "^":
            case "$":
            case "{":
            case "}":
            case "(":
            case ")":
            case "|":
            case "[":
            case "]":
            case "\\":
                r.push("\\", star[i]);
                break;
            default:
                r.push(star[i]);
                break;
        }
    }
    r.push("$");
    return new RegExp(r.join(""));
}
exports.relativePathRE = /^\.{1,2}\//;
/**
 * Derives an ECMAScript module import path from a file path. For example,
 * the path `foo/bar.ts` is transformed into `./foo/bar.js`.
 */
function deriveImportPath(filename) {
    let importPath = filename.replace(/\.(js|ts|d.ts)$/, ".js");
    if (!exports.relativePathRE.test(importPath)) {
        importPath = "./" + importPath;
    }
    return importPath;
}
/**
 * Makes an import path relative to the file importing it. For example,
 * consider the following files:
 * - foo/foo.js
 * - baz.js
 * If foo.js wants to import baz.js, we return ../baz.js
 */
function makeImportPathRelative(importer, importPath) {
    if (!exports.relativePathRE.test(importPath)) {
        // We don't touch absolute imports, like @bufbuild/protobuf
        return importPath;
    }
    let a = importer
        .replace(/^\.\//, "")
        .split("/")
        .filter((p) => p.length > 0)
        .slice(0, -1);
    let b = importPath
        .replace(/^\.\//, "")
        .split("/")
        .filter((p) => p.length > 0);
    let matchingPartCount = 0;
    for (let l = Math.min(a.length, b.length); matchingPartCount < l; matchingPartCount++) {
        if (a[matchingPartCount] !== b[matchingPartCount]) {
            break;
        }
    }
    a = a.slice(matchingPartCount);
    b = b.slice(matchingPartCount);
    const c = a
        .map(() => "..")
        .concat(b)
        .join("/");
    return exports.relativePathRE.test(c) ? c : "./" + c;
}
