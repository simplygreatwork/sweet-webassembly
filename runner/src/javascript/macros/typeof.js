
const query = require('../query')

let system = null
let document = null
let counter = 1;
let types = {}

function enter(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'typeof')) {
		let second = node.value[1]
		if (types[second.value] === undefined) {
			types[second.value] = counter;
			if (false) console.log('type ' + second.value + ' = ' + counter);
			counter++
		}
		first.value = 'i32.const'
		second.type = 'number'
		second.value = types[second.value]
	}
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}
