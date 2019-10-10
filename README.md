
# sweet-webassembly

Get started with WebAssembly text format syntax and macros.

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

1. parser
2. compiler
3. runner
4. library (wat)

### Run

- Requires Node.js
- Tested with Node.js 12.11.1
- Node.js 10.16.3 seems to be missing WebAssembly.Global

```
git clone https://github.com/simplygreatwork/sweet-webassembly.git
cd sweet-webassembly/runner
npm install
npm start
```

### Roadmap

- allow relative paths for modules
- create macro for function pointers (tables)
- create binary search tree instead of hashtable
- create the distinct data structures: array, linked list, and hybrid (vector)
- fill in blank function stubs: e.g. $boolean_xor