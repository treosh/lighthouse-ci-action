var Robots = require('./Robots');

module.exports = function (url, contents) {
	return new Robots(url, contents);
};