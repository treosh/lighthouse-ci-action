"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTable = void 0;
const out_file_1 = require("./out-file");
class FileTable {
    constructor(options, clashResolver) {
        this.options = options;
        this.outFiles = [];
        this.entries = [];
        this.clashResolveMaxTries = 100;
        this.hasName = (name) => this.entries.some(e => e.name === name);
        this.clashResolver = clashResolver !== null && clashResolver !== void 0 ? clashResolver : FileTable.defaultClashResolver;
    }
    register(requestedName, descFile, kind = 'default') {
        // Only one symbol per kind can be registered for a descriptor.
        if (this.has(descFile, kind)) {
            let { name } = this.get(descFile, kind);
            let msg = `Cannot register name "${requestedName}" of kind "${kind}" for ${descFile.toString()}. `
                + `The descriptor is already registered with name "${name}". `
                + `Use a different 'kind' to register multiple symbols for a descriptor.`;
            throw new Error(msg);
        }
        // find a free name within the file
        let name = requestedName;
        let count = 0;
        while (this.hasName(name) && count < this.clashResolveMaxTries) {
            name = this.clashResolver(descFile, requestedName, kind, ++count, name);
        }
        if (this.hasName(name)) {
            let msg = `Failed to register name "${requestedName}" for ${descFile.toString()}. `
                + `Gave up finding alternative name after ${this.clashResolveMaxTries} tries. `
                + `There is something wrong with the clash resolver.`;
            throw new Error(msg);
        }
        // add the entry and return name
        this.entries.push({ desc: descFile, kind, name });
        return name;
    }
    create(descFile, kind = 'default') {
        const outFile = new out_file_1.OutFile(this.get(descFile, kind).name, descFile, this.options);
        this.outFiles.push(outFile);
        return outFile;
    }
    /**
     * Find a symbol (of the given kind) for the given descriptor.
     * Return `undefined` if not found.
     */
    findByProtoFilenameAndKind(protoFilename, kind = 'default') {
        return this.entries.find(e => e.desc.proto.name === protoFilename && e.kind === kind);
    }
    /**
     * Find a symbol (of the given kind) for the given descriptor.
     * Raises error if not found.
     */
    get(descriptor, kind = 'default') {
        const protoFilename = descriptor.proto.name;
        const found = this.findByProtoFilenameAndKind(protoFilename, kind);
        if (!found) {
            let msg = `Failed to find name for file ${protoFilename} of kind "${kind}". `
                + `Searched in ${this.entries.length} files.`;
            throw new Error(msg);
        }
        return found;
    }
    /**
     * Is a name (of the given kind) registered for the the given descriptor?
     */
    has(descFile, kind = 'default') {
        return !!this.findByProtoFilenameAndKind(descFile.proto.name, kind);
    }
    static defaultClashResolver(descriptor, requestedName, kind, tryCount) {
        const lastDotI = requestedName.lastIndexOf('.');
        let basename = lastDotI > 0 ? requestedName.substring(0, lastDotI) : requestedName;
        const suffix = lastDotI > 0 ? requestedName.substring(lastDotI) : '';
        basename = basename.endsWith('$') ? basename.substring(1) : basename;
        basename = basename + '$' + tryCount;
        return basename + suffix;
    }
}
exports.FileTable = FileTable;
