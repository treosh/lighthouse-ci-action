/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';

import {renderReport} from '../../../report/renderer/api.js';
import {useExternalRenderer} from '../util';

/**
 * The default behavior of anchor links is not compatible with the flow report's hash navigation.
 * This function converts a category score anchor link to a flow report link.
 * e.g. <a href="#link"> -> <a href="#index=0&anchor=link">
 */
function convertAnchor(link: HTMLAnchorElement, index: number) {
  // Clear existing event listeners by cloning node.
  const newLink = link.cloneNode(true) as HTMLAnchorElement;
  if (!newLink.hash) return newLink;

  const nodeId = link.hash.substr(1);
  newLink.hash = `#index=${index}&anchor=${nodeId}`;
  newLink.onclick = e => {
    e.preventDefault();
    const el = document.getElementById(nodeId);
    if (el) el.scrollIntoView();
  };
  link.replaceWith(newLink);
}

export const Report: FunctionComponent<{hashState: LH.FlowResult.HashState}> =
({hashState}) => {
  const ref = useExternalRenderer<HTMLDivElement>(() => {
    return renderReport(hashState.currentLhr, {
      disableFireworks: true,
      disableDarkMode: true,
      omitTopbar: true,
      omitGlobalStyles: true,
      onPageAnchorRendered: link => convertAnchor(link, hashState.index),
    });
  }, [hashState]);

  return (
    <div ref={ref} data-testid="Report"/>
  );
};
