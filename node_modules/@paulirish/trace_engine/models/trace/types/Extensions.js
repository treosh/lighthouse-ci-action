// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export const extensionPalette = [
    'primary',
    'primary-light',
    'primary-dark',
    'secondary',
    'secondary-light',
    'secondary-dark',
    'tertiary',
    'tertiary-light',
    'tertiary-dark',
    'error',
    'warning',
];
export function isExtensionPayloadMarker(payload) {
    return payload.dataType === 'marker';
}
export function isExtensionPayloadTrackEntry(payload) {
    const hasTrack = 'track' in payload && Boolean(payload.track);
    const validEntryType = payload.dataType === 'track-entry' || payload.dataType === undefined;
    return validEntryType && hasTrack;
}
export function isValidExtensionPayload(payload) {
    return isExtensionPayloadMarker(payload) || isExtensionPayloadTrackEntry(payload);
}
export function isSyntheticExtensionEntry(entry) {
    return entry.cat === 'devtools.extension';
}
//# sourceMappingURL=Extensions.js.map