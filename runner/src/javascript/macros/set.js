
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	let result = null
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'set')) {
		first.value = 'set_local'
	}
	if (query.is_type_value(first, 'symbol', 'set_local')) {
		let second = node.value[1]
		if (second.value.charAt(0) != '$') {
			second.value = '$' + second.value
		}
		if (node.value.length > 2) {
			let third = node.value[2]
			if (query.is_type_value(third, 'symbol', 'to')) {
				query.remove(node, third)
			}
		}
		result = declare_if_missing(second.value, parents)
	}
	return result
}

function declare_if_missing(value, parents) {
	
	let found = null
	let func_node = shared.get_parent_function(parents)
	let locals = shared.get_locals(func_node)
	locals.elements.every(function(each, index) {
		if (each.value[1].value == value) {
			found = each
			return false
		} else {
			return true
		}
	})
	if (! found) {
		let tree = parse (`
		(local ${value} i32)`)
		query.insert(func_node, tree[0], locals.offset)
		system.fire('add', tree[0])
	}
	return (! found) ? 'invalidate' : null
}

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}