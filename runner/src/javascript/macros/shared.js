
function is_inside_function(parents) {
	
	let result = false
	parents.forEach(function(each) {
		if (each.value[0].value == 'func') {
			result = true
		}
	})
	return result
}

function is_callable(document, symbol) {
	
	let result = false
	document.functions.forEach(function(node) {
		let second = node.value[1]
		if (second.type == 'symbol') {
			if (second.value == symbol) {
				result = true
			}
		}
	})
	Object.keys(document.function_imports).forEach(function(module_) {
		Object.keys(document.function_imports[module_]).forEach(function(key) {
			let node = document.function_imports[module_][key]
			let fourth = node.value[3]
			if (fourth.value[0].value == 'func') {
				if (key == symbol) {
					result = true
				}
			}
		}.bind(this))
	}.bind(this))
	return result
}

module.exports = {
	is_inside_function: is_inside_function,
	is_callable: is_callable
}
