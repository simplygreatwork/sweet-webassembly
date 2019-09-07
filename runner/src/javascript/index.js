
if (true) {
	let Runner = require('./runner') 
	let runner = new Runner()
	runner.run()
} else {
	let trial = require('./trial.js')
	if (false) trial.test_one()
	if (false) trial.test_two()
	if (false) trial.test_three()
	if (false) trial.test_markdown()
}
