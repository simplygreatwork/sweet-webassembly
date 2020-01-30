
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')

let system = null
let document = null

function transform(node, index, parents) {
	
	if (document.id == 'callable') {
		let first = node.value[0]
		if (first.type == 'symbol') {
			if (is_callable(document, first.value)) {
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
}

function is_callable(document, symbol) {
	
	let result = false
	document.functions.forEach(function(node) {
		let second = node.value[1]
		if (second.type == 'symbol') {
			if (second.value == symbol) {
				result = true
			}
		}
	})
	Object.keys(document.function_imports).forEach(function(module_) {
		Object.keys(document.function_imports[module_]).forEach(function(key) {
			let node = document.function_imports[module_][key]
			let fourth = node.value[3]
			if (fourth.value[0].value == 'func') {
				if (key == symbol) {
					result = true
				}
			}
		}.bind(this))
	}.bind(this))
	return result
}

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}