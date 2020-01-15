
const print = require('./print.js')
const walk = require('./walk.js')
const logger = require('./logger')()

module.exports = function(tree, system) {
	
	tree = transform(tree, system)
	code = print(tree)
	logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
	logger('transform').log('tree transformed: ' + code)
	return code
}

function transform(tree, system) {
	
	let macros = [
		require('./macros/function.js'),
		require('./macros/string.js'),
		require('./macros/swap.js'),
		require('./macros/imports.js'),
		require('./macros/exports.js'),
		require('./macros/typeof.js'),
		require('./macros/funcref.js')(system)
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
