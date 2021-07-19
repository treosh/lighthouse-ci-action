/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * URL shim so we keep our code DRY
 */

const Util = require('../report/html/renderer/util.js');

/** @typedef {import('./network-request.js')} NetworkRequest */

const allowedProtocols = [
  'https:', 'http:', 'chrome:', 'chrome-extension:',
];

const SECURE_SCHEMES = ['data', 'https', 'wss', 'blob', 'chrome', 'chrome-extension', 'about',
  'filesystem'];
const SECURE_LOCALHOST_DOMAINS = ['localhost', '127.0.0.1'];
const NON_NETWORK_SCHEMES = ['blob', 'data', 'intent'];

/**
 * There is fancy URL rewriting logic for the chrome://settings page that we need to work around.
 * Why? Special handling was added by Chrome team to allow a pushState transition between chrome:// pages.
 * As a result, the network URL (chrome://chrome/settings/) doesn't match the final document URL (chrome://settings/).
 * @param {string} url
 * @return {string}
 */
function rewriteChromeInternalUrl(url) {
  if (!url || !url.startsWith('chrome://')) return url;
  // Chrome adds a trailing slash to `chrome://` URLs, but the spec does not.
  //   https://github.com/GoogleChrome/lighthouse/pull/3941#discussion_r154026009
  if (url.endsWith('/')) url = url.replace(/\/$/, '');
  return url.replace(/^chrome:\/\/chrome\//, 'chrome://');
}

// URL is global as of node 10. https://nodejs.org/api/globals.html#globals_url
class URLShim extends URL {
  /**
   * @param {string} url
   * @return {boolean}
   */
  static isValid(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} urlA
   * @param {string} urlB
   * @return {boolean}
   */
  static hostsMatch(urlA, urlB) {
    try {
      return new URL(urlA).host === new URL(urlB).host;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} urlA
   * @param {string} urlB
   * @return {boolean}
   */
  static originsMatch(urlA, urlB) {
    try {
      return new URL(urlA).origin === new URL(urlB).origin;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} url
   * @return {?string}
   */
  static getOrigin(url) {
    try {
      const urlInfo = new URL(url);
      // check for both host and origin since some URLs schemes like data and file set origin to the
      // string "null" instead of the object
      return (urlInfo.host && urlInfo.origin) || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if rootDomains matches
   *
   * @param {string|URL} urlA
   * @param {string|URL} urlB
   */
  static rootDomainsMatch(urlA, urlB) {
    let urlAInfo;
    let urlBInfo;
    try {
      urlAInfo = Util.createOrReturnURL(urlA);
      urlBInfo = Util.createOrReturnURL(urlB);
    } catch (err) {
      return false;
    }

    if (!urlAInfo.hostname || !urlBInfo.hostname) {
      return false;
    }

    // get the string before the tld
    const urlARootDomain = Util.getRootDomain(urlAInfo);
    const urlBRootDomain = Util.getRootDomain(urlBInfo);

    return urlARootDomain === urlBRootDomain;
  }

  /**
   * @param {string} url
   * @param {{numPathParts: number, preserveQuery: boolean, preserveHost: boolean}=} options
   * @return {string}
   */
  static getURLDisplayName(url, options) {
    return Util.getURLDisplayName(new URL(url), options);
  }

  /**
   * Limits data URIs to 100 characters, returns all other strings untouched.
   * @param {string} url
   * @return {string}
   */
  static elideDataURI(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'data:' ? url.slice(0, 100) : url;
    } catch (e) {
      return url;
    }
  }

  /**
   * Determine if url1 equals url2, ignoring URL fragments.
   * @param {string} url1
   * @param {string} url2
   * @return {boolean}
   */
  static equalWithExcludedFragments(url1, url2) {
    [url1, url2] = [url1, url2].map(rewriteChromeInternalUrl);
    try {
      const urla = new URL(url1);
      urla.hash = '';

      const urlb = new URL(url2);
      urlb.hash = '';

      return urla.href === urlb.href;
    } catch (e) {
      return false;
    }
  }

  /**
   * Determine if the url has a protocol that we're able to test
   * @param {string} url
   * @return {boolean}
   */
  static isProtocolAllowed(url) {
    try {
      const parsed = new URL(url);
      return allowedProtocols.includes(parsed.protocol);
    } catch (e) {
      return false;
    }
  }

  /**
   * Is the host localhost-enough to satisfy the "secure context" definition
   * https://github.com/GoogleChrome/lighthouse/pull/11766#discussion_r582340683
   * @param {string} hostname Either a `new URL(url).hostname` or a `networkRequest.parsedUrl.host`
   * @return {boolean}
   */
  static isLikeLocalhost(hostname) {
    // Any hostname terminating in `.localhost` is considered to be local.
    // https://w3c.github.io/webappsec-secure-contexts/#localhost
    // This method doesn't consider IPs that resolve to loopback, IPv6 or other loopback edgecases
    return SECURE_LOCALHOST_DOMAINS.includes(hostname) || hostname.endsWith('.localhost');
  }

  /**
   * @param {NetworkRequest['parsedURL']['scheme']} scheme
   * @return {boolean}
   */
  static isSecureScheme(scheme) {
    return SECURE_SCHEMES.includes(scheme);
  }

  /**
   * Use `NetworkRequest.isNonNetworkRequest(req)` if working with a request.
   * Note: the `protocol` field from CDP can be 'h2', 'http', (not 'https'!) or it'll be url's scheme.
   *   https://source.chromium.org/chromium/chromium/src/+/master:content/browser/devtools/protocol/network_handler.cc;l=598-611;drc=56d4a9a9deb30be73adcee8737c73bcb2a5ab64f
   * However, a `new URL(href).protocol` has a colon suffix.
   *   https://url.spec.whatwg.org/#dom-url-protocol
   * A URL's `scheme` is specced as the `protocol` sans-colon, but isn't exposed on a URL object.
   * This method can take all 3 of these string types as a parameter.
   * @param {NetworkRequest['protocol'] | URL['protocol']} protocol Either a networkRequest's `protocol` per CDP or a `new URL(href).protocol`
   * @return {boolean}
   */
  static isNonNetworkProtocol(protocol) {
    // Strip off any colon
    const urlScheme = protocol.includes(':') ? protocol.slice(0, protocol.indexOf(':')) : protocol;
    return NON_NETWORK_SCHEMES.includes(urlScheme);
  }
}

URLShim.URL = URL;

URLShim.INVALID_URL_DEBUG_STRING =
    'Lighthouse was unable to determine the URL of some script executions. ' +
    'It\'s possible a Chrome extension or other eval\'d code is the source.';

module.exports = URLShim;
