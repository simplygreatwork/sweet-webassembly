
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	if (node.value.length > 2) {
		if (query.is_type_value(node.value[1], 'symbol', 'equals')) {
			node.value[1].value = node.value[0].value
			node.value[0].value = 'i32.eq'
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}
