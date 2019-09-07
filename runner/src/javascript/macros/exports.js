
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (first.type == 'symbol') {
		if (first.value == 'export') {
			let second = node.value[1]
			if (second.type == 'symbol') {
				if (second.value == 'all') {
					query.remove(parents[0], node)
				}
			}
		}
	}
}

module.exports = transform