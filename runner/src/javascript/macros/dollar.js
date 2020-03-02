
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

// todo: cache locals but invalidate the cache when adding loop iterators

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'call')) {
		let second = node.value[1]
		rewrite(second, index, parents)
	} else if (query.is_type_value(first, 'symbol', 'funcref')) {
		let second = node.value[1]
		rewrite(second, index, parents)
	} else {
		rewrite(first, index, parents)
	}
}

function rewrite(node, index, parents) {
	
	if (shared.is_callable(document, '$' + node.value)) {
		node.value = shared.dollarify(node.value)
	} else {
		let func_node = shared.get_parent_function(parents)
		if (! func_node) return
		let locals = shared.get_locals(func_node)
		if (! locals) return
		if (shared.is_local(locals, node.value)) {
			if (index > 0) {
				node.value = shared.dollarify(node.value)
			}
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}