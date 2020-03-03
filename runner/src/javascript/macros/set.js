
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! shared.is_inside_function(state)) return
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'set')) {
		first.value = 'set_local'
	}
	if (query.is_type_value(first, 'symbol', 'set_local')) {
		let second = node.value[1]
		second.value = shared.dollarify(second.value)
		if (query.is_expression_longer(node, 2)) {
			let third = node.value[2]
			if (query.is_type_value(third, 'symbol', 'to')) {
				query.remove(node, third)
			}
		}
		return declare(second.value, parents, state)
	}
}

function declare(value, parents, state) {
	
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