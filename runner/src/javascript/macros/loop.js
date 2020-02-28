
const parse = require('../../../../parser/configurations/sexpressions.js')
const query = require('../query.js')
const shared = require('./shared.js')

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
