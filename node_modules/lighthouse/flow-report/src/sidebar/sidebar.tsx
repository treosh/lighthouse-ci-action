/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';

import {Util} from '../../../report/renderer/util';
import {Separator} from '../common';
import {useI18n, useLocalizedStrings} from '../i18n/i18n';
import {CpuIcon, EnvIcon, NetworkIcon, SummaryIcon} from '../icons';
import {classNames, useHashState, useFlowResult} from '../util';
import {SidebarFlow} from './flow';

const SidebarSummary: FunctionComponent = () => {
  const hashState = useHashState();
  const strings = useLocalizedStrings();

  return (
    <a
      href="#"
      className={classNames('SidebarSummary', {'Sidebar--current': hashState === null})}
      data-testid="SidebarSummary"
    >
      <div className="SidebarSummary__icon">
        <SummaryIcon/>
      </div>
      <div className="SidebarSummary__label">{strings.summary}</div>
    </a>
  );
};

const SidebarRuntimeSettings: FunctionComponent<{settings: LH.ConfigSettings}> =
({settings}) => {
  const strings = useLocalizedStrings();
  const env = Util.getEmulationDescriptions(settings);

  return (
    <div className="SidebarRuntimeSettings">
      <div className="SidebarRuntimeSettings__item" title={strings.runtimeSettingsDevice}>
        <div className="SidebarRuntimeSettings__item--icon">
          <EnvIcon/>
        </div>
        {
          env.deviceEmulation
        }
      </div>
      <div
        className="SidebarRuntimeSettings__item"
        title={strings.runtimeSettingsNetworkThrottling}
      >
        <div className="SidebarRuntimeSettings__item--icon">
          <NetworkIcon/>
        </div>
        {
          env.summary
        }
      </div>
      <div className="SidebarRuntimeSettings__item" title={strings.runtimeSettingsCPUThrottling}>
        <div className="SidebarRuntimeSettings__item--icon">
          <CpuIcon/>
        </div>
        {
          `${settings.throttling.cpuSlowdownMultiplier}x slowdown`
        }
      </div>
    </div>
  );
};

const SidebarHeader: FunctionComponent<{title: string, date: string}> = ({title, date}) => {
  const i18n = useI18n();
  return (
    <div className="SidebarHeader">
      <div className="SidebarHeader__title">{title}</div>
      <div className="SidebarHeader__date">{i18n.formatDateTime(date)}</div>
    </div>
  );
};

const Sidebar: FunctionComponent = () => {
  const flowResult = useFlowResult();
  const firstLhr = flowResult.steps[0].lhr;
  return (
    <div className="Sidebar">
      <SidebarHeader title={flowResult.name} date={firstLhr.fetchTime}/>
      <Separator/>
      <SidebarSummary/>
      <Separator/>
      <SidebarFlow/>
      <Separator/>
      <SidebarRuntimeSettings settings={firstLhr.configSettings}/>
    </div>
  );
};

export {
  SidebarSummary,
  SidebarRuntimeSettings,
  SidebarHeader,
  Sidebar,
};
