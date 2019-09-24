var fs = require('fs');

var source = "var jsonlint = (function(){var require=true,module=false;var exports={};" +
  fs.readFileSync(__dirname+'/../lib/doug-json-parse.js', 'utf8') +
  fs.readFileSync(__dirname+'/../lib/jsonlint.js', 'utf8') +
  "return exports;})();if(typeof module === 'object' && module.exports) module.exports = jsonlint;";

console.log(source);
