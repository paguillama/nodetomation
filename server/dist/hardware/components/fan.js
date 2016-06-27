'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var five = require('johnny-five'),
    eventEmitter = require('../../event-emitter'),
    logService = require('./../../services/log-service');

var Fan = function () {
  function Fan(setup) {
    _classCallCheck(this, Fan);

    this.fiveObjects = getFiveObjects(setup);
    this.key = setup.key;
    this.name = setup.name;
    this.state = {
      value: false
    };
  }

  _createClass(Fan, [{
    key: 'on',
    value: function on() {
      if (this.state.value) {
        var errorMessage = 'Fan already turned on: ' + this.key;
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
  }, {
    key: 'off',
    value: function off() {
      if (!this.state.value) {
        var errorMessage = 'Fan already turned off: ' + this.key;
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
  }]);

  return Fan;
}();

function getFiveObjects(setup) {
  var fiveSetup = {
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
//# sourceMappingURL=fan.js.map
