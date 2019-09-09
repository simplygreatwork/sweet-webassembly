
const print = require('./print.js')
const walk = require('./walk.js')
const logger = require('./logger')()

module.exports = function(tree, options) {
	
	tree = transform(tree)
	code = print(tree)
	logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
	logger('transform').log('tree transformed: ' + code)
	return code
}

function transform(tree) {
	
	let macros = [
		require('./macros/function.js'),
		require('./macros/string.js'),
		require('./macros/swap.js'),
		require('./macros/imports.js'),
		require('./macros/exports.js')
	]
	walk({ root: tree[0], visit: function(node, index, parents) {
		if (node.type == 'expression') {
			macros.forEach(function(macro) {
				macro(node, index, parents)
			})
		}
	}, reverse: true })
	return tree
}
