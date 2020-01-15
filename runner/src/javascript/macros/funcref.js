
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')

let system = null

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (first.type == 'symbol') {
		if (first.value == 'funcref') {
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
}

module.exports = function(system_) {
    
    system = system_
    return transform
}