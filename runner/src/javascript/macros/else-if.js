
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

// goal: no keyword "then": all expressions inside of "if" but after (if (cond)) are shifted into (if (then))
// goal: keyword "else" is a sibling of "if" - else contents are moved into (if (else))
// note: "else if" could probably be part of else.js not a separate else-if.js

function enter(node, index, parents) {
	
	if (query.is_type_value(node.value[0], 'symbol', 'else')) {
		if (query.is_type_value(node.value[1], 'symbol', 'if')) {
			return
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
