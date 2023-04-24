/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @param {Error} err
 * @return {undefined}
 */
function handlePotentialMissingNodeError(err) {
  if (
    /No node.*found/.test(err.message) ||
    /Node.*does not belong to the document/.test(err.message)
  ) {
    return undefined;
  }
  throw err;
}

/**
 * Resolves a backend node ID (from a trace event, protocol, etc) to the object ID for use with
 * `Runtime.callFunctionOn`. `undefined` means the node could not be found.
 *
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {number} backendNodeId
 * @return {Promise<string|undefined>}
 */
async function resolveNodeIdToObjectId(session, backendNodeId) {
  try {
    const resolveNodeResponse = await session.sendCommand('DOM.resolveNode', {backendNodeId});
    return resolveNodeResponse.object.objectId;
  } catch (err) {
    return handlePotentialMissingNodeError(err);
  }
}

/**
 * Resolves a proprietary devtools node path (created from page-function.js) to the object ID for use
 * with `Runtime.callFunctionOn`. `undefined` means the node could not be found.
 * Requires `DOM.getDocument` to have been called since the object's creation or it will always be `undefined`.
 *
 * @param {LH.Gatherer.FRProtocolSession} session
 * @param {string} path
 * @return {Promise<string|undefined>}
 */
async function resolveDevtoolsNodePathToObjectId(session, path) {
  try {
    const {nodeId} = await session.sendCommand('DOM.pushNodeByPathToFrontend', {path});
    const {object: {objectId}} = await session.sendCommand('DOM.resolveNode', {nodeId});
    return objectId;
  } catch (err) {
    return handlePotentialMissingNodeError(err);
  }
}

export {resolveNodeIdToObjectId, resolveDevtoolsNodePathToObjectId};
