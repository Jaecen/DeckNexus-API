const crypto = require('crypto');
const getRawBody = require('raw-body');

const deckParser = require('../deckParser');
const DeckTree = require('../deckTree');

const users = {
	1: {
		id: 1,
		name: 'jaecen',
		email: 'jason@addington.com',
	}
};

const objects = {};		// Strictly equivalent to Git objects. Contains tree and blob objects.
const decks = {};		// Equivalent to a head
const tags = {};		// Equivalent to a tag
const comments = {};	// No equivalent

module.exports.get = function *(next) {
	const deck = DeckTree.walk(
		objects, 
		this.params.hash);
	
	this.body = {
		response: 'hi',
		deck: deck,
	};
	
	yield next;
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
		this.throw(
			400, 
			`Invalid deck format. ${exception.message}`);
	}
	
	const deckTreeObjects = DeckTree.build(parsedDeck);
	let firstVal = null;
	
	for(let object of deckTreeObjects) {
		if(firstVal === null)
			firstVal = object;
			
		if(!objects.hasOwnProperty(object.hash)) {
			objects[object.hash] = object;
		}
	}

	this.response.body = firstVal.hash;
	yield next;
}