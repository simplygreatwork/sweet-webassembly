
const parse = require('../../../parser/configurations/sexpressions.js')

module.exports = function(code) {
	return parse(code)
}
