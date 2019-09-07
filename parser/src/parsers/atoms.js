
var p = require('../parsers/core');
const whitespace = require('../parsers/whitespace')
const newline = require('../parsers/newline')
const number = require('../parsers/number')
const boolean = require('../parsers/boolean')
const string = require('../parsers/string')
const symbol = require('../parsers/symbol')
const other = require('../parsers/other')

module.exports = function() {
	
	return p.rep (
		atom(),
		1,
		function(value) {
			return value.rep.filter(function(each) {
				return each.type != 'whitespace'
			});
		}
	)
}
