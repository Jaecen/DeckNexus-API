const rethink = require('rethinkdb');

module.exports = function(connection) {
	return {
		'get': (hash) =>
			rethink
				.table('objects')
				.get(hash)
				.run(connection),
		
		'add': (object) =>
			rethink
				.table('objects')
				.insert(object)
				.run(connection),
	}
}