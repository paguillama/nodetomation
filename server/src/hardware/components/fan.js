'use strict';

let five = require('johnny-five'),
  eventEmitter = require('../../event-emitter'),
  logService = require('./../../services/log-service');

class Fan {
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
      let errorMessage = 'Fan already turned on: ' + this.key;
      logService.warn(errorMessage);
      return Promise.reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    this.fiveObjects.relay.on();
    this.state.value = true;
    eventEmitter.emit('component-state-changed');
    logService.debug('Fan turned on: ' + this.key);
    return Promise.resolve();
  }

  off () {
    if (!this.state.value) {
      let errorMessage = 'Fan already turned off: ' + this.key;
      logService.warn(errorMessage);
      return Promise.reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    this.fiveObjects.relay.off();
    this.state.value = false;
    eventEmitter.emit('component-state-changed');
    logService.debug('Fan turned off: ' + this.key);
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

module.exports = Fan;