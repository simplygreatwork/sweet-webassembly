
const query = require('../query')

let system = null
let document = null

function transform(node, index, parents) {
	
	if (node.value.length === 2) {
		let first = node.value[0]
		if (query.is_type_value(first, 'symbol', 'import')) {
			let second = node.value[1]
			if (second.type == 'string') {
				query.remove(parents[0], node)
			}
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}
