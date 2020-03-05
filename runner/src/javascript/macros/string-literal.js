
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! shared.is_inside_function(state)) return
	if (node.type != 'string') return
	let parent = query.last(parents)
	if (query.is_type_value(parent.value[0], 'symbol', 'string')) return 
	if (query.is_type_value(parent.value[0], 'symbol', 'typeof')) return 
	if (query.is_type_value(parent.value[0], 'symbol', 'funcref')) return
	parent.value[index] = parse(` (string "${node.value}")`)[0]
	if (parent.value[0].value != 'string') return false
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
