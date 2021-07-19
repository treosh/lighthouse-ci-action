/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<LH.Crdp.ServiceWorker.WorkerVersionUpdatedEvent>}
 */
function getServiceWorkerVersions(session) {
  return new Promise((resolve, reject) => {
    /**
     * @param {LH.Crdp.ServiceWorker.WorkerVersionUpdatedEvent} data
     */
    const versionUpdatedListener = data => {
      // find a service worker with runningStatus that looks like active
      // on slow connections the serviceworker might still be installing
      const activateCandidates = data.versions.filter(sw => {
        return sw.status !== 'redundant';
      });

      const hasActiveServiceWorker = activateCandidates.find(sw => {
        return sw.status === 'activated';
      });

      if (!activateCandidates.length || hasActiveServiceWorker) {
        session.off('ServiceWorker.workerVersionUpdated', versionUpdatedListener);
        session.sendCommand('ServiceWorker.disable').then(_ => resolve(data), reject);
      }
    };

    session.on('ServiceWorker.workerVersionUpdated', versionUpdatedListener);

    session.sendCommand('ServiceWorker.enable').catch(reject);
  });
}

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<LH.Crdp.ServiceWorker.WorkerRegistrationUpdatedEvent>}
 */
function getServiceWorkerRegistrations(session) {
  return new Promise((resolve, reject) => {
    session.once('ServiceWorker.workerRegistrationUpdated', data => {
      session.sendCommand('ServiceWorker.disable').then(_ => resolve(data), reject);
    });
    session.sendCommand('ServiceWorker.enable').catch(reject);
  });
}

module.exports = {getServiceWorkerVersions, getServiceWorkerRegistrations};
