'use strict';

let five = require('johnny-five'),
  eventEmitter = require('../../event-emitter'),
  logService = require('./../../services/log-service');

class Irrigator {
  constructor (setup) {
    this.fiveObjects = getFiveObjects(setup);
    this.key = setup.key;
    this.name = setup.name;
    this.state = {
      value: false
    };
  }

  on () {
    if (this.state.value) {
      let errorMessage = 'Irrigator already turned on: ' + this.key;
      logService.warn(errorMessage);
      return Promise.reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    this.fiveObjects.relay.on();
    this.state.value = true;
    logService.debug('Irrigator turned on: ' + this.key);
    eventEmitter.emit('component-state-changed');
    return Promise.resolve();
  }

  off () {
    if (!this.state.value) {
      let errorMessage = 'Irrigator already turned off: ' + this.key;
      logService.warn(errorMessage);
      return Promise.reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    this.fiveObjects.relay.off();
    this.state.value = false;
    eventEmitter.emit('component-state-changed');
    logService.debug('Irrigator turned off: ' + this.key);
    return Promise.resolve();
  }
}

function getFiveObjects (setup) {
  let fiveSetup = {
    pin: setup.pin,
    type: 'NC'
  };

  if (setup.board) {
    fiveSetup.board = setup.board;
  }

  return {
    relay: new five.Relay(fiveSetup)
  };
}

module.exports = Irrigator;