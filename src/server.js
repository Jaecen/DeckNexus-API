var app = require('koa')();
var router = require('koa-router')();

var decksController = require('./controllers/decks');

// Init routing

router.get('/decks',  decksController.get);

app
	.use(router.routes())
	.use(router.allowedMethods());
	
console.log('listening on port 1337');
app.listen(1337);