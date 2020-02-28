
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
			}
		})
		let date = new Date()
		system.start(root)
		console.log('Compiled in ' + ((new Date().getTime() - date.getTime()) / 1000) + ' seconds.')
		system.documents[root].instance.exports.main()
	}
}

module.exports = Runner