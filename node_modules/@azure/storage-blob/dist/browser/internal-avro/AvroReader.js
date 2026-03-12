// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// TODO: Do a review of non-interfaces
/* eslint-disable @azure/azure-sdk/ts-use-interface-parameters */
import { AVRO_CODEC_KEY, AVRO_INIT_BYTES, AVRO_SCHEMA_KEY, AVRO_SYNC_MARKER_SIZE, } from "./AvroConstants.js";
import { AvroParser, AvroType } from "./AvroParser.js";
import { arraysEqual } from "./utils/utils.common.js";
export class AvroReader {
    _dataStream;
    _headerStream;
    _syncMarker;
    _metadata;
    _itemType;
    _itemsRemainingInBlock;
    // Remembers where we started if partial data stream was provided.
    _initialBlockOffset;
    /// The byte offset within the Avro file (both header and data)
    /// of the start of the current block.
    _blockOffset;
    get blockOffset() {
        return this._blockOffset;
    }
    _objectIndex;
    get objectIndex() {
        return this._objectIndex;
    }
    _initialized;
    constructor(dataStream, headerStream, currentBlockOffset, indexWithinCurrentBlock) {
        this._dataStream = dataStream;
        this._headerStream = headerStream || dataStream;
        this._initialized = false;
        this._blockOffset = currentBlockOffset || 0;
        this._objectIndex = indexWithinCurrentBlock || 0;
        this._initialBlockOffset = currentBlockOffset || 0;
    }
    async initialize(options = {}) {
        const header = await AvroParser.readFixedBytes(this._headerStream, AVRO_INIT_BYTES.length, {
            abortSignal: options.abortSignal,
        });
        if (!arraysEqual(header, AVRO_INIT_BYTES)) {
            throw new Error("Stream is not an Avro file.");
        }
        // File metadata is written as if defined by the following map schema:
        // { "type": "map", "values": "bytes"}
        this._metadata = await AvroParser.readMap(this._headerStream, AvroParser.readString, {
            abortSignal: options.abortSignal,
        });
        // Validate codec
        const codec = this._metadata[AVRO_CODEC_KEY];
        if (!(codec === undefined || codec === null || codec === "null")) {
            throw new Error("Codecs are not supported");
        }
        // The 16-byte, randomly-generated sync marker for this file.
        this._syncMarker = await AvroParser.readFixedBytes(this._headerStream, AVRO_SYNC_MARKER_SIZE, {
            abortSignal: options.abortSignal,
        });
        // Parse the schema
        const schema = JSON.parse(this._metadata[AVRO_SCHEMA_KEY]);
        this._itemType = AvroType.fromSchema(schema);
        if (this._blockOffset === 0) {
            this._blockOffset = this._initialBlockOffset + this._dataStream.position;
        }
        this._itemsRemainingInBlock = await AvroParser.readLong(this._dataStream, {
            abortSignal: options.abortSignal,
        });
        // skip block length
        await AvroParser.readLong(this._dataStream, { abortSignal: options.abortSignal });
        this._initialized = true;
        if (this._objectIndex && this._objectIndex > 0) {
            for (let i = 0; i < this._objectIndex; i++) {
                await this._itemType.read(this._dataStream, { abortSignal: options.abortSignal });
                this._itemsRemainingInBlock--;
            }
        }
    }
    hasNext() {
        return !this._initialized || this._itemsRemainingInBlock > 0;
    }
    async *parseObjects(options = {}) {
        if (!this._initialized) {
            await this.initialize(options);
        }
        while (this.hasNext()) {
            const result = await this._itemType.read(this._dataStream, {
                abortSignal: options.abortSignal,
            });
            this._itemsRemainingInBlock--;
            this._objectIndex++;
            if (this._itemsRemainingInBlock === 0) {
                const marker = await AvroParser.readFixedBytes(this._dataStream, AVRO_SYNC_MARKER_SIZE, {
                    abortSignal: options.abortSignal,
                });
                this._blockOffset = this._initialBlockOffset + this._dataStream.position;
                this._objectIndex = 0;
                if (!arraysEqual(this._syncMarker, marker)) {
                    throw new Error("Stream is not a valid Avro file.");
                }
                try {
                    this._itemsRemainingInBlock = await AvroParser.readLong(this._dataStream, {
                        abortSignal: options.abortSignal,
                    });
                }
                catch {
                    // We hit the end of the stream.
                    this._itemsRemainingInBlock = 0;
                }
                if (this._itemsRemainingInBlock > 0) {
                    // Ignore block size
                    await AvroParser.readLong(this._dataStream, { abortSignal: options.abortSignal });
                }
            }
            yield result;
        }
    }
}
//# sourceMappingURL=AvroReader.js.map