
function Host() {
	
	Object.assign(this, {
		memory: new WebAssembly.Memory({
			initial: 100,
			maximum: 65536
		}),
		table: new WebAssembly.Table({
			initial: 256,
			element: 'anyfunc'
		}),
		global: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		legend: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		print_string: function(offset) {
			var array = new Uint8Array(this.memory.buffer)
			let type = array[offset]
			offset = offset + 4
			let length = array[offset]
			offset = offset + 4
			var string = ''
			for (var i = 0; i < length; i++) {
				string += String.fromCharCode(array[offset + i])
			}
			console.log(string)
		}.bind(this),
		print_integer: function(value) {
			console.log(value)
		}
	})
}

module.exports = Host