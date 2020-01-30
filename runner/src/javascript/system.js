
const fs = require('fs')
const path = require('path')
const Document = require('./document')
const Table = require('./table')
const process = require('./process')
const logger = require('./logger')()

class System {
	
	constructor(options) {
		
		this.imports = options.imports
		this.documents = {}
		this.table = new Table(this)
	}
	
	start(path_) {
		
		this.load_document(path_)
		this.resolve_documents()
		this.sort_documents()
		this.render_function_imports()
		this.instantiate_documents()
	}
	
	load_document(path_) {
		
		if (! this.documents[path_]) {
			logger('loader-load').log('loading: ' + path.basename(path_) + ' (' + path_ + ')')
			let document = new Document(path_)
			document.load()
			document.module_imports.forEach(function(each) {
				this.load_document(each)
			}.bind(this))
			this.documents[path_] = document
		}
	}
	
	resolve_documents() {
		
		Object.keys(this.documents).forEach(function(key) {
			let document = this.documents[key]
			document.module_imports.forEach(function(each, index) {
				document.module_imports[index] = this.documents[each]
			}.bind(this))
		}.bind(this))
	}
	
	sort_documents() {
		
		let documents = Object.values(this.documents)
		let document = null
		this.set = new Set()
		while (document = documents.shift()) {
			let satisfied = true
			document.module_imports.forEach(function(each) {
				if (! this.set.has(each)) {
					satisfied = false
				}
			}.bind(this))
			if (satisfied) {
				this.set.add(document)
			} else {
				documents.push(document)
			}
		}
	}
	
	render_function_imports() {
		
		for (let document of this.set.values()) {
			process.render_function_imports(document)
		}
	}
	
	instantiate_documents() {
		
		for (let document of this.set.values()) {
			logger('loader').log('instantiate: ' + path.basename(document.path) + ' (' + document.path + ')')
			let name = path.basename(document.path)
			let key = name.split('.')[0]
			let imports = this.imports
			let system = this
			this.imports[key] = process.instantiate(document, imports, system)
		}
	 }
}

module.exports = System