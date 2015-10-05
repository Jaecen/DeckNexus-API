const crypto = require('crypto');
const iterUtil = require('./iterUtil');

const DeckType = 'deck'; 
const DecklistType = 'decklist'; 
const BoardType = 'board'; 
const CardType = 'card'; 

// ==== Serialization/deserialization

function serializeToObject(builders, type, entity) {
	if(!builders.has(type)) {
		return null;
	}

	const { childrenSelector, objectBuilder } = builders.get(type);
	const children = childrenSelector(entity)
		.sort(({ sortKey: left }, { sortKey: right }) => 
			left.localeCompare(right))
		.map(({ type: childType, sortKey: childSortKey, entity: childEntity }) => 
			serializeToObject(builders, childType, childEntity));
	
	return {
		entity: entity,
		object: objectBuilder(entity, children),
		children: children,
	};
}

function deserializeToEntity(builders, objectRepository, type, hash, reference) {
	if(!builders.has(type)) {
		return Promise.resolve(null);
	}

	const { entityBuilder } = builders.get(type); 
	return objectRepository
		.get(hash)
		.then(object => object === null
			? null
			: entityBuilder(
				object,
				reference,
				(type, hashes) => {
					return Promise.all(
					hashes.map(({ hash, reference }) => 
						deserializeToEntity(builders, objectRepository, type, hash, reference)))}));
}

// ==== Builders

const deckBuilder = {
	'childrenSelector': entity => [{
			'type': DecklistType,
			'sortKey': null, 
			'entity': entity.decklist,
		}],
	
	'objectBuilder': (entity, [decklist]) => ({
			'hash': buildHash(
				(entity.parents || [])
				.sort((left, right) => left.localeCompare(right))
				.concat([
					entity.author, 
					entity.message, 
					entity.timestamp, 
					decklist.object.hash])),
			'parents': entity.parents,
			'author': entity.author,
			'message': entity.message,
			'timestamp': entity.timestamp,
			'decklist': decklist.object.hash,
		}),
		
	'entityBuilder': (object, reference, getEntities) => 
		getEntities(DecklistType, [{ reference: object, hash: object.decklist }])
		.then(([decklist]) => ({
			'parents': object.parents,
			'author': object.author,
			'message': object.message,
			'timestamp': object.timestamp,
			'decklist': decklist,
		})) 
};

const decklistBuilder = {
	'childrenSelector': entity => entity.boards
		.map(board => ({
			'type': BoardType,
			'sortKey': normalizeName(board.type), 
			'entity': board,
		})),
	
	'objectBuilder': (entity, children) => ({
			'hash': buildHash(children.map(child => child.object.hash)),
			'boards': children.map(child => ({ type: normalizeName(child.entity.type), hash: child.object.hash })),
		}),
		
	'entityBuilder': (object, reference, getEntities) => 
		getEntities(BoardType, object.boards.map(board => ({ hash: board.hash, reference: board })))
		.then(boards => ({
			'boards': boards,
		})) 
};

const boardBuilder = {
	'childrenSelector': entity => entity.cards
		.map(card => ({
			'type': CardType, 
			'sortKey': normalizeName(card.name), 
			'entity': card
		})),
	
	'objectBuilder': (entity, children) => ({
			'hash': buildHash(children.map(child => `${ child.entity.quantity } ${ child.object.hash }`)),
			'cards': children.map(child => ({ quantity: child.entity.quantity, hash: child.object.hash })),
		}),
	
	'entityBuilder': (object, reference, getEntities) => 
		getEntities(CardType, object.cards.map(card => ({ hash: card.hash, reference: card })))
		.then(cards => ({
			'type': reference.type,
			'cards': cards,
		}))

};

const cardBuilder = {
	'childrenSelector': entity => [],
	
	'objectBuilder': (entity, children) => ({
			'hash': buildHash(normalizeName(entity.name)),
			'normalizedName': normalizeName(entity.name),
		}),
	
	'entityBuilder': (object, reference, getEntities) => ({
			'quantity': reference.quantity, 
			'name': object.normalizedName
		})
}; 

const builders = new Map([
	[ DeckType, deckBuilder ],
	[ DecklistType, decklistBuilder ],
	[ BoardType, boardBuilder ],
	[ CardType, cardBuilder ],
]);

// ==== Utility functions

function buildHash(values) {
	const sum = crypto.createHash('sha256')
	
	for(let value of values) {
		if(value === null || value === undefined) {
			continue;
		}
		
		if(typeof(value) === 'string') {
			sum.update(value);
		} else {
			sum.update(String(value));
		}
	}
	
	return sum.digest('hex');
}

function normalizeName(name) {
	return name
		.trim()
		.toLowerCase();
}

function* iterateTreeObjects(node) {
	for(let child of node.children) {
		yield* iterateTreeObjects(child)
	}
	
	yield node.object;
}

// ==== Exports

module.exports.deserializeDeck = (objectRepository, hash) =>
	deserializeToEntity(builders, objectRepository, DeckType, hash, null);
	
module.exports.serializeDeck = function*(entity) {
	const objectNode = serializeToObject(builders, DeckType, entity);
	yield* iterateTreeObjects(objectNode);
};
