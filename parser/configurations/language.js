
var p = require('../src/parsers/core');

const between = require('../src/parsers/between')
const split = require('../src/parsers/split')
const whitespace = require('../src/parsers/whitespace')
const newline = require('../src/parsers/newline')
const semicolon = require('../src/parsers/semicolon')
const number = require('../src/parsers/number')
const boolean = require('../src/parsers/boolean')
const string = require('../src/parsers/string')
const symbol = require('../src/parsers/symbol')

let refs = {}

function statements() {
	
	return split (
		options(),
		p.alt([
			semicolon(),
			newline()
		]),
		function(value) {
			return {
				statements: value.split
			}
		}
	)
}

function options() {
	
	return p.rep (
		p.alt([
			list(),
			boolean(),
			number(),
			whitespace(),
			string(),
			symbol(),
			other()
		], function(value) {
			return value.alt		// todo: emit the atom here
		}),
		1,
		function(value) {
			return value.rep.filter(function(each) {
				return each.type != 'whitespace'
			});
		}
	)
}

function list() {
	
	return between (
		p.char('('),
		p.ref(refs, 'statements'),
		p.char(')'),
		function(value) {
			return {
				type: 'list',
				statements: value.statements
			}
		}
	)
}

function other() {
	
	return p.rep(p.char('^\(\)\n;\t\r ', function(value) {
		return value.char;
	}), 1, function(value) {
		return {
			type: 'other',
			value: value.rep.join('')
		};
	})
}

refs.statements = statements()

let array = []
for (i = 0; i < 100; i++) {
	array.push(
`

	list = Object clone
	list push true
	1 2 3 true false "stringy" symbolic let x = 5

	while (x = true;
		print
	)

	list push false
	method = method (
		list = Object clone
		list push 1
		list push 2
		print
		method = method (


			list = Object clone
			list push 1
			list push 2
			print
		)


	)
`
	)
}

console.log('begin');
let result = p.parse(
	statements(),
	array.join('')
);
console.log('end');

if (array.length < 100) {
	console.log(
		JSON.stringify(
			result, null, 2
		)
	)
}
