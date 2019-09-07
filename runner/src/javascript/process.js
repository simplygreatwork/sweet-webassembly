
const path = require('path')
const parse = require('./parse')
const walk = require('./walk')
const query = require('./query')
const transform = require('./transform')
const remark = require('remark')
const visit = require('unist-util-visit')

function process_md(document) {
	
	let result = []
	let tree = remark().parse(document.source)
	visit(tree, function(node) {
		if (node.type == 'code') {
			result.push('\n')
			result.push(node.value)
		}
	}.bind(this))
	document.source = result.join('')
}

function process_watm(document) {
	
	let result = parse(document.source)
	if (result.error) {
		let line_result = find_line(result.position)
		console.error('Error parsing line ' + line_result.line + ' at character ' + line_result.char + ':')
		console.error('--> ' + line_result.text)
		console.error('')
		process.exit(-1)
		return false
	} else {
		document.ast = result
		document.functions = find_functions(document)
		document.function_exports = find_function_exports(document)
		render_function_exports(document)
		document.function_imports = find_function_imports(document)
		document.module_imports = find_module_imports(document)
		return true
	}
}

function find_line(position) {
	
	let result = {}
	let a = this.source.indexOf('\n', position)
	let b = this.source.lastIndexOf('\n', a - 1)
	result.text = this.source.substring(b + 1, a)
	result.line = this.source.substring(0, b).split('\n').length
	result.char = position - b
	return result
}

function process_wat(document, imports) {
	
	return noop()
}

function noop() {

	return
}

function instantiate(document, imports) {
	
	let code = transform(document.ast)
	let module_ = require('wabt')().parseWat(document.path, code, this.flags = {
		exceptions : false,
		mutable_globals : true,
		sat_float_to_int : false,
		sign_extension : false,
		simd : false,
		threads : false,
		multi_value : false,
		tail_call : false
	})
	module_.resolveNames()
	module_.validate(this.flags)
	let binary = module_.toBinary({
		log: true,
		write_debug_names: true
	})
	let wasm = new WebAssembly.Module(binary.buffer)
	document.instance = new WebAssembly.Instance(wasm, imports)
	return document.instance.exports
}

function find_module_imports(document) {
	
	let result = []
	walk({ root: document.ast[0], visit: function(node, index, parents) {
		if (query.is_expression_length(node, 2)) {
			if (query.is_type_value(node.value[0], 'symbol', 'import')) {
				if (query.is_type(node.value[1], 'string')) {
					result.push(path.join(process.cwd(), '/src/wat/', node.value[1].value))
				}
			}
		}
	}})
	return result
}

function find_function_imports(document) {
	
	let result = {}
	walk({ root: document.ast[0], visit: function(node, index, parents) {
		if (query.is_depth(parents, 1)) {
			if (query.is_type(node, 'expression')) {
				if (node.value.length > 2) {
					if (query.is_type_value(node.value[0], 'symbol', 'import')) {
						let module = node.value[1].value
						let func = node.value[2].value
						result[module] = result[module] || {}
						result[module][func] = node
					}
				}
			}
		}
	}})
	return result
}

function find_functions(document) {
	
	let result = []
	walk({ root: document.ast[0], visit: function(node, index, parents) {
		if (query.is_depth(parents, 1)) {
			if (query.is_type(node, 'expression')) {
				if (query.is_type_value(node.value[0], 'symbol', 'func')) {
					result.push(node)
				}
			}
		}
	}})
	return result
}

function find_function_exports(document) {
	
	let result = {}
	walk({ root: document.ast[0], visit: function(node, index, parents) {
		if (query.is_depth(parents, 1)) {
			if (query.is_type(node, 'expression')) {
				if (query.is_type_value(node.value[0], 'symbol', 'export')) {
					result[node.value[2].value[1].value] = node
				}
			}
		}
	}})
	return result
}

function render_function_exports(document) {
	
	document.functions.forEach(function(each) {
		let name = each.value[1].value
		let code = `\n\t(export "${name.substring(1)}" (func ${name}))`
		if (! document.function_exports[name]) {
			let ast = parse(code)
			query.append(document.ast[0], ast[0])
		}
	}.bind(this))
}

function render_function_imports(document) {
	
	document.module_imports.forEach(function(document_) {
		document_.functions.forEach(function(func) {
			let name = func.value[1].value
			if (! has_function_import(document, document_.id, name.substring(1))) {
				let code = `\n\t(import "${document_.id}" "${name.substring(1)}" (func ${name}))`
				let ast = parse(code)
				let signature = find_function_signature(func)
				signature.forEach(function(node) {
					ast[0].value[3].value.push(node)
				})
				query.insert(document.ast[0], ast[0], 1)
			}
		}.bind(this))
	}.bind(this))
}

function has_function_import(document, module, func) {

	if (document.function_imports[module]) {
		if (document.function_imports[module][func]) {
			return true
		}
	}
	return false
}

function find_function_signature(func) {
	
	let result = []
	walk({ root: func, visit: function(node, index, parents) {
		if (query.is_type(node, 'expression')) {
			if (query.is_type_value(node.value[0], 'symbol', 'param')) {
				result.push(node)
			}
			if (query.is_type_value(node.value[0], 'symbol', 'result')) {
				result.push(node)
			}
		}
	}})
	return result
}

module.exports = {
	
	process_md: process_md,
	process_watm: process_watm,
	process_wat: process_wat,
	find_module_imports: find_module_imports,
	find_function_imports: find_function_imports,
	find_functions: find_functions,
	find_function_exports: find_function_exports,
	render_function_exports: render_function_exports,
	render_function_imports: render_function_imports,
	has_function_import: has_function_import,
	find_function_signature: find_function_signature,
	instantiate: instantiate
}