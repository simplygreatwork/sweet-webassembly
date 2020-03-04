
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_expression_longer(node, 2)) return
	if (! query.is_type_value(node.value[0], 'symbol', 'func')) return
	if (! query.is_type_value(node.value[2], 'symbol', 'accepts')) return
	node.value.every(function(each, index) {
		if (index > 2) {
			if (query.is_type(each, 'expression')) {
				return false
			} else if (query.is_type(each, 'whitespace')) {			// whitespace should always be folded already
				return true														// but encountered anyway
			} else {
				let value = shared.dollarify(each.value)
				node.value[index] = parse(` (param ${value} i32)`)[0]
				return true
			}
		} else {
			return true
		}
	})
	node.value.splice(2, 1)
}

function exit(node, index, parents, state) {
	
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter,
		exit
	}
}
