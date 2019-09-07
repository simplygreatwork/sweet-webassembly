
var p = require('../parsers/core');
const whitespace = require('../parsers/whitespace')
const newline = require('../parsers/newline')
const number = require('../parsers/number')
const boolean = require('../parsers/boolean')
const string = require('../parsers/string')
const symbol = require('../parsers/symbol')
const other = require('../parsers/other')

module.exports = function() {
	
	return p.alt([
		whitespace(),
		// newline(),
		boolean(),
		number(),
		string(),
		symbol(),
		// other(),
	], function(value) {
		return value.alt		// todo: emit the atom here
	})
}
