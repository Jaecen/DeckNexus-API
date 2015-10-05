const crypto = require('crypto');
const rethink = require('rethinkdb');

const config = require('../configuration');
const iterUtil = require('../iterUtil');
const decklistParser = require('../decklistParser');
const TreeSerializer = require('../treeSerializer');
const ObjectRepository = require('../objectRepository');

module.exports.getByName = function *(next) {
	const deckName = `${this.params.user}/${this.params.name}`;

	yield rethink
		.connect(config.rethinkdb)
		.then(connection => rethink
			.table('decks')
			.get(deckName)
			.run(connection))
		.then(deckRef => {
			if(deckRef === null) {
				this.throw(404)
			}
			
			this.status = 307;
			this.redirect('/decks/@' + deckRef.deck);
		}) 
		.then(() => next);
}

module.exports.getByHash = function *(next) {
	yield rethink
		.connect(config.rethinkdb)
		.then(connection => TreeSerializer.deserializeDeck(
			ObjectRepository(connection),
			this.params.hash))
		.then(result => this.body = result)
		.then(() => next);
}

module.exports.post = function*(next) {
	const deckName = `${this.params.user}/${this.params.name}`;
	const deck = this.request.body;

	let parsedDecklist = {};
	try {
		parsedDecklist = decklistParser.parse(deck.decklist);
	} catch(exception) {
		this.throw(400, `Invalid deck format. ${exception.message}`);
	}

	let deckHash = null;
	yield rethink
		.connect(config.rethinkdb)
		.then(connection => 
			rethink.table('decks')
				.get(deckName)
				.run(connection)
				.then(deckRef => {
					const deckEntity = {
						'parents': deckRef === null
							? null
							: [deckRef.deck],
						'author': this.params.user,
						'message': deck.message,
						'timestamp': Date.now(),
						'decklist': parsedDecklist,
					};
					
					const deckObjects = TreeSerializer.serializeDeck(deckEntity);
					const objectRepository = ObjectRepository(connection);
	
					return Promise.all(
						iterUtil.map(
							deckObjects, 
							object => {
								deckHash = object.hash;
								return objectRepository.add(object)
							}))
				})
				.then(() => {
					rethink.table('decks')
					.get(deckName)
					.replace({
						'name': deckName,
						'deck': deckHash, 
					})
					.run(connection);
				}))
		.then(() => this.body = {
			'hash': deckHash
		})
		.then(() => next);
}