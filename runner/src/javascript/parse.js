
const parse = require('../../../parser/configurations/sexpressions-implicit.js')

module.exports = function(code) {
	return parse(code)
}
