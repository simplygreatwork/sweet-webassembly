
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')
let string_counter = 0

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (first.type == 'symbol') {
		if (first.value == 'string') {
			let string = node.value[1].value
			let func_name = function_new(parents[0], string)
			string_call(node, index, parents, func_name)
		}
	}
}

function string_call(node, index, parents, func_name) {
	
	let ast = parse(`(call ${func_name})`)
	query.replace(query.last(parents), node, ast[0])
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

module.exports = transform