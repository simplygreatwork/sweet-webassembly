
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	if (query.is_type_value(node.value[0], 'symbol', 'repeat')) {
		let config = get_config(node)
		if (false) console.log('config: ' + JSON.stringify(config, null, 2))
		let tree = parse(`
		(block (loop
			(if (i32.gt_u (get_local ${config.with}) (i32.const ${config.to})) (then (br 2)))
			(call $print_integer (get_local ${config.with}))
			(set_local ${config.with} (i32.add (get_local ${config.with}) (i32.const ${config.skip})))
			(br 0)
		))
		`)
		query.remove(tree[0].value[1], tree[0].value[1].value[2])
		let expressions = node.value.filter(function(each) {
			return (each.type == 'expression')
		})
		expressions.forEach(function(each, index) {
			query.insert(tree[0].value[1], each, 2 + index)
		})
		query.replace(query.last(parents), node, tree[0])
	}
}

function get_config(node) {
	
	let result = {
		from: 0,
		to: 10,
		skip: 1,
		with: '$i',
		'in': null
	}
	node.value.forEach(function(each, index) {
		if (each.value == 'from') result.from = node.value[index + 1].value
		if (each.value == 'to') result.to = node.value[index + 1].value
		if (each.value == 'skip') result.skip = node.value[index + 1].value
		if (each.value == 'with') result.with = node.value[index + 1].value
		result.with = (result.with.charAt(0) == '$') ? result.with : '$' + result.with
	})
	return result
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}
