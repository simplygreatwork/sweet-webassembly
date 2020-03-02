
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

// goal: no keyword "then": all expressions inside of "if" but after (if (cond)) are shifted into (if (then))
// goal: keyword "else" is a sibling of "if" - else contents are moved into (if (else))

function transform(node, index, parents) {
	
	if (query.is_type_value(node.value[0], 'symbol', 'if')) {
		if (query.is_type(node.value[1], 'expression')) {
			if (query.is_type(node.value[2], 'expression')) {
				if (query.is_type_value(node.value[2].value[0], 'symbol', 'then')) {
					return
				}
			}
		}
		let condition = get_condition(node, index, parents)
		let then = get_then(node, index, parents)
		let tree = parse(`(if)`)
		tree[0].value.push(condition)
		tree[0].value.push(then)
		query.replace(query.last(parents), node, tree[0])
		return 'invalidate'
	}
}

function get_condition(node, index, parents) {
	
	let result
	if (query.is_type(node.value[1], 'expression')) {
		result = node.value[1]
	} else {
		result = parse(` ()`)[0]
		node.value.filter(function(each) {
			if (query.is_type(each, 'expression')) {
				return false
			} else if (query.is_type_value(each, 'symbol', 'if')) {
				return false
			} else {
				return true
			}
		})
		.forEach(function(each) {
			result.value.push(each)
		})
	}
	return result
}

function get_then(node, index, parents) {
	
	let result
	let expressions
	if (query.is_type(node.value[1], 'expression')) {
		if (query.is_type(node.value[2], 'expression')) {
			if (query.is_type_value(node.value[2].value[0], 'symbol', 'then')) {
				return node.value[2]			// "then" clause exists already, do not create
			}
		}
		expressions = node.value.filter(function(each, index) {
			if (query.is_type_value(each, 'symbol', 'if')) {
				return false
			} else if (index <= 1) {
				return false
			} else {
				return true
			}
		})
	} else {
		expressions = node.value.filter(function(each, index) {
			return (query.is_type(each, 'expression'))
		})
	}
	result = parse(` (then)`)[0]
	expressions.forEach(function(each) {
		result.value.push(each)
	})
	return result
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}
