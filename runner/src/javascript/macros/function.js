
const query = require('../query.js')

let system = null
let document = null

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'function')) {
		first.value = 'func'					// todo: this conversion would need to occur before the transformation phase
	}
	if (query.is_type_value(first, 'symbol', 'func')) {
		let second = node.value[1]
		if ((second) && (second.value) && (typeof second.value === 'string')) {
			if (second.value.charAt(0) != '$') {
				second.value = '$' + second.value
			}
		}
	}
}

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}
