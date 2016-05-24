'use strict';

let socketIo = require('socket.io'),
  logService = require('./log-service'),
  io;

function config (http) {
  io = socketIo(http);
}

function broadcast (channel, message) {
  if (io) {
    io.emit(channel, message);
  } else {
    logService.error('Live-communication broadcast without config. Channel: ' + channel + '. Message: ' + JSON.stringify(message));
  }
}

module.exports = {
  config: config,
  broadcast: broadcast
};