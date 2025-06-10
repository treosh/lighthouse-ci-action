"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Create = void 0;
const ts = require("typescript");
const typescript_literal_from_value_1 = require("../framework/typescript-literal-from-value");
/**
 * Generates a "create()" method for an `IMessageType`
 */
class Create {
    constructor(imports, interpreter, options) {
        this.imports = imports;
        this.interpreter = interpreter;
        this.options = options;
    }
    // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
    make(source, descMessage) {
        // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
        let methodDeclaration = this.makeMethod(source, descMessage, 
        // const message = globalThis.Object.create(this.messagePrototype);
        this.makeMessageVariable(), 
        // message.boolField = false;
        // message.repeatedField = [];
        // message.mapField = {};
        // ...
        ...this.makeMessagePropertyAssignments(source, descMessage), 
        // if (value !== undefined)
        //     reflectionMergePartial<ScalarValuesMessage>(message, value, this);
        this.makeMergeIf(source, descMessage), 
        // return message;
        ts.createReturn(ts.createIdentifier("message")));
        return [methodDeclaration];
    }
    makeMethod(source, descMessage, ...bodyStatements) {
        const MessageInterface = this.imports.type(source, descMessage), PartialMessage = this.imports.name(source, 'PartialMessage', this.options.runtimeImportPath, true);
        return ts.createMethod(undefined, undefined, undefined, ts.createIdentifier("create"), undefined, undefined, [
            ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("value"), ts.createToken(ts.SyntaxKind.QuestionToken), ts.createTypeReferenceNode(PartialMessage, [
                ts.createTypeReferenceNode((MessageInterface), undefined)
            ]), undefined)
        ], ts.createTypeReferenceNode(MessageInterface, undefined), ts.createBlock(bodyStatements, true));
    }
    makeMessageVariable() {
        return ts.createVariableStatement(undefined, ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier("message"), undefined, ts.createCall(ts.createPropertyAccess(ts.createPropertyAccess(ts.createIdentifier("globalThis"), ts.createIdentifier("Object")), ts.createIdentifier("create")), undefined, [
                ts.createNonNullExpression(ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("messagePrototype")))
            ]))], ts.NodeFlags.Const));
    }
    makeMessagePropertyAssignments(source, descMessage) {
        let messageType = this.interpreter.getMessageType(descMessage);
        let defaultMessage = messageType.create();
        return Object.entries(defaultMessage).map(([key, value]) => (ts.createExpressionStatement(ts.createBinary(ts.createPropertyAccess(ts.createIdentifier("message"), ts.createIdentifier(key)), ts.createToken(ts.SyntaxKind.EqualsToken), typescript_literal_from_value_1.typescriptLiteralFromValue(value)))));
    }
    makeMergeIf(source, descMessage) {
        const MessageInterface = this.imports.type(source, descMessage);
        return ts.createIf(ts.createBinary(ts.createIdentifier("value"), ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken), ts.createIdentifier("undefined")), ts.createExpressionStatement(ts.createCall(ts.createIdentifier(this.imports.name(source, 'reflectionMergePartial', this.options.runtimeImportPath)), [ts.createTypeReferenceNode(MessageInterface, undefined)], [
            ts.createThis(),
            ts.createIdentifier("message"),
            ts.createIdentifier("value"),
        ])), undefined);
    }
}
exports.Create = Create;
