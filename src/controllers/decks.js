module.exports.list = function *(next) {
	this.body = {
		deckIds: [1,2,3,4,5]
	};
	
	yield next;
}
