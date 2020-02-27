
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')
const shared = require('./shared.js')

let system = null
let document = null
let string_counter = 0

function transform(node, index, parents) {
	
	let first = node.value[0]
	if (query.is_type_value(first, 'symbol', 'string')) {
		let string = node.value[1].value
		let func_name = function_new(parents[0], string)
		string_call(node, index, parents, func_name)
	} else {
		if (shared.is_inside_function(parents)) {
			if (! query.is_type_value(first, 'symbol', 'typeof')) {
				if (! query.is_type_value(first, 'symbol', 'funcref')) {
					node.value.forEach(function(each, index) {
						if (query.is_type(each, 'string')) {
							let ast = parse(`(string "${each.value}")`)
							node.value[index] = ast[0]
						}
					})
				}
			}
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

module.exports = function(system_, document_) {
    
    system = system_
    document = document_
	 return transform
}