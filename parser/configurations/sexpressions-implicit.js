
var p = require('../src/parsers/core');
const between = require('../src/parsers/between')
const split = require('../src/parsers/split')
const whitespace = require('../src/parsers/whitespace')
const newline = require('../src/parsers/newline')
const number = require('../src/parsers/number')
const boolean = require('../src/parsers/boolean')
const string = require('../src/parsers/string')
const symbol = require('../src/parsers/symbol')
const comment = require('../src/parsers/comment')

let refs = {}

function main() {
	
	return expression_contents(0)
}

function expression(level) {
	
	return between (
		p.char('('),
		p.ref(refs, 'expression_contents', level),
		p.char(')'),
		function(value) {
			return {
				type: 'expression',
				value: fold_lines(value)
			}
		}
	)
}

function expression_contents(level) {
	
	return p.rep (
		p.alt ([
			line_blank(),
			expression(level),
			lines(level),
			comment(';;'),
			whitespace('\t\r '),
			number(),
			string(),
			symbol(),
			newline(),
		], function(value) {
			return value.alt
		}),
		0,
		function(value) {
			return fold_whitespace(value.rep)
		}
	)
}

function line_blank() {
	
	return p.seq ([
		p.rep (indent(), 0, function(value) {
			return value.rep
		}),
		newline()
	],
	function(value) {
		return {
			type: 'whitespace',
			value: '\n'
		}
	})
}

function lines(level) {
	
	return p.seq ([
		line(level),
		p.opt(line_blank()),
		line_children(level)
	],
	function(value) {
		let line = value.seq[0]
		let line_blank = value.seq[1].opt
		let lines = value.seq[2]
		if (line_blank) line.value.push(line_blank)
		line.value.push(...lines)
		line.value = fold_lines(line.value)
		return line
	})
}

function line(level) {
	
	return p.seq([
		indentation(level),
		p.ref (refs, 'line_contents', level),
		newline(),
	], function(value) {
		return {
			type: 'line',
			value: value.seq[1],
			whitespace_: value.seq[2].value + value.seq[0].value
		}
	})
}

function line_children(level) {
	
	return p.opt (
		p.rep (
			p.ref (refs, 'lines', level + 1), 0, function(value) {
				return value.rep
			}
		),
		function(value) {
			return value.opt
		}
	)
}

function line_contents(level) {
	
	return p.rep (
		p.alt ([
			expression(level + 1),
			whitespace('\t\r '),
			number(),
			string(),
			symbol(),
			comment(';;')
		], function(value) {
			return value.alt
		}),
		1,
		function(value) {
			return fold_whitespace(value.rep)
		}
	)
}

function indentation(level) {
	
	let sequence = [];
	for (var i = 0; i < level; i++) {
		sequence.push (
			indent()
		)
	}
	return p.seq (sequence, function(value) {
		return {
			type: 'whitespace',
			value: value.seq.join('')
		}
	})
}

function indent() {
	
	return p.alt ([
		p.char ('\t', function(value) {
			return value.char
		}),
		p.str ('   ', function(value) {
			return value.str
		})
	], function(value) {
		return value.alt
	})
}

function fold_lines(value) {
	
	let result = []
	value.forEach(function(each, index) {
		if (each.type == 'line') {
			if (each.value.length > 0 && each.value[0].type != 'symbol') {
				each.value[0].whitespace = each.whitespace_
				result.push(...each.value)
			} else {
				if (index === 0) {
					each.value[0].whitespace = each.whitespace_
					result.push(...each.value)
				} else {
					let significant = each.value.filter(function(each) {
						if (each.type == 'whitespace') return false
						else if (each.type == 'newline') return false
						else if (each.type == 'comment') return false
						else return true
					})
					if (significant.length > 0) {			// line contains significant elements
						each.type = 'expression'
						if (each.whitespace_) each.whitespace = each.whitespace_
						result.push(each)
					} else {
						result.push(...each.value)
					}
				}
			}
		} else {
			result.push(each)
		}
	})
	return result
}

function fold_whitespace(value) {
	
	let whitespace = []
	value.map(function(each) {
		if (each.type == 'whitespace') whitespace.push(each.value)
		else if (each.type == 'newline') whitespace.push(each.value)
		else if (each.type == 'comment') whitespace.push(each.value)
		else {
			each.whitespace = whitespace.join('')
			whitespace.splice(0, whitespace.length)
		}
	})
	return value.filter(function(each) {
		if (each.type == 'whitespace') return false
		else if (each.type == 'newline') return false
		else if (each.type == 'comment') return false
		else return true
	})
}

refs.lines = lines
refs.line_contents = line_contents
refs.expression_contents = expression_contents

module.exports = function(code) {
	
	return p.parse (
		main(),
		code
	)
}
