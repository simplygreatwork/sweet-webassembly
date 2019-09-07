
const print = require('./print.js')
const walk = require('./walk.js')
const logger = require('./logger')()

module.exports = function(ast, options) {
	
	ast = transform(ast)
	code = print(ast)
	logger('transform').log('ast: ' + JSON.stringify(ast, null, 2))
	logger('transform').log('transformed: ' + code)
	return code
}

function transform(ast) {
	
	let macros = [
		require('./macros/function.js'),
		require('./macros/string.js'),
		require('./macros/swap.js'),
		require('./macros/imports.js'),
		require('./macros/exports.js')
	]
	walk({ root: ast[0], visit: function(node, index, parents) {
		if (node.type == 'expression') {
			macros.forEach(function(macro) {
				macro(node, index, parents)
			})
		}
	}, reverse: true })
	return ast
}
