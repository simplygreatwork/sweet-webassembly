
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (query.is_type(node, 'expression')) {
		if (shared.is_inside_function(state)) {
			let first = node.value[0]
			if (query.is_type_value(first, 'symbol', 'i32.const')) return
			if (query.is_type_value(first, 'symbol', 'br')) return
			if (query.is_type_value(first, 'symbol', 'br_if')) return
			node.value.forEach(function(each, index) {
				if (each.type == 'number') {
					node.value[index] = { type: 'expression', value: [
						{ type: 'symbol', value: 'i32.const' },
						{ type: 'number', value: each.value, whitespace: ' ' }
					]}
				}
			})
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