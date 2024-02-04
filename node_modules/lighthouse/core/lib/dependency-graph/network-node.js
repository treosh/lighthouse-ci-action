/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as LH from '../../../types/lh.js';
import {BaseNode} from './base-node.js';
import {NetworkRequest} from '../network-request.js';

class NetworkNode extends BaseNode {
  /**
   * @param {LH.Artifacts.NetworkRequest} networkRecord
   */
  constructor(networkRecord) {
    super(networkRecord.requestId);
    /** @private */
    this._record = networkRecord;
  }

  get type() {
    return BaseNode.TYPES.NETWORK;
  }

  /**
   * @return {number}
   */
  get startTime() {
    return this._record.networkRequestTime * 1000;
  }

  /**
   * @return {number}
   */
  get endTime() {
    return this._record.networkEndTime * 1000;
  }

  /**
   * @return {LH.Artifacts.NetworkRequest}
   */
  get record() {
    return this._record;
  }

  /**
   * @return {string}
   */
  get initiatorType() {
    return this._record.initiator && this._record.initiator.type;
  }

  /**
   * @return {boolean}
   */
  get fromDiskCache() {
    return !!this._record.fromDiskCache;
  }

  /**
   * @return {boolean}
   */
  get isNonNetworkProtocol() {
    return NetworkRequest.isNonNetworkRequest(this._record);
  }


  /**
   * Returns whether this network record can be downloaded without a TCP connection.
   * During simulation we treat data coming in over a network connection separately from on-device data.
   * @return {boolean}
   */
  get isConnectionless() {
    return this.fromDiskCache || this.isNonNetworkProtocol;
  }

  /**
   * @return {boolean}
   */
  hasRenderBlockingPriority() {
    const priority = this._record.priority;
    const isScript = this._record.resourceType === NetworkRequest.TYPES.Script;
    const isDocument = this._record.resourceType === NetworkRequest.TYPES.Document;
    const isBlockingScript = priority === 'High' && isScript;
    const isBlockingHtmlImport = priority === 'High' && isDocument;
    return priority === 'VeryHigh' || isBlockingScript || isBlockingHtmlImport;
  }

  /**
   * @return {NetworkNode}
   */
  cloneWithoutRelationships() {
    const node = new NetworkNode(this._record);
    node.setIsMainDocument(this._isMainDocument);
    return node;
  }
}

export {NetworkNode};
