'use strict';

const { prompt } = require('prompts');

let interval;

(async function() {
	
	const questions = [{
		type: 'select',
		name: 'file',
		message: 'Pick a file',
		choices: [
			{ title: 'a', value: 'a' },
			{ title: 'b', value: 'b' },
			{ title: 'c', value: 'c' },
			{ title: 'd', value: 'd' },
			{ title: 'e', value: 'e' }
		]
	}];
	const answers = await prompt(questions, {
		onCancel: cleanup,
		onSubmit:cleanup
	});
	console.log(answers);
})();

function cleanup() {
	clearInterval(interval);
}
