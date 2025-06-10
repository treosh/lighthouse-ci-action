"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTypeGenerator = void 0;
const ts = require("typescript");
const method_info_generator_1 = require("./method-info-generator");
const local_type_name_1 = require("./local-type-name");
const typescript_comments_1 = require("../framework/typescript-comments");
const typescript_literal_from_value_1 = require("../framework/typescript-literal-from-value");
class ServiceTypeGenerator {
    constructor(symbols, imports, comments, interpreter, options) {
        this.symbols = symbols;
        this.imports = imports;
        this.comments = comments;
        this.interpreter = interpreter;
        this.options = options;
        this.methodInfoGenerator = new method_info_generator_1.MethodInfoGenerator(imports);
    }
    registerSymbols(source, descService) {
        this.symbols.register(local_type_name_1.createLocalTypeName(descService), descService, source);
    }
    // export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
    //     { name: "MakeHat", localName: "makeHat", I: Size, O: Hat },
    // ], {});
    generateServiceType(source, descService) {
        const 
        // identifier for the service
        MyService = this.imports.type(source, descService), ServiceType = this.imports.name(source, "ServiceType", this.options.runtimeRpcImportPath), interpreterType = this.interpreter.getServiceType(descService);
        const args = [
            ts.createStringLiteral(interpreterType.typeName),
            this.methodInfoGenerator.createMethodInfoLiterals(source, interpreterType.methods)
        ];
        if (Object.keys(interpreterType.options).length) {
            args.push(typescript_literal_from_value_1.typescriptLiteralFromValue(interpreterType.options));
        }
        const exportConst = ts.createVariableStatement([ts.createModifier(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier(MyService), undefined, ts.createNew(ts.createIdentifier(ServiceType), undefined, args))], ts.NodeFlags.Const));
        // add to our file
        source.addStatement(exportConst);
        // add comments
        let comment = this.comments.makeDeprecatedTag(descService);
        comment += this.comments.makeGeneratedTag(descService).replace("@generated from ", "@generated ServiceType for ");
        typescript_comments_1.addCommentBlockAsJsDoc(exportConst, comment);
        return;
    }
}
exports.ServiceTypeGenerator = ServiceTypeGenerator;
