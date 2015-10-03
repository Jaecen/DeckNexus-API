function* iterMap(iterable, fn) {
	for(let x of iterable)
		yield fn(x);
}

const iterLast = ([head, ...tail]) =>
	tail && tail.length === 0
		? head
		: iterLast(tail);

module.exports.last = iterLast;
module.exports.map = iterMap;