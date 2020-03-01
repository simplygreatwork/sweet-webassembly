
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

// idea: use emitter and change events

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
	
	let found = false
	let node_func = shared.get_parent_function(parents)
	node_func.value.every(function(each, index) {
		if (index < 2) {
			return true
		} else {
			let candidate = false
			let first = each.value[0]
			if (first.value === undefined) return true
			if (query.is_type_value(first, 'symbol', 'param')) {
				candidate = true
				if (each.value[1].value == value) found = true
			} else if (query.is_type_value(first, 'symbol', 'result')) {
				candidate = true
			} else if (query.is_type_value(first, 'symbol', 'local')) {
				candidate = true
				if (each.value[1].value == value) found = true
			}
			if ((candidate == false) && (found === false)) {
				let ast = parse(`\n(local ${value} i32)`)
				query.insert(node_func, ast[0], index)
			}
			return candidate
		}
	})
	return (found === false) ? 'invalidate' : null
}

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}