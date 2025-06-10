"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBaseProtobufES = void 0;
const wkt_1 = require("@bufbuild/protobuf/wkt");
const protobuf_1 = require("@bufbuild/protobuf");
const util_1 = require("util");
class PluginBaseProtobufES {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response, bytes = yield this.readBytes(process.stdin), request = protobuf_1.fromBinary(wkt_1.CodeGeneratorRequestSchema, bytes);
                try {
                    const files = yield this.generate(request);
                    response = this.createResponse(files);
                }
                catch (error) {
                    response = protobuf_1.create(wkt_1.CodeGeneratorResponseSchema, {
                        error: this.errorToString(error)
                    });
                }
                this.setBlockingStdout();
                process.stdout.write(protobuf_1.toBinary(wkt_1.CodeGeneratorResponseSchema, response));
            }
            catch (error) {
                process.stderr.write('Plugin failed to read CodeGeneratorRequest from stdin or write CodeGeneratorResponse to stdout.\n');
                process.stderr.write(this.errorToString(error));
                process.stderr.write('\n');
                process.exit(1);
            }
        });
    }
    getSupportedFeatures() {
        return [];
    }
    readBytes(stream) {
        return new Promise(resolve => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        });
    }
    createResponse(files) {
        // we have to respond with an xor of all of our supported features.
        // we should be working on a ulong here, but we cannot rely on bigint support.
        let feat = 0;
        for (let f of this.getSupportedFeatures()) {
            feat = feat ^ f;
        }
        const responseFiles = files
            .map(f => protobuf_1.create(wkt_1.CodeGeneratorResponse_FileSchema, {
            name: f.getFilename(),
            content: f.getContent()
        }))
            .filter(f => f.content && f.content.length > 0);
        return protobuf_1.create(wkt_1.CodeGeneratorResponseSchema, {
            file: responseFiles,
            supportedFeatures: protobuf_1.protoInt64.parse(feat),
        });
    }
    errorToString(error) {
        var _a;
        if (error && typeof error.name == 'string' && error.name == 'ParameterError') {
            return error.name + '\n\n' + error.message;
        }
        if (error && typeof error.name == 'string' && error.name == 'PluginMessageError') {
            return error.message;
        }
        if (util_1.types.isNativeError(error)) {
            return (_a = error.stack) !== null && _a !== void 0 ? _a : error.toString();
        }
        let text;
        try {
            text = error.toString();
        }
        catch (e) {
            text = 'unknown error';
        }
        return text;
    }
    setBlockingStdout() {
        // Fixes https://github.com/timostamm/protobuf-ts/issues/134
        // Node is buffering chunks to stdout, meaning that for big generated
        // files the CodeGeneratorResponse will not reach protoc completely.
        // To fix this, we set stdout to block using the internal private
        // method setBlocking(true)
        const stdoutHandle = process.stdout._handle;
        if (stdoutHandle) {
            stdoutHandle.setBlocking(true);
        }
    }
}
exports.PluginBaseProtobufES = PluginBaseProtobufES;
