
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	if (shared.is_inside_function(parents)) {
		if (query.is_type(node, 'expression')) {
			let first = node.value[0]
			if (! query.is_type_value(first, 'symbol', 'i32.const')) {
				if (! query.is_type_value(first, 'symbol', 'br')) {
					if (! query.is_type_value(first, 'symbol', 'br_if')) {
						node.value.forEach(function(each, index) {
							if (each.type == 'number') {
								let ast = parse(` (i32.const ${each.value})`)
								node.value[index] = ast[0]
							}
						})
					}
				}
			}
		}
	}
}

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}