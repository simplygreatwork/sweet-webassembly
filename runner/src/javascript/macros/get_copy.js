
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! shared.is_inside_function(state)) return
	if (! query.is_type(node, 'symbol')) return
	let value = shared.dollarify(node.value)
	if (! shared.is_local(state, value)) return
	let parent = query.last(parents)
	let previous = parent.value[index - 1]
	if (previous) {

	}
	let substitute = true
	substitute = (query.is_type_value(previous, 'symbol', 'param')) ? false : substitute
	substitute = (query.is_type_value(previous, 'symbol', 'result')) ? false : substitute
	substitute = (query.is_type_value(previous, 'symbol', 'local')) ? false : substitute
	substitute = (query.is_type_value(previous, 'symbol', 'get_local')) ? false : substitute
	substitute = (query.is_type_value(previous, 'symbol', 'set_local')) ? false : substitute
	substitute = (query.is_type_value(previous, 'symbol', 'call')) ? false : substitute
	if (substitute) {
		console.log('substitute: ' + substitute)
		let tree = parse(` (get_local ${value})`)[0]
		query.replace(parent, node, tree)
	} else {
		node.value = value
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}