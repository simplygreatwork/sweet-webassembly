
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')

function transform(node, index, parents) {
	
	if (node.value.length === 2) {
		let first = node.value[0]
		if (first.type == 'symbol') {
			if (first.value == 'import') {
				let second = node.value[1]
				if (second.type == 'string') {
					query.remove(parents[0], node)
				}
			}
		}
	}
}

module.exports = transform