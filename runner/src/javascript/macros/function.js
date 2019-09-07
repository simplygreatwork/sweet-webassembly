
const query = require('../query.js')

module.exports = function(node, index, parents) {
	
	let first = node.value[0]
	if (first.type == 'symbol') {
		if (first.value == 'function') {
			first.value = 'func'
		}
	}
}
