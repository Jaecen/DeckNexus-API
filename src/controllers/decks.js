const crypto = require('crypto');
const getRawBody = require('raw-body');
const rethink = require('rethinkdb');

const deckParser = require('../deckParser');
const DeckTree = require('../deckTree');
const ObjectRepository = require('../objectRepository');

const rethinkConnectionParams = {
	host: 'localhost', 
	port: 28015,
	db: 'decknexus',
};

module.exports.get = function *(next) {
	yield rethink
		.connect(rethinkConnectionParams)
		.then(connection => DeckTree.walk(
			ObjectRepository(connection),
			this.params.hash))
		.then(deck => { this.body = deck })
		.then(() => next);
}

module.exports.post = function*(next) {
	const requestContent = yield getRawBody(this.req, {
    	length: this.request.length,
    	limit: '8kb',
    	encoding: this.request.charset
  	});

	let parsedDeck = {};
	try {
		parsedDeck = deckParser.parse(requestContent);
	} catch(exception) {
		this.throw(400, `Invalid deck format. ${exception.message}`);
	}

	const deckTreeObjects = DeckTree.build(parsedDeck);

	yield rethink
		.connect(rethinkConnectionParams)
		.then((connection) => {
			const objectRepository = ObjectRepository(connection);
			this.response.body = 'unknown';
		
			return Promise.all(map(deckTreeObjects, object => objectRepository.add(object)));
		})
		.then(() => next);
}

function* map(iterable, fn) {
	for(let x of iterable)
		yield fn(x);
}