var URL = require('url').URL;

/**
 * Trims the white space from the start and end of the line.
 *
 * If the line is an array it will strip the white space from
 * the start and end of each element of the array.
 *
 * @param  {string|Array} line
 * @return {string|Array}
 * @private
 */
function trimLine(line) {
	if (!line) {
		return null;
	}

	if (Array.isArray(line)) {
		return line.map(trimLine);
	}

	return String(line).trim();
}

/**
 * Remove comments from lines
 *
 * @param {string} line
 * @return {string}
 * @private
 */
function removeComments(line) {
	var commentStartIndex = line.indexOf('#');
	if (commentStartIndex > -1) {
		return line.substr(0, commentStartIndex);
	}

	return line;
}

/**
 * Splits a line at the first occurrence of :
 *
 * @param  {string} line
 * @return {Array.<string>}
 * @private
 */
function splitLine(line) {
	var idx = String(line).indexOf(':');

	if (!line || idx < 0) {
		return null;
	}

	return [line.slice(0, idx), line.slice(idx + 1)];
}

/**
 * Normalises the user-agent string by converting it to
 * lower case and removing any version numbers.
 *
 * @param  {string} userAgent
 * @return {string}
 * @private
 */
function formatUserAgent(userAgent) {
	var formattedUserAgent = userAgent.toLowerCase();

	// Strip the version number from robot/1.0 user agents
	var idx = formattedUserAgent.indexOf('/');
	if (idx > -1) {
		formattedUserAgent = formattedUserAgent.substr(0, idx);
	}

	return formattedUserAgent.trim();
}

/**
 * Normalises the URL encoding of a path by encoding
 * unicode characters.
 *
 * @param {string} path
 * @return {string}
 * @private
 */
function normaliseEncoding(path) {
	try {
		return urlEncodeToUpper(encodeURI(path).replace(/%25/g, '%'));
	} catch (e) {
		return path;
	}
}

/**
 * Convert URL encodings to support case.
 *
 * e.g.: %2a%ef becomes %2A%EF
 *
 * @param {string} path
 * @return {string}
 * @private
 */
function urlEncodeToUpper(path) {
	return path.replace(/%[0-9a-fA-F]{2}/g, function (match) {
		return match.toUpperCase();
	});
}

/**
 * Matches a pattern with the specified path
 *
 * Uses same algorithm to match patterns as the Google implementation in
 * google/robotstxt so it should be consistent with the spec.
 *
 * @see https://github.com/google/robotstxt/blob/f465f0ede81099dd8bc4aeb2966b3a892bd488b3/robots.cc#L74
 * @param {string} pattern
 * @param {string} path
 * @return {boolean}
 * @private
 */
function matches(pattern, path) {
	// I've added extra comments to try make this easier to understand

	// Stores the lengths of all the current matching substrings.
	// Maximum number of possible matching lengths is every length in path plus
	// 1 to handle 0 length too (if pattern starts with * which is zero or more)
	var matchingLengths = new Array(path.length + 1);
	var numMatchingLengths = 1;

	// Initially longest match is 0
	matchingLengths[0] = 0;

	for (var p = 0; p < pattern.length; p++) {
		// If $ is at the end of pattern then we must match the whole path.
		// Which is true if the longest matching length matches path length
		if (pattern[p] === '$' && p + 1 === pattern.length) {
			return matchingLengths[numMatchingLengths - 1] === path.length;
		}

		// Handle wildcards
		if (pattern[p] == '*') {
			// Wildcard so all substrings minus the current smallest matching
			// length are matches
			numMatchingLengths = path.length - matchingLengths[0] + 1;

			// Update matching lengths to include the smallest all the way up
			// to numMatchingLengths
			// Don't update smallest possible match as * matches zero or more
			// so the smallest current match is also valid
			for (var i = 1; i < numMatchingLengths; i++) {
				matchingLengths[i] = matchingLengths[i - 1] + 1;
			}
		} else {
			// Check the char at the matching length matches the pattern, if it
			// does increment it and add it as a valid length, ignore if not.
			var numMatches = 0;
			for (var i = 0; i < numMatchingLengths; i++) {
				if (
					matchingLengths[i] < path.length &&
					path[matchingLengths[i]] === pattern[p]
				) {
					matchingLengths[numMatches++] = matchingLengths[i] + 1;
				}
			}

			// No paths matched the current pattern char so not a match
			if (numMatches == 0) {
				return false;
			}

			numMatchingLengths = numMatches;
		}
	}

	return true;
}

function parseRobots(contents, robots) {
	var newlineRegex = /\r\n|\r|\n/;
	var lines = contents
		.split(newlineRegex)
		.map(removeComments)
		.map(splitLine)
		.map(trimLine);

	var currentUserAgents = [];
	var isNoneUserAgentState = true;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		if (!line || !line[0]) {
			continue;
		}

		switch (line[0].toLowerCase()) {
			case 'user-agent':
				if (isNoneUserAgentState) {
					currentUserAgents.length = 0;
				}

				if (line[1]) {
					currentUserAgents.push(formatUserAgent(line[1]));
				}
				break;
			case 'disallow':
				robots.addRule(currentUserAgents, line[1], false, i + 1);
				break;
			case 'allow':
				robots.addRule(currentUserAgents, line[1], true, i + 1);
				break;
			case 'crawl-delay':
				robots.setCrawlDelay(currentUserAgents, line[1]);
				break;
			case 'sitemap':
				if (line[1]) {
					robots.addSitemap(line[1]);
				}
				break;
			case 'host':
				if (line[1]) {
					robots.setPreferredHost(line[1].toLowerCase());
				}
				break;
		}

		isNoneUserAgentState = line[0].toLowerCase() !== 'user-agent';
	}
}

/**
 * Returns if a pattern is allowed by the specified rules.
 *
 * @param  {string}  path
 * @param  {Array.<Object>}  rules
 * @return {Object?}
 * @private
 */
function findRule(path, rules) {
	var matchedRule = null;

	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];

		if (!matches(rule.pattern, path)) {
			continue;
		}

		// The longest matching rule takes precedence
		// If rules are the same length then allow takes precedence
		if (!matchedRule || rule.pattern.length > matchedRule.pattern.length) {
			matchedRule = rule;
		} else if (
			rule.pattern.length == matchedRule.pattern.length &&
			rule.allow &&
			!matchedRule.allow
		) {
			matchedRule = rule;
		}
	}

	return matchedRule;
}

/**
 * Converts provided string into an URL object.
 *
 * Will return null if provided string is not a valid URL.
 *
 * @param {string} url
 * @return {?URL}
 * @private
 */
function parseUrl(url) {
	try {
		// Specify a URL to be used with relative paths
		// Using non-existent subdomain so can never cause conflict unless
		// trying to crawl it but doesn't exist and even if tried worst that can
		// happen is it allows relative URLs on it.
		return new URL(url, 'http://robots-relative.samclarke.com/');
	} catch (e) {
		return null;
	}
}

function Robots(url, contents) {
	this._url = parseUrl(url) || {};
	this._url.port = this._url.port || 80;

	this._rules = Object.create(null);
	this._sitemaps = [];
	this._preferredHost = null;

	parseRobots(contents || '', this);
}

/**
 * Adds the specified allow/deny rule to the rules
 * for the specified user-agents.
 *
 * @param {Array.<string>} userAgents
 * @param {string} pattern
 * @param {boolean} allow
 * @param {number} [lineNumber] Should use 1-based indexing
 */
Robots.prototype.addRule = function (userAgents, pattern, allow, lineNumber) {
	var rules = this._rules;

	userAgents.forEach(function (userAgent) {
		rules[userAgent] = rules[userAgent] || [];

		if (!pattern) {
			return;
		}

		rules[userAgent].push({
			pattern: normaliseEncoding(pattern),
			allow: allow,
			lineNumber: lineNumber
		});
	});
};

/**
 * Adds the specified delay to the specified user agents.
 *
 * @param {Array.<string>} userAgents
 * @param {string} delayStr
 */
Robots.prototype.setCrawlDelay = function (userAgents, delayStr) {
	var rules = this._rules;
	var delay = Number(delayStr);

	userAgents.forEach(function (userAgent) {
		rules[userAgent] = rules[userAgent] || [];

		if (isNaN(delay)) {
			return;
		}

		rules[userAgent].crawlDelay = delay;
	});
};

/**
 * Add a sitemap
 *
 * @param {string} url
 */
Robots.prototype.addSitemap = function (url) {
	this._sitemaps.push(url);
};

/**
 * Sets the preferred host name
 *
 * @param {string} url
 */
Robots.prototype.setPreferredHost = function (url) {
	this._preferredHost = url;
};

Robots.prototype._getRule = function (url, ua) {
	var parsedUrl = parseUrl(url) || {};
	var userAgent = formatUserAgent(ua || '*');

	parsedUrl.port = parsedUrl.port || 80;

	// The base URL must match otherwise this robots.txt is not valid for it.
	if (
		parsedUrl.protocol !== this._url.protocol ||
		parsedUrl.hostname !== this._url.hostname ||
		parsedUrl.port !== this._url.port
	) {
		return;
	}

	var rules = this._rules[userAgent] || this._rules['*'] || [];
	var path = urlEncodeToUpper(parsedUrl.pathname + parsedUrl.search);
	var rule = findRule(path, rules);

	return rule;
};

/**
 * Returns true if allowed, false if not allowed.
 *
 * Will return undefined if the URL is not valid for
 * this robots.txt file.
 *
 * @param  {string}  url
 * @param  {string?}  ua
 * @return {boolean?}
 */
Robots.prototype.isAllowed = function (url, ua) {
	var rule = this._getRule(url, ua);

	if (typeof rule === 'undefined') {
		return;
	}

	return !rule || rule.allow;
};

/**
 * Returns the line number of the matching directive for the specified
 * URL and user-agent if any.
 *
 * The line numbers start at 1 and go up (1-based indexing).
 *
 * Return -1 if there is no matching directive. If a rule is manually
 * added without a lineNumber then this will return undefined for that
 * rule.
 *
 * @param  {string}  url
 * @param  {string?}  ua
 * @return {number?}
 */
Robots.prototype.getMatchingLineNumber = function (url, ua) {
	var rule = this._getRule(url, ua);

	return rule ? rule.lineNumber : -1;
};

/**
 * Returns the opposite of isAllowed()
 *
 * @param  {string}  url
 * @param  {string}  ua
 * @return {boolean}
 */
Robots.prototype.isDisallowed = function (url, ua) {
	return !this.isAllowed(url, ua);
};

/**
 * Gets the crawl delay if there is one.
 *
 * Will return undefined if there is no crawl delay set.
 *
 * @param  {string} ua
 * @return {number?}
 */
Robots.prototype.getCrawlDelay = function (ua) {
	var userAgent = formatUserAgent(ua || '*');

	return (this._rules[userAgent] || this._rules['*'] || {}).crawlDelay;
};

/**
 * Returns the preferred host if there is one.
 *
 * @return {string?}
 */
Robots.prototype.getPreferredHost = function () {
	return this._preferredHost;
};

/**
 * Returns an array of sitemap URLs if there are any.
 *
 * @return {Array.<string>}
 */
Robots.prototype.getSitemaps = function () {
	return this._sitemaps.slice(0);
};

module.exports = Robots;
