
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {

	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'load')) return
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
