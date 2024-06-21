// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const extensionPalette = [
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
];
export function colorIsValid(color) {
    return extensionPalette.includes(color);
}
export function validateColorInPayload(payload) {
    if (!('color' in payload) || !payload.color) {
        return false;
    }
    const color = payload['color'];
    return colorIsValid(color);
}
export function isExtensionPayloadMarker(payload) {
    const colorIsValid = validateColorInPayload(payload);
    return payload.metadata.dataType === "marker" /* ExtensionEntryType.MARKER */ && colorIsValid;
}
export function isExtensionPayloadFlameChartEntry(payload) {
    const colorIsValid = validateColorInPayload(payload);
    const hasTrack = 'track' in payload && Boolean(payload.track);
    return payload.metadata.dataType === "track-entry" /* ExtensionEntryType.TRACK_ENTRY */ && hasTrack && colorIsValid;
}
export function isSyntheticExtensionEntry(entry) {
    return entry.cat === 'devtools.extension';
}
//# sourceMappingURL=Extensions.js.map