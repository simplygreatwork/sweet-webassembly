
Emitter = {
	
	on(key, func) {
		
		this.channels = this.channels || {}
		if (this.channels[key] === undefined) this.channels[key] = []
		this.channels[key].push(func)
		return function() {
			let index = this.channels[key].indexOf(func)
			this.channels[key].splice(index, 1)
		}.bind(this)
	},
	
	off(key) {
		
		if (this.channels[key]) {
			this.channels[key].splice(0, this.channels[key].length)
		}
	},
	
	replace(key, func) {
		
		this.off(key)
		this.on(key, func)
	},
	
	emit(key) {
		
		this.channels = this.channels || {}
		if (this.channels[key]) {
			var index = this.channels[key].length
			while (index--) {
				this.channels[key][index].apply(this, Array.from(arguments).splice(1))
			}
		}
	}
}

class Mixin {
	
	static use() {
		
		let base = arguments[0]
		let mixins = Array.from(arguments).splice(1)
		let class_ = class extends base {}
		mixins.forEach(function(mixin) {
			Object.assign(class_.prototype, mixin)
		});
		return class_
	}
}

class Bus extends Mixin.use(Object, Emitter) {
	
	constructor(options) {
		
		super()
		options = options || {}
		this.name = options.name
		this.parent = options.parent
	}
}

module.exports = Bus
