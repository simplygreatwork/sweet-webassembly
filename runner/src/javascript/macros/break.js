
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {

	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'break')) return
	node.value[0].value = 'br'
	node.value.splice(1, 0, {
		type: 'symbol',
		value: '2',
		whitespace: ' '
	})
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
