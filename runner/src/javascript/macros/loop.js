
const query = require('../query')
const parse = require('../parse')
const shared = require('./shared')

let system = null
let document = null

// idea: use change events (added/removed) instead of returning "invalidate"
// e.g. system.fire('added')

function transform(node, index, parents) {
	
	if (query.is_type_value(node.value[0], 'symbol', 'repeat')) {
		let config = get_config(node)
		let tree = parse (`
		(block (loop
			(if (i32.gt_u (get_local ${config.with}) (i32.const ${config.to})) (then (br 2)))
			(set_local ${config.with} (i32.add (get_local ${config.with}) (i32.const ${config.every})))
			(br 0)
		))
		`)
		node.value.filter(function(each) {
			return (each.type == 'expression')
		})
		.forEach(function(each, index) {
			query.insert(tree[0].value[1], each, 2 + index)
		})
		query.replace(query.last(parents), node, tree[0])
		tree = parse (`(set_local ${config.with} (i32.const ${config.from}))`)
		query.insert(query.last(parents), tree[0], index)
		system.fire('add', tree[0])
		return 'invalidate'					// invalidate to trigger set.js macro to declare iterator local
	}
}

function get_config(node) {
	
	let config = { with: '$i', from: 0, to: 10, every: 1, 'in': null }
	node.value.forEach(function(each, index) {
		if (each.value == 'with') config.with = node.value[index + 1].value
		if (each.value == 'from') config.from = node.value[index + 1].value
		if (each.value == 'to') config.to = node.value[index + 1].value
		if (each.value == 'every') config.every = node.value[index + 1].value
		config.with = (config.with.charAt(0) == '$') ? config.with : '$' + config.with
	})
	if (false) console.log('config: ' + JSON.stringify(config, null, 2))
	return config
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}
