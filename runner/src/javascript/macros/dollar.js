
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'call')) {
		let second = node.value[1]
		rewrite(second, index, parents, state)
	} else if (query.is_type_value(first, 'symbol', 'funcref')) {
		let second = node.value[1]
		rewrite(second, index, parents, state)
	} else {
		rewrite(first, index, parents, state)
	}
}

function rewrite(node, index, parents, state) {
	
	if (shared.is_callable(document, '$' + node.value)) {
		node.value = shared.dollarify(node.value)
	} else {
		if (! shared.is_inside_function(state)) return
		if (shared.is_local(state, node.value)) {
			if (index > 0) {
				node.value = shared.dollarify(node.value)
			}
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}