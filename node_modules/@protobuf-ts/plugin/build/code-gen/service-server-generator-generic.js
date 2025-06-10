"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceServerGeneratorGeneric = void 0;
const ts = require("typescript");
const runtime_1 = require("@protobuf-ts/runtime");
const local_type_name_1 = require("./local-type-name");
class ServiceServerGeneratorGeneric {
    constructor(symbols, imports, comments, interpreter, options) {
        this.symbols = symbols;
        this.imports = imports;
        this.comments = comments;
        this.interpreter = interpreter;
        this.options = options;
        this.symbolKindInterface = 'generic-server-interface';
    }
    registerSymbols(source, descService) {
        const basename = local_type_name_1.createLocalTypeName(descService);
        const interfaceName = `I${basename}`;
        this.symbols.register(interfaceName, descService, source, this.symbolKindInterface);
    }
    generateInterface(source, descService) {
        const interpreterType = this.interpreter.getServiceType(descService), IGenericServer = this.imports.type(source, descService, this.symbolKindInterface), ServerCallContext = this.imports.name(source, "ServerCallContext", this.options.runtimeRpcImportPath);
        const statement = ts.createInterfaceDeclaration(undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)], ts.createIdentifier(IGenericServer), [
            ts.createTypeParameterDeclaration("T", undefined, ts.createTypeReferenceNode(ts.createIdentifier(ServerCallContext), undefined))
        ], undefined, interpreterType.methods.map(mi => {
            let signature;
            if (mi.serverStreaming && mi.clientStreaming) {
                signature = this.createBidi(source, mi);
            }
            else if (mi.serverStreaming) {
                signature = this.createServerStreaming(source, mi);
            }
            else if (mi.clientStreaming) {
                signature = this.createClientStreaming(source, mi);
            }
            else {
                signature = this.createUnary(source, mi);
            }
            const descMethod = descService.methods.find(descMethod => descMethod.name === mi.name);
            runtime_1.assert(descMethod);
            this.comments.addCommentsForDescriptor(signature, descMethod, 'appendToLeadingBlock');
            return signature;
        }));
        // add to our file
        this.comments.addCommentsForDescriptor(statement, descService, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;
    }
    createUnary(source, methodInfo) {
        const I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.I.typeName)), undefined), O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.O.typeName)), undefined);
        return ts.createMethodSignature(undefined, [
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("request"), undefined, I, undefined),
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("context"), undefined, ts.createTypeReferenceNode(ts.createIdentifier("T"), undefined), undefined)
        ], ts.createTypeReferenceNode(ts.createIdentifier("Promise"), [O]), ts.createIdentifier(methodInfo.localName), undefined);
    }
    createServerStreaming(source, methodInfo) {
        const I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.I.typeName)), undefined), O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.O.typeName)), undefined), RpcInputStream = this.imports.name(source, 'RpcInputStream', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(undefined, [
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("request"), undefined, I, undefined),
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("responses"), undefined, ts.createTypeReferenceNode(ts.createIdentifier(RpcInputStream), [O]), undefined),
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("context"), undefined, ts.createTypeReferenceNode(ts.createIdentifier("T"), undefined), undefined)
        ], ts.createTypeReferenceNode(ts.createIdentifier("Promise"), [ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]), ts.createIdentifier(methodInfo.localName), undefined);
    }
    createClientStreaming(source, methodInfo) {
        const I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.I.typeName)), undefined), O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.O.typeName)), undefined), RpcOutputStream = this.imports.name(source, 'RpcOutputStream', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(undefined, [
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("requests"), undefined, ts.createTypeReferenceNode(ts.createIdentifier(RpcOutputStream), [I]), undefined),
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("context"), undefined, ts.createTypeReferenceNode(ts.createIdentifier("T"), undefined), undefined)
        ], ts.createTypeReferenceNode(ts.createIdentifier("Promise"), [O]), ts.createIdentifier(methodInfo.localName), undefined);
    }
    createBidi(source, methodInfo) {
        const I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.I.typeName)), undefined), O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.O.typeName)), undefined), RpcOutputStream = this.imports.name(source, 'RpcOutputStream', this.options.runtimeRpcImportPath), RpcInputStream = this.imports.name(source, 'RpcInputStream', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(undefined, [
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("requests"), undefined, ts.createTypeReferenceNode(ts.createIdentifier(RpcOutputStream), [I]), undefined),
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("responses"), undefined, ts.createTypeReferenceNode(ts.createIdentifier(RpcInputStream), [O]), undefined),
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("context"), undefined, ts.createTypeReferenceNode(ts.createIdentifier("T"), undefined), undefined)
        ], ts.createTypeReferenceNode(ts.createIdentifier("Promise"), [ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]), ts.createIdentifier(methodInfo.localName), undefined);
    }
}
exports.ServiceServerGeneratorGeneric = ServiceServerGeneratorGeneric;
