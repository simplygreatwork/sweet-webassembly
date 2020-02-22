
const fs = require('fs')
const parse = require('./language.js')

let code = fs.readFileSync('../data/example-one.oo') + ''
console.log('code: ' + code)
let ast = parse(code)
console.log(JSON.stringify(ast, null, 2))
