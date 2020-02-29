
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type(first, 'symbol')) {
		if (shared.is_callable(document, first.value)) {
			node.value.unshift({
				type: 'whitespace',
				value: ' '
			})
			node.value.unshift({
				type: 'symbol',
				value: 'call'
			})
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}