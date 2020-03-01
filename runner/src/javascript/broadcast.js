
const Bus = require('./bus')

class Broadcast {
	
	static bus = new Bus()
	
	static on(key, handler) {
		return Broadcast.bus.on(key, handler)
	}
	
	static emit(key) {
		Broadcast.bus.emit.apply(Broadcast.bus, Array.from(arguments))
	}
}

module.exports = Broadcast
