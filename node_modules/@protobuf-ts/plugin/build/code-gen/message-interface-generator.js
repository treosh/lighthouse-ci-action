"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageInterfaceGenerator = void 0;
const ts = require("typescript");
const rt = require("@protobuf-ts/runtime");
const runtime_1 = require("@protobuf-ts/runtime");
const local_type_name_1 = require("./local-type-name");
class MessageInterfaceGenerator {
    constructor(symbols, imports, comments, interpreter, options) {
        this.symbols = symbols;
        this.imports = imports;
        this.comments = comments;
        this.interpreter = interpreter;
        this.options = options;
    }
    registerSymbols(source, descMessage) {
        this.symbols.register(local_type_name_1.createLocalTypeName(descMessage), descMessage, source);
    }
    /**
     * `message` as an interface.
     *
     * For the following .proto:
     *
     *   message MyMessage {
     *     string str_field = 1;
     *   }
     *
     * We generate the following interface:
     *
     *   interface MyMessage {
     *     strField: string;
     *   }
     *
     */
    generateMessageInterface(source, descMessage) {
        const interpreterType = this.interpreter.getMessageType(descMessage.typeName), processedOneofs = [], // oneof groups already processed
        members = []; // the interface members
        for (let fieldInfo of interpreterType.fields) {
            const descField = descMessage.fields.find(descField => descField.number === fieldInfo.no);
            runtime_1.assert(descField);
            if (fieldInfo.oneof && descField.oneof) {
                if (processedOneofs.includes(fieldInfo.oneof)) {
                    continue;
                }
                members.push(this.createOneofADTPropertySignature(source, descField.oneof));
                processedOneofs.push(fieldInfo.oneof);
            }
            else {
                // create regular properties
                members.push(this.createFieldPropertySignature(source, descField, fieldInfo));
            }
        }
        // export interface MyMessage { ...
        const statement = ts.createInterfaceDeclaration(undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)], this.imports.type(source, descMessage), undefined, undefined, members);
        // add to our file
        source.addStatement(statement);
        this.comments.addCommentsForDescriptor(statement, descMessage, 'appendToLeadingBlock');
        return statement;
    }
    /**
     * Create property signature for a protobuf field. Example:
     *
     *    fieldName: number
     *
     */
    createFieldPropertySignature(source, descField, fieldInfo) {
        let type; // the property type, may be made optional or wrapped into array at the end
        switch (fieldInfo.kind) {
            case "scalar":
                type = this.createScalarTypeNode(fieldInfo.T, fieldInfo.L);
                break;
            case "enum":
                type = this.createEnumTypeNode(source, fieldInfo.T());
                break;
            case "message":
                type = this.createMessageTypeNode(source, fieldInfo.T());
                break;
            case "map":
                let keyType = fieldInfo.K === rt.ScalarType.BOOL
                    ? ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                    : this.createScalarTypeNode(fieldInfo.K, rt.LongType.STRING);
                let valueType;
                switch (fieldInfo.V.kind) {
                    case "scalar":
                        valueType = this.createScalarTypeNode(fieldInfo.V.T, fieldInfo.V.L);
                        break;
                    case "enum":
                        valueType = this.createEnumTypeNode(source, fieldInfo.V.T());
                        break;
                    case "message":
                        valueType = this.createMessageTypeNode(source, fieldInfo.V.T());
                        break;
                }
                type = ts.createTypeLiteralNode([
                    ts.createIndexSignature(undefined, undefined, [
                        ts.createParameter(undefined, undefined, undefined, ts.createIdentifier('key'), undefined, keyType, undefined)
                    ], valueType)
                ]);
                break;
            default:
                throw new Error("unkown kind " + descField.toString());
        }
        // if repeated, wrap type into array type
        if (fieldInfo.repeat) {
            type = ts.createArrayTypeNode(type);
        }
        // if optional, add question mark
        let questionToken = fieldInfo.opt ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined;
        // create property
        const property = ts.createPropertySignature(undefined, ts.createIdentifier(fieldInfo.localName), questionToken, type, undefined);
        this.comments.addCommentsForDescriptor(property, descField, 'trailingLines');
        return property;
    }
    /**
     * `oneof` as an algebraic data type.
     *
     * For the following .proto:
     *
     *   oneof result {
     *     int32 value = 1;
     *     string error = 2;
     *   }
     *
     * We generate the following property signature:
     *
     *   result: { oneofKind: "value"; value: number; }
     *         | { oneofKind: "error"; error: string; }
     *         | { oneofKind: undefined; };
     */
    createOneofADTPropertySignature(source, descOneof) {
        const oneofCases = [], [parentMessageDesc, interpreterType, oneofLocalName] = this.oneofInfo(descOneof), memberFieldInfos = interpreterType.fields.filter(fi => fi.oneof === oneofLocalName);
        // create a type for each selection case
        for (let fieldInfo of memberFieldInfos) {
            // { oneofKind: 'fieldName' ... } part
            const kindProperty = ts.createPropertySignature(undefined, ts.createIdentifier(this.options.oneofKindDiscriminator), undefined, ts.createLiteralTypeNode(ts.createStringLiteral(fieldInfo.localName)), undefined);
            // { ..., fieldName: type } part
            let descField = parentMessageDesc.fields.find(fd => fd.number === fieldInfo.no);
            runtime_1.assert(descField !== undefined);
            let valueProperty = this.createFieldPropertySignature(source, descField, fieldInfo);
            // add this case
            oneofCases.push(ts.createTypeLiteralNode([kindProperty, valueProperty]));
        }
        // case for no selection: { oneofKind: undefined; }
        oneofCases.push(ts.createTypeLiteralNode([
            ts.createPropertySignature(undefined, ts.createIdentifier(this.options.oneofKindDiscriminator), undefined, ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword), undefined)
        ]));
        // final property signature for the oneof group, with a union type for all oneof cases
        const property = ts.createPropertySignature(undefined, ts.createIdentifier(oneofLocalName), undefined, ts.createUnionTypeNode(oneofCases), undefined);
        // add comments
        this.comments.addCommentsForDescriptor(property, descOneof, 'appendToLeadingBlock');
        return property;
    }
    /**
     * Helper to find for a OneofDescriptorProto:
     * [0] the message descriptor
     * [1] a corresponding message type generated by the interpreter
     * [2] the runtime local name of the oneof
     */
    oneofInfo(descOneof) {
        const parent = descOneof.parent;
        const interpreterType = this.interpreter.getMessageType(parent);
        const sampleField = descOneof.fields[0];
        const sampleFieldInfo = interpreterType.fields.find(fi => fi.no === sampleField.number);
        runtime_1.assert(sampleFieldInfo !== undefined);
        const oneofName = sampleFieldInfo.oneof;
        runtime_1.assert(oneofName !== undefined);
        return [parent, interpreterType, oneofName];
    }
    createScalarTypeNode(scalarType, longType) {
        switch (scalarType) {
            case rt.ScalarType.BOOL:
                return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case rt.ScalarType.STRING:
                return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case rt.ScalarType.BYTES:
                return ts.createTypeReferenceNode('Uint8Array', undefined);
            case rt.ScalarType.DOUBLE:
            case rt.ScalarType.FLOAT:
            case rt.ScalarType.INT32:
            case rt.ScalarType.FIXED32:
            case rt.ScalarType.UINT32:
            case rt.ScalarType.SFIXED32:
            case rt.ScalarType.SINT32:
                return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case rt.ScalarType.SFIXED64:
            case rt.ScalarType.INT64:
            case rt.ScalarType.UINT64:
            case rt.ScalarType.FIXED64:
            case rt.ScalarType.SINT64:
                switch (longType !== null && longType !== void 0 ? longType : rt.LongType.STRING) {
                    case rt.LongType.STRING:
                        return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
                    case rt.LongType.NUMBER:
                        return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
                    case rt.LongType.BIGINT:
                        return ts.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword);
                }
        }
    }
    createMessageTypeNode(source, type) {
        return ts.createTypeReferenceNode(this.imports.typeByName(source, type.typeName), undefined);
    }
    createEnumTypeNode(source, ei) {
        let [enumTypeName] = ei;
        return ts.createTypeReferenceNode(this.imports.typeByName(source, enumTypeName), undefined);
    }
}
exports.MessageInterfaceGenerator = MessageInterfaceGenerator;
