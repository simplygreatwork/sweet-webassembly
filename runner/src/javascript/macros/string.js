
const parse = require('../parse')
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null
let string_counter = 0

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (query.is_type_value(node.value[0], 'symbol', 'string')) {
		let string = node.value[1].value
		let func_name = function_new(parents[0], string)
		string_call(node, index, parents, func_name)
	} else {
		if (! shared.is_inside_function(state)) return
		if (query.is_type_value(node.value[0], 'symbol', 'typeof')) return 
		if (query.is_type_value(node.value[0], 'symbol', 'funcref')) return
		node.value.forEach(function(each, index) {
			if (query.is_type(each, 'string')) {
				let tree = parse(`(string "${each.value}")`)[0]
				node.value[index] = tree
			}
		})
	}
}

function string_call(node, index, parents, func_name) {
	
	let tree = parse(` (call ${func_name})`)
	query.replace(query.last(parents), node, tree[0])
}

function function_new(node, string) {
	
	let func_name = '$string_static_' + (++string_counter)
	let ast = parse(
		`\n\n\t(func ${func_name} (result i32)
		\n\t\t(local $string i32)
		\n\t\t(set_local $string (call $string_new (i32.const ${string.length})))
		\n${string_set_chars(string)}
		\n\t\t(get_local $string)
	)`)
	query.append(node, ast[0])
	return func_name
}

function string_set_chars(string) {
	
	let result = []
	string.split('').forEach(function(char, index) {
		let char_code = string.charCodeAt(index)
		result.push(`\t\t(call $string_set_char (get_local $string) (i32.const ${index}) (i32.const ${char_code}))`)
	})
	return result.join('\n')
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter
	}
}