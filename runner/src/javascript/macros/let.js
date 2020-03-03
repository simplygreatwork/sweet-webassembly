
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'let')) {
		return
	}
}

module.exports = function(system_, document_) {
    
	system = system_
	document = document_
	return {
		enter
	}
}