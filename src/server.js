const app = require('koa')();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

const decksController = require('./controllers/decks');

// Init routing
router.get('/decks/@:hash',  decksController.getByHash);
router.get('/decks/:user/:name',  decksController.getByName);
router.post('/decks/:user/:name',  decksController.post);

app
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods());
	
console.log('listening on port 1337');
app.listen(1337);