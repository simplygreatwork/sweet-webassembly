
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function enter(node, index, parents) {
	
	if (shared.is_inside_function(parents)) {
		if (query.is_type(node, 'expression')) {
			if (query.is_expression_longer(node, 2)) {
				let indices = query.find_type_value(node, 'symbol', 'and').reverse()
				indices.forEach(function(index) {
					node.value.splice(index - 1, 0, node.value.splice(index, 1))
					node.value[index - 1].type = 'symbol'
					node.value[index - 1].value = 'i32.and'
					if (query.is_expression_longer(node, 3)) {
						let expression = parse(` ()`)[0]
						expression.value.push(...node.value.splice(index - 1, 3))
						node.value.splice(index - 1, 0, expression)
					}
				})
			}
		}
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
