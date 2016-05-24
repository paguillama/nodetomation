'use strict';

/**
 * Module dependencies.
 */

let http = require('http'),
  app = require('../app'),
  liveCommunicationService = require('../services/live-communication-service'),
  systemService = require('../services/system-service'),
  logService = require('../services/log-service');

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
let server = http.createServer(app);

/**
 * Injects live communication.
 */
liveCommunicationService.config(server);

systemService.addShutdownAction(() => {
  return new Promise((resolve, reject) => {
    logService.info('Shutting down web server');
    server.close(err => {
      if (err) {
        logService.error('Error shutting down web server: ' + err);
        reject();
      } else {
        logService.info('The web server was shut down');
        resolve();
      }
    });
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    logService.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    logService.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address(),
    bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  logService.info('Listening at ' + bind);
}

module.exports = server;