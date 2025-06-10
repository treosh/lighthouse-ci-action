"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceServerGeneratorGrpc = void 0;
const ts = require("typescript");
const runtime_1 = require("@protobuf-ts/runtime");
const local_type_name_1 = require("./local-type-name");
const typescript_comments_1 = require("../framework/typescript-comments");
class ServiceServerGeneratorGrpc {
    constructor(symbols, imports, comments, interpreter) {
        this.symbols = symbols;
        this.imports = imports;
        this.comments = comments;
        this.interpreter = interpreter;
        this.symbolKindInterface = 'grpc-server-interface';
        this.symbolKindDefinition = 'grpc-server-definition';
    }
    registerSymbols(source, descService) {
        const basename = local_type_name_1.createLocalTypeName(descService);
        const interfaceName = `I${basename}`;
        const definitionName = `${basename[0].toLowerCase()}${basename.substring(1)}Definition`;
        this.symbols.register(interfaceName, descService, source, this.symbolKindInterface);
        this.symbols.register(definitionName, descService, source, this.symbolKindDefinition);
    }
    generateInterface(source, descService) {
        const interpreterType = this.interpreter.getServiceType(descService), IGrpcServer = this.imports.type(source, descService, this.symbolKindInterface), grpc = this.imports.namespace(source, 'grpc', '@grpc/grpc-js', true);
        const statement = ts.createInterfaceDeclaration(undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)], ts.createIdentifier(IGrpcServer), undefined, [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [ts.createExpressionWithTypeArguments(undefined, ts.createPropertyAccess(ts.createIdentifier(grpc), ts.createIdentifier("UntypedServiceImplementation")))])], interpreterType.methods.map(mi => {
            const descMethod = descService.methods.find(descMethod => descMethod.name === mi.name);
            runtime_1.assert(descMethod);
            return this.createMethodPropertySignature(source, mi, descMethod);
        }));
        // add to our file
        this.comments.addCommentsForDescriptor(statement, descService, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;
    }
    createMethodPropertySignature(source, methodInfo, descMethod) {
        const grpc = this.imports.namespace(source, 'grpc', '@grpc/grpc-js', true);
        let handler;
        if (methodInfo.serverStreaming && methodInfo.clientStreaming) {
            handler = 'handleBidiStreamingCall';
        }
        else if (methodInfo.serverStreaming) {
            handler = 'handleServerStreamingCall';
        }
        else if (methodInfo.clientStreaming) {
            handler = 'handleClientStreamingCall';
        }
        else {
            handler = 'handleUnaryCall';
        }
        const signature = ts.createPropertySignature(undefined, ts.createIdentifier(methodInfo.localName), undefined, ts.createTypeReferenceNode(ts.createQualifiedName(ts.createIdentifier(grpc), ts.createIdentifier(handler)), [
            ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.I.typeName)), undefined),
            ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(source, methodInfo.O.typeName)), undefined),
        ]), undefined);
        this.comments.addCommentsForDescriptor(signature, descMethod, 'appendToLeadingBlock');
        return signature;
    }
    generateDefinition(source, descService) {
        const grpcServerDefinition = this.imports.type(source, descService, this.symbolKindDefinition), IGrpcServer = this.imports.type(source, descService, this.symbolKindInterface), interpreterType = this.interpreter.getServiceType(descService), grpc = this.imports.namespace(source, 'grpc', '@grpc/grpc-js', true);
        const statement = ts.createVariableStatement([ts.createModifier(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier(grpcServerDefinition), ts.createTypeReferenceNode(ts.createQualifiedName(ts.createIdentifier(grpc), ts.createIdentifier("ServiceDefinition")), [ts.createTypeReferenceNode(ts.createIdentifier(IGrpcServer), undefined)]), ts.createObjectLiteral(interpreterType.methods.map(mi => this.makeDefinitionProperty(source, mi)), true))], ts.NodeFlags.Const));
        // add to our file
        const doc = `@grpc/grpc-js definition for the protobuf ${descService.toString()}.\n` +
            `\n` +
            `Usage: Implement the interface ${IGrpcServer} and add to a grpc server.\n` +
            `\n` +
            '```typescript\n' +
            `const server = new grpc.Server();\n` +
            `const service: ${IGrpcServer} = ...\n` +
            `server.addService(${grpcServerDefinition}, service);\n` +
            '```';
        typescript_comments_1.addCommentBlockAsJsDoc(statement, doc);
        source.addStatement(statement);
        return statement;
    }
    makeDefinitionProperty(source, methodInfo) {
        const I = this.imports.typeByName(source, methodInfo.I.typeName);
        const O = this.imports.typeByName(source, methodInfo.O.typeName);
        return ts.createPropertyAssignment(ts.createIdentifier(methodInfo.localName), ts.createObjectLiteral([
            ts.createPropertyAssignment(ts.createIdentifier("path"), ts.createStringLiteral(`/${methodInfo.service.typeName}/${methodInfo.name}`)),
            ts.createPropertyAssignment(ts.createIdentifier("originalName"), ts.createStringLiteral(methodInfo.name)),
            ts.createPropertyAssignment(ts.createIdentifier("requestStream"), methodInfo.clientStreaming ? ts.createTrue() : ts.createFalse()),
            ts.createPropertyAssignment(ts.createIdentifier("responseStream"), methodInfo.serverStreaming ? ts.createTrue() : ts.createFalse()),
            ts.createPropertyAssignment(ts.createIdentifier("responseDeserialize"), ts.createArrowFunction(undefined, undefined, [ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("bytes"), undefined, undefined, undefined)], undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(O), ts.createIdentifier("fromBinary")), undefined, [ts.createIdentifier("bytes")]))),
            ts.createPropertyAssignment(ts.createIdentifier("requestDeserialize"), ts.createArrowFunction(undefined, undefined, [ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("bytes"), undefined, undefined, undefined)], undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createCall(ts.createPropertyAccess(ts.createIdentifier(I), ts.createIdentifier("fromBinary")), undefined, [ts.createIdentifier("bytes")]))),
            ts.createPropertyAssignment(ts.createIdentifier("responseSerialize"), ts.createArrowFunction(undefined, undefined, [ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("value"), undefined, undefined, undefined)], undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createCall(ts.createPropertyAccess(ts.createIdentifier("Buffer"), ts.createIdentifier("from")), undefined, [ts.createCall(ts.createPropertyAccess(ts.createIdentifier(O), ts.createIdentifier("toBinary")), undefined, [ts.createIdentifier("value")])]))),
            ts.createPropertyAssignment(ts.createIdentifier("requestSerialize"), ts.createArrowFunction(undefined, undefined, [ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("value"), undefined, undefined, undefined)], undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createCall(ts.createPropertyAccess(ts.createIdentifier("Buffer"), ts.createIdentifier("from")), undefined, [ts.createCall(ts.createPropertyAccess(ts.createIdentifier(I), ts.createIdentifier("toBinary")), undefined, [ts.createIdentifier("value")])])))
        ], true));
    }
}
exports.ServiceServerGeneratorGrpc = ServiceServerGeneratorGrpc;
