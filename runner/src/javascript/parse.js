
let parse = require('../../../parser/configurations/sexpressions-implicit.js')
if (false) parse = require('../../../parser/configurations/sexpressions.js')

module.exports = function(code) {
	return parse(code)
}
