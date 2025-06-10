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
import { create, protoInt64 } from "@bufbuild/protobuf";
import { minimumEdition as minimumEditionUpstream, maximumEdition as maximumEditionUpstream, } from "@bufbuild/protobuf";
import { CodeGeneratorResponse_Feature, CodeGeneratorResponseSchema, } from "@bufbuild/protobuf/wkt";
import { createSchema } from "./schema.js";
import { transpile } from "./transpile.js";
import { parseParameter } from "./parameter.js";
/**
 * Create a new code generator plugin for ECMAScript.
 * The plugin can generate JavaScript, TypeScript, or TypeScript declaration
 * files.
 */
export function createEcmaScriptPlugin(init) {
    let transpileJs = false;
    let transpileDts = false;
    return {
        name: init.name,
        version: init.version,
        run(req) {
            var _a, _b, _c;
            const minimumEdition = (_a = init.minimumEdition) !== null && _a !== void 0 ? _a : minimumEditionUpstream;
            const maximumEdition = (_b = init.maximumEdition) !== null && _b !== void 0 ? _b : maximumEditionUpstream;
            const parameter = parseParameter(req.parameter, init.parseOptions);
            const schema = createSchema(req, parameter, init.name, init.version, minimumEdition, maximumEdition);
            const targetTs = schema.targets.includes("ts");
            const targetJs = schema.targets.includes("js");
            const targetDts = schema.targets.includes("dts");
            // Generate TS files under the following conditions:
            // - if they are explicitly specified as a target.
            // - if js is specified as a target but no js generator is provided.
            // - if dts is specified as a target, but no dts generator is provided.
            // In the latter two cases, it is because we need the generated TS files
            // to use for transpiling js and/or dts.
            let tsFiles = [];
            if (targetTs ||
                (targetJs && !init.generateJs) ||
                (targetDts && !init.generateDts)) {
                schema.prepareGenerate("ts");
                init.generateTs(schema, "ts");
                // Save off the generated TypeScript files so that we can pass these
                // to the transpilation process if necessary.  We do not want to pass
                // JavaScript files for a few reasons:
                // 1.  Our usage of allowJs in the compiler options will cause issues
                // with attempting to transpile .ts and .js files to the same location.
                // 2.  There should be no reason to transpile JS because generateTs
                // functions are required, so users would never be able to only specify
                // a generateJs function and expect to transpile declarations.
                // 3.  Transpiling is somewhat expensive and situations with an
                // extremely large amount of files could have performance impacts.
                tsFiles = schema.getFileInfo();
            }
            if (targetJs) {
                if (init.generateJs) {
                    schema.prepareGenerate("js");
                    init.generateJs(schema, "js");
                }
                else {
                    transpileJs = true;
                }
            }
            if (targetDts) {
                if (init.generateDts) {
                    schema.prepareGenerate("dts");
                    init.generateDts(schema, "dts");
                }
                else {
                    transpileDts = true;
                }
            }
            // Get generated files.  If ts was specified as a target, then we want
            // all generated files.  If ts was not specified, we still may have
            // generated TypeScript files to assist in transpilation.  If they were
            // generated but not specified in the target out, we shouldn't produce
            // these files in the CodeGeneratorResponse.
            let files = schema.getFileInfo();
            if (!targetTs && tsFiles.length > 0) {
                files = files.filter((file) => !tsFiles.some((tsFile) => tsFile.name === file.name));
            }
            // If either boolean is true, it means it was specified in the target out
            // but no generate function was provided.  This also means that we will
            // have generated .ts files above.
            if (transpileJs || transpileDts) {
                const transpileFn = (_c = init.transpile) !== null && _c !== void 0 ? _c : transpile;
                // Transpile the TypeScript files and add to the master list of files
                const transpiledFiles = transpileFn(tsFiles, transpileJs, transpileDts, parameter.parsed.jsImportStyle);
                files.push(...transpiledFiles);
            }
            return toResponse(files, minimumEdition, maximumEdition);
        },
    };
}
function toResponse(files, minimumEdition, maximumEdition) {
    return create(CodeGeneratorResponseSchema, {
        supportedFeatures: protoInt64.parse(CodeGeneratorResponse_Feature.PROTO3_OPTIONAL |
            CodeGeneratorResponse_Feature.SUPPORTS_EDITIONS),
        minimumEdition,
        maximumEdition,
        file: files.map((f) => {
            if (f.preamble !== undefined) {
                f.content = f.preamble + "\n" + f.content;
            }
            return f;
        }),
    });
}
