
function is_type(node, type) {
	return (node.type == type)
}

function is_value(node, value) {
	return (node.value == value)
}

function is_type_value(node, type, value) {
	return (node.type == type) && (node.value == value)
}

function is_expression_length(node, length) {	
	return (node.type == 'expression') && (node.value.length === length)
}

function is_expression_longer(node, length) {
	return (node.type == 'expression') && (node.value.length > length)
}

function is_depth(parents, depth) {
	return (parents.length == depth)
}

function get_value(node, index) {
	return (index === undefined) ? node.value : node.value[index]
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
	if (index > -1) parent.value.splice(index, 1)
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

function find_type_value(node, type, value) {
	
	let index = -1
	node.value.every(function(each, index_) {
		if (is_type_value(each, type, value)) {
			index = index_
			return false
		} else {
			return true
		}
	})
	return index
}

function closest() {
	return
}

module.exports = {
	is_type: is_type,
	is_type_value: is_type_value,
	is_expression_length,
	is_expression_longer,
	is_depth,
	get_value,
	last,
	tail,
	replace,
	index,
	remove,
	remove_at,
	insert,
	append,
	prepend,
	find_type_value,
	closest
}