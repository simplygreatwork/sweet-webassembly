
const print = require('./print.js')
const logger = require('./logger')()
const Walker = require('./walker.js')

let counter = 0

module.exports = function(document, system) {
	
	let tree = transform(document, system)
	code = print(tree)
	logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
	logger('transform').log('tree transformed: ' + code)
	return code
}

function transform(document, system) {
	
	let off = system.bus.on('insert', function() {
		console.log('insert: ' + counter++)
	})
	let walker = new Walker()
	system.macros.forEach(function(each) {
		let macro = each(system, document)
		if (macro.enter) walker.on('enter', macro.enter)
		if (macro.exit) walker.on('exit', macro.exit)
	})
	walker.walk(document.tree[0])
	off()
	return document.tree
}
