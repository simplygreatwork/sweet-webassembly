
const path = require('path')
const logger = require('./logger')([
	'index', 'loader', 'document-off', 'transform-off', 'stager-off'
])
const Loader = require('./loader')
const Host = require('./host')

class Runner {
	
	run() {
		
		let root = path.join(process.cwd(), '/src/wat/examples/index')
		if (false) root = path.join(process.cwd(), '/src/wat/examples/macros')
		if (false) root = path.join(process.cwd(), '/src/wat/examples/memory')
		if (false) root = path.join(process.cwd(), '/src/wat/examples/memory_next')
		logger('index').log('root module: ' + root)
		let loader = new Loader({
			imports: {
				host: new Host()
			}
		})
		loader.start(root)
		loader.documents[root].instance.exports.main()
	}
}

module.exports = Runner