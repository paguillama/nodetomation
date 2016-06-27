'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventEmitter = require('../../event-emitter'),
    logService = require('../../services/log-service'),
    exec = require('child_process').exec;

var Camera = function () {
  function Camera(setup) {
    _classCallCheck(this, Camera);

    this.key = setup.key;
    this.name = setup.name;
    this.state = {
      value: !setup.startCommand,
      url: setup.url
    };
    this.config = setup;
  }

  _createClass(Camera, [{
    key: 'startStreaming',
    value: function startStreaming() {
      var _this = this;

      if (this.state.value) {
        // TODO - return something
        return Promise.reject({
          code: 'BADREQUEST'
        });
      }

      if (this.config.startCommand) {
        return runCommand(this.config.startCommand).then(function () {
          return _this.state.value = true;
        });
      }

      return Promise.resolve();
    }
  }, {
    key: 'stopStreaming',
    value: function stopStreaming() {
      var _this2 = this;

      if (!this.state.value) {
        return Promise.reject({
          code: 'BADREQUEST'
        });
      }

      if (this.config.stopCommand) {
        return runCommand(this.config.stopCommand).then(function () {
          return _this2.state.value = false;
        });
      }

      return Promise.resolve();
    }
  }]);

  return Camera;
}();

function runCommand(command) {
  return new Promise(function (resolve, reject) {
    var wasRejected = false;
    var requestedData = false;

    function setStateAndResolve() {
      requestedData = true;
      resolve();
      eventEmitter.emit('component-state-changed');
    }

    // really? and security? maybe just run it as a daemon
    if (command) {
      logService.debug('Running streamer command: ' + command);
      exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          var message = 'Error running streamer command: ' + command + '. Error: ' + JSON.stringify(error) + '. Stdout: ' + JSON.stringify(stdout) + '. stderr: ' + JSON.stringify(stderr);
          wasRejected = true;
          reject(message);
          logService.error(message);
        } else {
          setStateAndResolve();
        }
      });

      setTimeout(function () {
        // WORKAROUND - because exec callback is not being executed until the process is finished
        if (!wasRejected && !requestedData) {
          setStateAndResolve();
        }
      }, 2000);
    } else {
      setStateAndResolve();
    }
  });
}

module.exports = Camera;
//# sourceMappingURL=camera.js.map
