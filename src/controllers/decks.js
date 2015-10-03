const crypto = require('crypto');
const getRawBody = require('raw-body');
const rethink = require('rethinkdb');

const iterUtil = require('../iterUtil');
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
		.then(connection => DeckTree.deserialize(
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

	const deckObjects = DeckTree.serialize(parsedDeck);

	let deckHash = null;
	yield rethink
		.connect(rethinkConnectionParams)
		.then((connection) => {
			const objectRepository = ObjectRepository(connection);
			return Promise
				.all(iterUtil.map(
					deckObjects, 
					object => {
						deckHash = object.hash;
						return objectRepository.add(object)
					}));
		})
		.then(results => this.body = deckHash)
		.then(() => next);
}