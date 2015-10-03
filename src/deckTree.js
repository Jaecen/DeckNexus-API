const crypto = require('crypto');
const iterUtil = require('./iterUtil');

const BoardType = 'board'; 
const CardType = 'card'; 
const DeckType = 'deck'; 

function buildObject(type, entity, buildHandlers) {
	if(!buildHandlers.has(type)) {
		return null;
	}

	const { childrenSelector, objectBuilder } = buildHandlers.get(type);
	const children = childrenSelector(entity)
		.sort(({ sortKey: left }, { sortKey: right }) => 
			left.localeCompare(right))
		.map(({ type: childType, sortKey: childSortKey, entity: childEntity }) => 
			buildObject(childType, childEntity, buildHandlers));
	
	return {
		entity: entity,
		object: objectBuilder(entity, children),
		children: children,
	};
}

const buildHandlers = new Map([
	[
		DeckType,
		{
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
		}
	],
	[
		BoardType,
		{
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
		} 
	],
	[
		CardType,
		{
			'childrenSelector': entity => [],
			
			'objectBuilder': (entity, children) => ({
				'hash': buildHash(normalizeName(entity.name)),
				'normalizedName': normalizeName(entity.name),
			}),
		}
	]
]);

function buildHash(values) {
	const sum = crypto.createHash('sha256')
	
	for(let value of values) {
		sum.update(value);
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

//=================================================================

function walkObject(objectBuilder, objectRepository, type, hash, reference) {
	return objectBuilder.has(type)
		? objectRepository
			.get(hash)
			.then(object => objectBuilder.get(type)(
				object,
				reference,
				(type, hashes) => Promise.all(
					hashes.map(({ hash, reference }) => 
						walkObject(objectBuilder, objectRepository, type, hash, reference)))
			))
		: Promise.resolve(null);
}

const objectBuilder = new Map([
	[
		DeckType, 
		(object, reference, getEntities) => 
			getEntities(BoardType, object.boards.map(board => ({ hash: board.hash, reference: board })))
			.then(boards => ({
				boards: boards,
			}))
	],
	[
		BoardType,
		(object, reference, getEntities) => 
			getEntities(CardType, object.cards.map(card => ({ hash: card.hash, reference: card })))
			.then(cards => ({
				type: reference.type,
				cards: cards,
			}))
	],
	[
		CardType,
		(object, reference, getEntities) => 
 			({
				 quantity: reference.quantity, 
				 name: object.normalizedName
			}) 
	],
]);

module.exports.deserialize = (objectRepository, hash) => 
	walkObject(objectBuilder, objectRepository, DeckType, hash, null);
	
module.exports.serialize = function*(deck) {
	const deckNode = buildObject(DeckType, deck, buildHandlers);
	yield* iterateTreeObjects(deckNode);
}