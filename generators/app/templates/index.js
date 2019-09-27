'use strict';
const Config = require('./config');
const Restgoose = require('./app');

console.log('[[[ Env:  ]]]', process.env.NODE_ENV);

// ===[ BOOTSTRAPING  APP ]===
const server = new Restgoose('Restgoose-Server', Config);
server.StartServer();

// listen for TERM signal .e.g. kill
process.on('SIGTERM', server.gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', server.gracefulShutdown);
