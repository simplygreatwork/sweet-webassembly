
const query = require('../query')
const shared = require('./shared')

let system = null
let document = null

function transform(node, index, parents) {
	
	return null
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return transform
}
