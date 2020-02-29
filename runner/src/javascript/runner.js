
const path = require('path')
const logger = require('./logger')([
	'index', 'loader', 'document-off', 'process', 'transform-off', 'stager-off', 'parsing', 'transforming'
])
const broadcast = require('./broadcast')
const System = require('./system')
const Host = require('./host')

class Runner {
	
	run(root) {
		
		logger('index').log('root module: ' + root)
		this.listen()
		this.system = new System({
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
		this.system.start(root)
		logger('index').log('Compiled in ' + ((new Date().getTime() - date.getTime()) / 1000) + ' seconds.')
		this.system.documents[root].instance.exports.main()
	}
	
	listen() {
		
		broadcast.on('parsed', function(data) {
			logger('parsing').log('parsed: ' + data)
		})
		broadcast.on('transformed', function(data) {
			logger('transforming').log('transformed: ' + data)
		})
	}
}

module.exports = Runner