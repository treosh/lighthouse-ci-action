#!/usr/bin/env bash

##
# @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
##

# Download chrome inside of our CI env.

set -euo pipefail

unameOut="$(uname -s)"
case "${unameOut}" in
  Linux*)     machine=Linux;;
  Darwin*)    machine=Mac;;
  MINGW*)     machine=MinGw;;
  *)          machine="UNKNOWN:${unameOut}"
esac

if [ "$machine" == "MinGw" ]; then
  url="https://download-chromium.appspot.com/dl/Win?type=snapshots"
elif [ "$machine" == "Linux" ]; then
  url="https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots"
elif [ "$machine" == "Mac" ]; then
  url="https://download-chromium.appspot.com/dl/Mac?type=snapshots"
else
  echo "unsupported platform"
  exit 1
fi

if [ -e "$CHROME_PATH" ]; then
  echo "cached chrome found"
else
  curl "$url" -Lo chrome.zip && unzip -q chrome.zip
fi
