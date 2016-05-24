'use strict';

let five = require('johnny-five'),
  eventEmitter = require('../../event-emitter'),
  logService = require('./../../services/log-service');

class Light {
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
      let errorMessage = 'Light already turned on: ' + this.key;
      logService.warn(errorMessage);
      return Promise.reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    this.state.value = true;
    this.fiveObjects.relay.on();
    eventEmitter.emit('component-state-changed');
    logService.debug('Light turned on: ' + this.key);
    return Promise.resolve();
  }

  off () {
    if (!this.state.value) {
      let errorMessage = 'Light already turned off: ' + this.key;
      logService.warn(errorMessage);
      return Promise.reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    this.state.value = false;
    this.fiveObjects.relay.off();
    eventEmitter.emit('component-state-changed');
    logService.debug('Light turned off: ' + this.key);
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

module.exports = Light;