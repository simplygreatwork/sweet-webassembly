
const query = require('../query.js')

module.exports = function(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'function')) {
		first.value = 'func'					// todo: this conversion needs to occur before transformation phase
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
