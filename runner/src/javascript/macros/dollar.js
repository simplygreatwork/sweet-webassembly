
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')
const shared = require('./shared.js')

let system = null
let document = null

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'call')) {
		let second = node.value[1]
		rewrite(second)
	} else if (query.is_type_value(first, 'symbol', 'funcref')) {
		let second = node.value[1]
		rewrite(second)
	} else {
		rewrite(first)
	}
}

function rewrite(node) {
	
	if (shared.is_callable(document, '$' + node.value)) {
		node.value = '$' + node.value
	}
}

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}