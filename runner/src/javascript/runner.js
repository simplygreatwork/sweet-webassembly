
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
		system.start(root)
		system.documents[root].instance.exports.main()
	}
}

module.exports = Runner