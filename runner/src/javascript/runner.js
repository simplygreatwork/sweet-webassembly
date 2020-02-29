
const path = require('path')
const logger = require('./logger')([
	'index', 'loader', 'document-off', 'transform-off', 'stager-off'
])
const System = require('./system')
const Host = require('./host')

class Runner {
	
	run(root) {
		
		logger('index').log('root module: ' + root)
		let system = new System({
			imports: {
				host: new Host()
			},
			macros: [
				require('./macros/function.js'),
				require('./macros/assign.js'),
				require('./macros/dollar.js'),
				require('./macros/string.js'),
				require('./macros/integer.js'),
				require('./macros/imports.js'),
				require('./macros/exports.js'),
				require('./macros/typeof.js'),
				require('./macros/funcref.js'),
				require('./macros/callable.js'),
			]
		})
		let date = new Date()
		system.start(root)
		logger('index').log('Compiled in ' + ((new Date().getTime() - date.getTime()) / 1000) + ' seconds.')
		system.documents[root].instance.exports.main()
	}
}

module.exports = Runner