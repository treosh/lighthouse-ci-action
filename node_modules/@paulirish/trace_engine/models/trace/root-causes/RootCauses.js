// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { LayoutShiftRootCauses } from './LayoutShift.js';
export class RootCauses {
    layoutShifts;
    constructor(protocolInterface) {
        this.layoutShifts = new LayoutShiftRootCauses(protocolInterface);
    }
}
export { LayoutShiftRootCauses } from './LayoutShift.js';
//# sourceMappingURL=RootCauses.js.map