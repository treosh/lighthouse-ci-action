/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent, JSX} from 'preact';
import {useState} from 'preact/hooks';

import {HelpDialog} from './help-dialog';
import {getFlowResultFilenamePrefix} from '../../report/generator/file-namer';
import {useLocalizedStrings} from './i18n/i18n';
import {HamburgerIcon, InfoIcon} from './icons';
import {useFlowResult, useOptions} from './util';
import {saveFile} from '../../report/renderer/api';

function saveHtml(flowResult: LH.FlowResult, htmlStr: string) {
  const blob = new Blob([htmlStr], {type: 'text/html'});
  const filename = getFlowResultFilenamePrefix(flowResult) + '.html';
  saveFile(blob, filename);
}

/* eslint-disable max-len */
const Logo: FunctionComponent = () => {
  return (
    <svg height="24" width="24" viewBox="0 0 24 24" role="img">
      <defs>
        <linearGradient x1="57.456%" y1="13.086%" x2="18.259%" y2="72.322%" id="Topbar__logo--a">
          <stop stop-color="#262626" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#262626" stop-opacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="100%" y1="50%" x2="0%" y2="50%" id="Topbar__logo--b">
          <stop stop-color="#262626" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#262626" stop-opacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="58.764%" y1="65.756%" x2="36.939%" y2="50.14%" id="Topbar__logo--c">
          <stop stop-color="#262626" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#262626" stop-opacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="41.635%" y1="20.358%" x2="72.863%" y2="85.424%" id="Topbar__logo--d">
          <stop stop-color="#FFF" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#FFF" stop-opacity="0" offset="100%"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <path d="M12 3l4.125 2.625v3.75H18v2.25h-1.688l1.5 9.375H6.188l1.5-9.375H6v-2.25h1.875V5.648L12 3zm2.201 9.938L9.54 14.633 9 18.028l5.625-2.062-.424-3.028zM12.005 5.67l-1.88 1.207v2.498h3.75V6.86l-1.87-1.19z" fill="#F44B21"/>
        <path fill="#FFF" d="M14.201 12.938L9.54 14.633 9 18.028l5.625-2.062z"/>
        <path d="M6 18c-2.042 0-3.95-.01-5.813 0l1.5-9.375h4.326L6 18z" fill="url(#Topbar__logo--a)" fill-rule="nonzero" transform="translate(6 3)"/>
        <path fill="#FFF176" fill-rule="nonzero" d="M13.875 9.375v-2.56l-1.87-1.19-1.88 1.207v2.543z"/>
        <path fill="url(#Topbar__logo--b)" fill-rule="nonzero" d="M0 6.375h6v2.25H0z" transform="translate(6 3)"/>
        <path fill="url(#Topbar__logo--c)" fill-rule="nonzero" d="M6 6.375H1.875v-3.75L6 0z" transform="translate(6 3)"/>
        <path fill="url(#Topbar__logo--d)" fill-rule="nonzero" d="M6 0l4.125 2.625v3.75H12v2.25h-1.688l1.5 9.375H.188l1.5-9.375H0v-2.25h1.875V2.648z" transform="translate(6 3)"/>
      </g>
    </svg>
  );
};
/* eslint-enable max-len */

const TopbarButton: FunctionComponent<{
  onClick: JSX.MouseEventHandler<HTMLButtonElement>,
  label: string,
}> =
({onClick, label, children}) => {
  return (
    <button className="TopbarButton" onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
};

export const Topbar: FunctionComponent<{onMenuClick: JSX.MouseEventHandler<HTMLButtonElement>}> =
({onMenuClick}) => {
  const flowResult = useFlowResult();
  const strings = useLocalizedStrings();
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const {getReportHtml, saveAsGist} = useOptions();

  return (
    <div className="Topbar">
      <TopbarButton onClick={onMenuClick} label="Button that opens and closes the sidebar">
        <HamburgerIcon/>
      </TopbarButton>
      <div className="Topbar__logo">
        <Logo/>
      </div>
      <div className="Topbar__title">{strings.title}</div>
      {
        getReportHtml &&
          <TopbarButton
            onClick={() => {
              const htmlStr = getReportHtml(flowResult);
              saveHtml(flowResult, htmlStr);
            }}
            label="Button that saves the report as HTML"
          >{strings.save}</TopbarButton>
      }
      {
        saveAsGist &&
          <TopbarButton
            onClick={() => saveAsGist(flowResult)}
            label="Button that saves the report to a gist"
          >{strings.dropdownSaveGist}</TopbarButton>
      }
      <div style={{flexGrow: 1}} />
      <TopbarButton
        onClick={() => setShowHelpDialog(previous => !previous)}
        label="Button that toggles the help dialog"
      >
        <div className="Topbar__help-label">
          <InfoIcon/>
          {strings.helpLabel}
        </div>
      </TopbarButton>
      {showHelpDialog ?
        <HelpDialog onClose={() => setShowHelpDialog(false)} /> :
        null
      }
    </div>
  );
};
