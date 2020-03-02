
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
	
	let macros =  system.macros.map(function(each) {
		return each(system, document)
	})
	let off = system.bus.on('insert', function(data) {
		if (false) logger('transform').log(console.log('inserted: ' + data))
	})
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
	off()
	return document.tree
}
