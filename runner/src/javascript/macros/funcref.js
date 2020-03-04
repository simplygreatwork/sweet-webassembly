
const query = require('../query')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (! query.is_type(node, 'expression')) return
	if (query.is_type_value(node.value[0], 'symbol', 'funcref')) {
		let first = node.value[0]
		let second = node.value[1]
		let third = node.value[2]
		let id = system.table.find_function_id(second.value, third.value)
		first.type = 'symbol'
		first.value = 'i32.const'
		second.type = 'number'
		second.value = id
		node.value.pop()
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}