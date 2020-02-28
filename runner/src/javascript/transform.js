
const print = require('./print.js')
const walk = require('./walk.js')
const logger = require('./logger')()

module.exports = function(document, system) {
	
	let tree = transform(document, system)
	code = print(tree)
	logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
	logger('transform').log('tree transformed: ' + code)
	return code
}

function transform(document, system) {
	
	let macros = [
		require('./macros/function.js')(system, document),
		require('./macros/assign.js')(system, document),
		require('./macros/dollar.js')(system, document),
		require('./macros/string.js')(system, document),
		require('./macros/integer.js')(system, document),
		require('./macros/imports.js')(system, document),
		require('./macros/exports.js')(system, document),
		require('./macros/typeof.js')(system, document),
		require('./macros/funcref.js')(system, document),
		require('./macros/callable.js')(system, document),
	]
	walk({ root: document.tree[0], visit: function(node, index, parents) {
		let result = null
		if (node.type == 'expression') {
			macros.every(function(macro) {
				result = macro(node, index, parents)
				return (result == 'invalidate') ? false : true
			})
		}
		return result
	}, reverse: true })
	return document.tree
}
