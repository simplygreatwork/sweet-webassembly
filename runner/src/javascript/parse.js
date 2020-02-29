
const implicit = require('../../../parser/configurations/sexpressions-implicit.js')
const explicit = require('../../../parser/configurations/sexpressions.js')

module.exports = function(code) {
	
	return (code.split('/n').length == 1) ? explicit(code) : implicit(code)
}
