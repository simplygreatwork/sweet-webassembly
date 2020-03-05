
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (query.is_type_value(node, 'symbol', 'false')) {
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