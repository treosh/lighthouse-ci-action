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
	} catch(e) {
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
 * Converts the pattern into a regexp if it is a wildcard
 * pattern.
 *
 * Returns a string if the pattern isn't a wildcard pattern
 *
 * @param  {string} pattern
 * @return {string|RegExp}
 * @private
 */
function parsePattern(pattern) {
	var regexSpecialChars = /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g;
	// Treat consecutive wildcards as one (#12)
	var wildCardPattern = /\*+/g;
	var endOfLinePattern = /\\\$$/;

	pattern = normaliseEncoding(pattern)

	if (pattern.indexOf('*') < 0 && pattern.indexOf('$') < 0) {
		return pattern;
	}

	pattern = pattern
		.replace(regexSpecialChars, '\\$&')
		.replace(wildCardPattern, '(?:.*)')
		.replace(endOfLinePattern, '$');

	return new RegExp(pattern);
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
	for (var i=0; i < lines.length; i++) {
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
   var matchingRule = null;

   for (var i=0; i < rules.length; i++) {
	   var rule = rules[i];

	   if (typeof rule.pattern === 'string') {
		   if (path.indexOf(rule.pattern) !== 0) {
			   continue;
		   }

		   // The longest matching rule takes precedence
		   if (!matchingRule || rule.pattern.length > matchingRule.pattern.length) {
			   matchingRule = rule;
		   }
	   // The first matching pattern takes precedence
	   // over all other rules including other patterns
	   } else if (rule.pattern.test(path)) {
		   return rule;
	   }
   }

   return matchingRule;
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
		return new URL(url);
	} catch(e) {
		return null;
	}
}


function Robots(url, contents) {
	this._url = parseUrl(url) || {};
	this._url.port = this._url.port || 80;

	this._rules = {};
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
			pattern: parsePattern(pattern),
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

	parsedUrl.port = parsedUrl.port || '80';

	// The base URL must match otherwise this robots.txt is not valid for it.
	if (parsedUrl.protocol !== this._url.protocol ||
		parsedUrl.hostname !== this._url.hostname ||
		parsedUrl.port !== this._url.port) {
		return;
	}

	var rules = this._rules[userAgent] || this._rules['*'] || [];
	var path = urlEncodeToUpper(parsedUrl.pathname + parsedUrl.search)
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
