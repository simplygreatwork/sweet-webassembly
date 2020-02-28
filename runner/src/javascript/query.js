
function is_type(node, type) {
	
	if (node.type == type) {
		return true
	}
	return false
}

function is_value(node, value) {
	
	if (node.value == value) {
		return true
	}
	return false
}

function is_type_value(node, type, value) {
	
	if (node.type == type) {
		if (node.value == value) {
			return true
		}
	}
	return false
}

function is_expression_length(node, length) {
	
	if (node.type == 'expression') {
		if (node.value.length === length) {
			return true
		}
	}
	return false
}

function is_depth(parents, depth) {
	
	if (parents.length == depth) {
		return true
	}
	return false
}

function last(array) {
	
	return array[array.length - 1]
}

function tail(array, offset) {
	
	return array[array.length - (offset + 1)]
}

function replace(parent, node, node_b) {
	
	let index_ = index(parent, node)
	remove(parent, node)
	insert(parent, node_b, index_)
}

function index(parent, node) {
	
	for (let index = 0, length = parent.value.length; index < length; index++) {
		if (parent.value[index] == node) {
			return index
		}
	}
	return -1
}

function remove(parent, node) {
	
	remove_at(parent, index(parent, node))
}

function remove_at(parent, index) {
	
	if (index > -1) {
		parent.value.splice(index, 1)
	}
}

function append(parent, node) {
	
	parent.value.push(node)
}

function prepend(parent, node) {
	
	parent.value.unshift(node)
}

function insert(parent, node, index) {
	
	parent.value.splice(index, 0, node)
}

function find() {

	return
}

function closest() {
	
	return
}

module.exports = {
	is_expression_length: is_expression_length,
	is_type: is_type,
	is_type_value: is_type_value,
	is_depth: is_depth,
	last: last,
	tail: tail,
	replace: replace,
	index: index,
	remove: remove,
	remove_at: remove_at,
	insert: insert,
	append: append,
	prepend: prepend,
	find: find,
	closest: closest
}