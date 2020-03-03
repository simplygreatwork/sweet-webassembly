
const query = require('../query.js')
const shared = require('./shared.js')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'function')) {
		first.value = 'func'			// review: this conversion would need to occur before the linking phase anyway
	}
	if (query.is_type_value(first, 'symbol', 'func')) {
		if (query.is_expression_longer(node, 1)) {
			let second = node.value[1]
			if ((second.value) && (typeof second.value === 'string')) {
				state.func = node
				state.locals = shared.find_locals(state)
				second.value = shared.dollarify(second.value)
			}
		}
	}
}

function exit(node, index, parents, state) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'func')) {
		if (query.is_expression_longer(node, 1)) {
			let second = node.value[1]
			if ((second.value) && (typeof second.value === 'string')) {
				state.func = null
			}
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter,
		exit
	}
}
