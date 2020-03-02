
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	if (! query.is_type(node, 'expression')) return
	let func_node = shared.get_parent_function(parents)
	if (! func_node) return
	let locals = shared.get_locals(func_node)
	if (! locals) return
	node.value.forEach(function(each, index) {
		if (! query.is_type(each, 'symbol')) return
		let value = shared.dollarify(each.value)
		if (! shared.is_local(locals, value)) return
		if (! index > 0) return
		let previous = node.value[index - 1]
		let substitute = true
		substitute = (query.is_type_value(previous, 'symbol', 'param')) ? false : substitute
		substitute = (query.is_type_value(previous, 'symbol', 'result')) ? false : substitute
		substitute = (query.is_type_value(previous, 'symbol', 'local')) ? false : substitute
		substitute = (query.is_type_value(previous, 'symbol', 'get_local')) ? false : substitute
		substitute = (query.is_type_value(previous, 'symbol', 'set_local')) ? false : substitute
		substitute = (query.is_type_value(previous, 'symbol', 'call')) ? false : substitute
		if (substitute) {
			let tree = parse(` (get_local ${value})`)
			query.replace(node, each, tree[0])
		} else {
			each.value = value
		}
	})
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}