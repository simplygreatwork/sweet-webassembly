
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! shared.is_inside_function(state)) return
	if (query.is_type_value(node.value[0], 'symbol', 'i32.const')) return
	if (query.is_type_value(node.value[0], 'symbol', 'br')) return
	if (query.is_type_value(node.value[0], 'symbol', 'br_if')) return
	node.value.forEach(function(each, index) {
		if (each.type == 'number') {
			node.value[index] = parse(` (i32.const ${each.value})`)[0]
		}
	})
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
