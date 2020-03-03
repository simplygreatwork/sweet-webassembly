
const query = require('../query')

let system = null
let document = null

function enter(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'export')) {
		let second = node.value[1]
		if (query.is_type_value(first, 'symbol', 'all')) {
			let second = node.value[1]
			query.remove(parents[0], node)
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
