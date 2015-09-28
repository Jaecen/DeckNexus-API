const crypto = require('crypto');

const BlobType = 'blob'; 
const BoardType = 'board'; 
const CardType = 'card'; 
const DeckType = 'deck'; 
	
function TreeEntry(type, hash, data) {
	this.type = type;
	this.hash = hash;
	this.data = data;
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
		.sort((left, right) => normalizeName(left.type).localeCompare(normalizeName(right.type)))
		.map(board => ({
			treeObjects: Array.from(createBoardTreeObject(board)),
			type: board.type,
		}));

	const shasum = crypto.createHash('sha256');
	boardTreeObjects.forEach(board => shasum.update(board.treeObjects[0].hash));
	const deckHash = shasum.digest('hex');
	
	yield new TreeObject(
		deckHash,
		boardTreeObjects.map(board => new TreeEntry(
			BoardType,
			board.treeObjects[0].hash,
			board.type)));

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

function walkDeckTree(objects, deckObjectHash) {
	const noop = () => ({});
	
	const deck = {
		boards: []
	};
	let currentBoard = null;
	
	const found = (type, hash, object, data) => {
		switch(type) {
			case BoardType:
				currentBoard = {
					type: data,
					cards: [],
				};
				deck.boards.push(currentBoard);
				break;
				
			case CardType:
				currentBoard.cards.push({
					name: object.content.normalizedName,
					quantity: data
				});
				break;
		}};

	walkObject(objects, deckObjectHash, DeckType, {
		notFound: noop,
		found: found,
		foundTree: found });
		
	return deck;
}

function walkObject(objects, hash, type, callbacks, treeEntryData) {
	console.log(hash, type, treeEntryData);
	
	if(!objects.hasOwnProperty(hash)) {
		callbacks.notFound(type, hash);
		return;
	}
	
	const object = objects[hash];

	if(object.hasOwnProperty('entries')) {
		callbacks.foundTree(type, hash, object, treeEntryData);
		for(let entry of object.entries) {
			walkObject(objects, entry.hash, entry.type, callbacks, entry.data);
		}
	} else {
		callbacks.found(type, hash, object, treeEntryData);
		return;
	} 
}

module.exports.build = createDeckTree;
module.exports.walk = walkDeckTree;
module.exports.walkObject = walkObject;