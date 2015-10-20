const http = require('http');
const https = require('https');
const fs = require('fs');

const app = require('koa')();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

const decksController = require('./controllers/decks');

// Init routing
console.log('Setting up routes');
router.get('/decks', decksController.getAll);
router.get('/decks/@:hash',  decksController.getByHash);
router.get('/decks/:user',  decksController.getByUser);
router.get('/decks/:user/:name',  decksController.getByName);
router.post('/decks/:user/:name',  decksController.post);

console.log('Starting app');
app
	.use(cors())
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods());
	
console.log('Loading SSL cert');
const httpsOptions = {
	pfx: fs.readFileSync('sslcert.pfx'),
	passphrase: 'hunter2',
};

console.log('Listening on //api.decknexus.127.0.0.1.xip.io');
const hostname = 'api.decknexus.127.0.0.1.xip.io';

http
	.createServer(
		app.callback())
	.listen(80, hostname);
https
	.createServer(
		httpsOptions,
		app.callback())
	.listen(443, hostname);