let users = {
	1: {
		id: 1,
		name: 'jaecen',
		email: 'jason@addington.com',
	}
};

let deck = {};			// Equivalent to a head
let commits = {};		// Equivalent to a commit object
let decklists = {};		// Equivalent to a blob object
let tags = {};			// Equivalent to a tag
let comments = {};		// No equivalent

// A deck points to a commit and is moved forward with each commit
// A commit points to a decklist and contains some metadata (author, notes, parent commit, etc)
// A decklist is a normalized list of cards and quantities
// A tag points to a commit and does not move forward
// A comment points to a commit and contains a timestamp, author, and content 

module.exports.get = function *(next) {
	this.body = {
		//deck
	};
	
	yield next;
}
