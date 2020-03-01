
const path = require('path')
process.argv.shift()
process.argv.shift()
let root = path.join(process.cwd(), '/src/wat/examples/')
if (process.argv.length > 0) {
	root = root + process.argv[0]
} else {
	root = root + 'index'
}
let Runner = require('./runner') 
let runner = new Runner()
runner.run(root)
