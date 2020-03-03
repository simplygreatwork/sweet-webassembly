
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	let result = null
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'set')) {
		first.value = 'set_local'
	}
	if (query.is_type_value(first, 'symbol', 'set_local')) {
		let second = node.value[1]
		second.value = shared.dollarify(second.value)
		if (node.value.length > 2) {
			let third = node.value[2]
			if (query.is_type_value(third, 'symbol', 'to')) {
				query.remove(node, third)
			}
		}
		result = declare_if_missing(second.value, parents, state)
	}
	return result
}

function declare_if_missing(value, parents, state) {
	
	let found = shared.is_local(state, value)
	if (! found) {
		let tree = parse (`
		(local ${value} i32)
		`)[0]
		query.insert(state.func, tree, state.locals.offset)
		system.fire('insert', tree)
		state.locals = shared.find_locals(state)
	}
	return (! found) ? false : undefined
}

module.exports = function(system_, document_) {

	system = system_
	document = document_
	return {
		enter
	}
}