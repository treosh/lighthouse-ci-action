"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTypeGenerator = void 0;
const ts = require("typescript");
const well_known_types_1 = require("../message-type-extensions/well-known-types");
const google_types_1 = require("../message-type-extensions/google-types");
const create_1 = require("../message-type-extensions/create");
const internal_binary_read_1 = require("../message-type-extensions/internal-binary-read");
const internal_binary_write_1 = require("../message-type-extensions/internal-binary-write");
const field_info_generator_1 = require("./field-info-generator");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const typescript_comments_1 = require("../framework/typescript-comments");
const typescript_literal_from_value_1 = require("../framework/typescript-literal-from-value");
class MessageTypeGenerator {
    constructor(registry, imports, comments, interpreter, options) {
        this.registry = registry;
        this.imports = imports;
        this.comments = comments;
        this.interpreter = interpreter;
        this.options = options;
        this.fieldInfoGenerator = new field_info_generator_1.FieldInfoGenerator(this.registry, this.imports);
        this.wellKnown = new well_known_types_1.WellKnownTypes(this.imports, this.options);
        this.googleTypes = new google_types_1.GoogleTypes(this.imports, this.options);
        this.typeMethodCreate = new create_1.Create(this.imports, this.interpreter, this.options);
        this.typeMethodInternalBinaryRead = new internal_binary_read_1.InternalBinaryRead(this.registry, this.imports, this.interpreter, this.options);
        this.typeMethodInternalBinaryWrite = new internal_binary_write_1.InternalBinaryWrite(this.registry, this.imports, this.interpreter, this.options);
    }
    /**
     * Declare a handler for the message. The handler provides
     * functions to read / write messages of the specific type.
     *
     * For the following .proto:
     *
     *   package test;
     *   message MyMessage {
     *     string str_field = 1;
     *   }
     *
     * We generate the following variable declaration:
     *
     *   import { H } from "R";
     *   const MyMessage: H<MyMessage> =
     *     new H<MyMessage>(
     *       ".test.MyMessage",
     *       [{ no: 0, name: "str_field", kind: "scalar", T: 9 }]
     *     );
     *
     * H is the concrete class imported from runtime R.
     * Some field information is passed to the handler's
     * constructor.
     */
    generateMessageType(source, descMessage, optimizeFor) {
        const 
        // identifier for the message
        MyMessage = this.imports.type(source, descMessage), Message$Type = ts.createIdentifier(this.imports.type(source, descMessage) + '$Type'), MessageType = ts.createIdentifier(this.imports.name(source, "MessageType", this.options.runtimeImportPath)), interpreterType = this.interpreter.getMessageType(descMessage), classDecMembers = [], classDecSuperArgs = [
            // arg 0: type name
            ts.createStringLiteral(descMessage.typeName),
            // arg 1: field infos
            this.fieldInfoGenerator.createFieldInfoLiterals(source, interpreterType.fields)
        ];
        // if present, add message options in json format to MessageType CTOR args
        if (Object.keys(interpreterType.options).length) {
            classDecSuperArgs.push(typescript_literal_from_value_1.typescriptLiteralFromValue(interpreterType.options));
        }
        // "MyMessage$Type" constructor() { super(...) }
        classDecMembers.push(ts.createConstructor(undefined, undefined, [], ts.createBlock([ts.createExpressionStatement(ts.createCall(ts.createSuper(), undefined, classDecSuperArgs))], true)));
        // "MyMessage$Type" members for supported standard types
        classDecMembers.push(...this.wellKnown.make(source, descMessage));
        classDecMembers.push(...this.googleTypes.make(source, descMessage));
        // "MyMessage$Type" members for optimized binary format
        if (optimizeFor === wkt_1.FileOptions_OptimizeMode.SPEED) {
            classDecMembers.push(...this.typeMethodCreate.make(source, descMessage), ...this.typeMethodInternalBinaryRead.make(source, descMessage), ...this.typeMethodInternalBinaryWrite.make(source, descMessage));
        }
        // class "MyMessage$Type" extends "MessageType"<"MyMessage"> {
        const classDec = ts.createClassDeclaration(undefined, undefined, Message$Type, undefined, [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [ts.createExpressionWithTypeArguments([ts.createTypeReferenceNode(MyMessage, undefined)], MessageType)])], classDecMembers);
        // export const "messageId" = new "MessageTypeId"();
        const exportConst = ts.createVariableStatement([ts.createModifier(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([ts.createVariableDeclaration(MyMessage, undefined, ts.createNew(Message$Type, undefined, []))], ts.NodeFlags.Const));
        // add to our file
        source.addStatement(classDec);
        source.addStatement(exportConst);
        // add comments
        ts.addSyntheticLeadingComment(classDec, ts.SyntaxKind.SingleLineCommentTrivia, " @generated message type with reflection information, may provide speed optimized methods", false);
        let comment = this.comments.makeDeprecatedTag(descMessage);
        comment += this.comments.makeGeneratedTag(descMessage).replace("@generated from ", "@generated MessageType for ");
        typescript_comments_1.addCommentBlockAsJsDoc(exportConst, comment);
        return;
    }
}
exports.MessageTypeGenerator = MessageTypeGenerator;
