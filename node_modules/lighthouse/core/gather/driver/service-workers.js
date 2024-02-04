/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @param {LH.Gatherer.ProtocolSession} session
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
 * @param {LH.Gatherer.ProtocolSession} session
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

export {getServiceWorkerVersions, getServiceWorkerRegistrations};
