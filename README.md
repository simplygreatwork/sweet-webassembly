
# sweet-webassembly

Get started with WebAssembly text format syntax and macros.
Create macros to construct your own programming language.

### Create a macro to recognize and transpile integer values [runner/src/javascript/macros/integer.js]
```javascript

function enter(node, index, parents, state) {
	
	if (! shared.is_inside_function(state)) return
	if (node.type != 'number') return
	let parent = query.last(parents)
	if (query.is_type_value(parent.value[0], 'symbol', 'i32.const')) return
	if (query.is_type_value(parent.value[0], 'symbol', 'br')) return
	if (query.is_type_value(parent.value[0], 'symbol', 'br_if')) return
	parent.value[index] = parse(` (i32.const ${node.value})`)[0]
}
```

### Create a macro to configure function parameters [runner/src/javascript/macros/accepting.js]
```javascript

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_expression_longer(node, 2)) return
	if (! query.is_type_value(node.value[0], 'symbol', 'func')) return
	if (! query.is_type_value(node.value[2], 'symbol', 'accepts')) return
	node.value.every(function(each, index) {
		if (index <= 2) return true
		if (query.is_type(each, 'expression')) return false
		if (query.is_type(each, 'whitespace')) return true
		let value = shared.dollarify(each.value)
		node.value[index] = parse(` (param ${value} i32)`)[0]
		return true
	})
	node.value.splice(2, 1)
}
```

### Install your macros [runner/src/javascript/runner.js]

```javascript
macros: {
	expressions: [
		...
		require('./macros/accepts.js')
		...
	],
	atoms: [
		...
		require('./macros/integer.js')
		...
	]
}
```

### Write example code using your new macros [runner/src/wat/examples/demo.js]

```wat
macros: {
	expressions: [
		...
		require('./macros/accepts.js')
		...
	],
	atoms: [
		...
		require('./macros/integer.js')
		...
	]
}
```

### Overview

- A work in process to get up and running quickly with WebAssembly text format syntax.
- Parses WebAssembly .wat files, transforms using macros, and launches the project's main function.
- s-expressions in WebAssembly text syntax are parsed using a fork of the simple, tiny parser combinator library: uparse
	- https://github.com/jimf/uparse
- Transformations for string building and automatic module importing and exporting are included.
- Each module's functions are exported automatically using macros.
- Each module's functions are imported automatically using macros.
- Contains the beginning of a basic standard library in WebAssembly text syntax.
	- strings, lists, booleans, numbers, assertions
- The parser supports documentation first.
	- Runnable wat source code can be compiled while embedded inside markdown documentation.
- Currently compiles and runs in Node.js only. Small tweaks are needed to allow running in the browser.

### Structure

1. lexer
2. parser (for s-expressions)
2. abstract syntax tree transformer (s-expressions)
3. linker
4. library (wat/wasm)

### Folder

- parser/
- compiler/
- library/
- macros/
- examples/
- fixtures/

### Run

- Requires Node.js
- Tested with Node.js 12.11.1
- Node.js 10.16.3 seems to be missing WebAssembly.Global

```
git clone https://github.com/simplygreatwork/sweet-webassembly.git
cd sweet-webassembly/runner
npm install
npm start
npm start memory
npm start macros
npm start stress
npm start tiny

```

### Roadmap

- allow relative paths for modules
- create macro for function pointers (tables)
- create binary search tree instead of hashtable
- create the distinct data structures: array, linked list, and hybrid (vector)
- fill in blank function stubs: e.g. $boolean_xor