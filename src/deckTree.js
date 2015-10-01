const crypto = require('crypto');

const BlobType = 'blob'; 
const BoardType = 'board'; 
const CardType = 'card'; 
const DeckType = 'deck'; 
	
function TreeEntry(type, hash, name) {
	this.type = type;
	this.hash = hash;
	this.name = name;
};

function TreeObject(hash, entries) {
	this.hash = hash;
	this.entries = entries;
}

function BlobObject(hash, content) {
	this.hash = hash;
	this.content = content;
}

function* createDeckTree(deck) {
	const boardTreeObjects = deck
		.boards
		.map(board => ({
			normalizedType: normalizeName(board.type),
		}))
		.sort((left, right) => left.normalizedType.localeCompare(right.normalizedType))
		.map(board => ({
			treeObjects: Array.from(createBoardTreeObject(board)),
			normalizedType: board.normalizedType,
		}));

	const shasum = crypto.createHash('sha256');
	boardTreeObjects.forEach(board => shasum.update(board.treeObjects[0].hash));
	const deckHash = shasum.digest('hex');
	
	yield new TreeObject(
		deckHash,
		boardTreeObjects.map(board => new TreeEntry(
			BoardType,
			board.treeObjects[0].hash,
			board.normalizedType)));

	for(let board of boardTreeObjects) {
		for(let descendant of board.treeObjects) {
			yield descendant;
		}
	}
}

function* createBoardTreeObject(board) {
	const hashedCards = board
		.cards
		.map(card => ({
			normalizedName: normalizeName(card.name),
			quantity: card.quantity,
		}))
		.sort((left, right) => left.normalizedName.localeCompare(right.normalizedName))
		.map(card => ({
			normalizedName: card.normalizedName,
			hash: crypto
				.createHash('sha256')
				.update(card.normalizedName)
				.digest('hex'),
			quantity: card.quantity,
		}));
		
	const shasum = crypto.createHash('sha256');
	hashedCards.forEach(card => shasum.update(card.hash).update(String(card.quantity)));
	const boardHash = shasum.digest('hex');
	
	yield new TreeObject(
		boardHash,
		hashedCards.map(card => new TreeEntry(
			CardType,
			card.hash,
			card.quantity)));
			
	for(let card of hashedCards) {
	 	yield new BlobObject(
			card.hash, 
			{
			 	normalizedName: card.normalizedName
		 	});
	}
}

function normalizeName(name) {
	return name
		.trim()
		.toLowerCase();
}

function walkObject(objectBuilder, objectRepository, type, hash, name) {
	return Promise.resolve(
		objectBuilder.has(type)
		? objectBuilder.get(type)(
			type, 
			hash, 
			name,
			() => objectRepository.get(hash),
			() => walkEntries(objectBuilder, objectRepository, type, hash, name))
		: null);
}

function walkEntries(objectBuilder, objectRepository, type, hash, name) {
	return objectRepository
		.get(hash)
		.then(object => object && object.hasOwnProperty('entries')
			? Promise.all(object.entries.map(entry => walkObject(objectBuilder, objectRepository, entry.type, entry.hash, entry.name))) 
			: Promise.resolve(null)
		);
}

const objectBuilder = new Map([
	[
		DeckType, 
		(type, hash, name, getObject, getEntities) => 
			getEntities()
			.then(entities => ({
				boards: entities,
			}))
	],
	[
		BoardType,
		(type, hash, name, getObject, getEntities) => 
			getEntities()
			.then(entities => ({
				type: name,
				cards: entities,
			}))
	],
	[
		CardType, 
		(type, hash, name, getObject, getEntities) => 
			getObject()
			.then(object => ({
				name: object.content.normalizedName,
				quantity: name,
			}))
	],
]);

module.exports.build = createDeckTree;
module.exports.walk = (objectRepository, hash) => walkObject(objectBuilder, objectRepository, DeckType, hash, null);