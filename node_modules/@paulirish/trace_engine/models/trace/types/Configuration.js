// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export const defaults = () => ({
    includeRuntimeCallStats: false,
    showAllEvents: false,
    debugMode: false,
});
/**
 * Generates a key that can be used to represent this config in a cache. This is
 * used mainly in tests, where we want to avoid re-parsing a file if we have
 * already processed it with the same configuration.
 */
export function configToCacheKey(config) {
    return JSON.stringify(config);
}
//# sourceMappingURL=Configuration.js.map