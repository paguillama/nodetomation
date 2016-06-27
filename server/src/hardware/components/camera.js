'use strict';

let eventEmitter = require('../../event-emitter'),
  logService = require('../../services/log-service'),
  exec = require('child_process').exec;

class Camera {
  constructor(setup) {
    this.key = setup.key;
    this.name = setup.name;
    this.state = {
      value: !setup.startCommand,
      url: setup.url
    };
    this.config = setup;
  }

  startStreaming() {
    if (this.state.value) {
      // TODO - return something
      return Promise.reject({
        code: 'BADREQUEST'
      });
    }

    if (this.config.startCommand) {
      return runCommand(this.config.startCommand)
        .then(() => this.state.value = true);
    }

    return Promise.resolve();
  }

  stopStreaming() {
    if (!this.state.value) {
      return Promise.reject({
        code: 'BADREQUEST'
      });
    }

    if (this.config.stopCommand) {
      return runCommand(this.config.stopCommand)
        .then(() => this.state.value = false);
    }

    return Promise.resolve();
  }
}

function runCommand (command) {
  return new Promise((resolve, reject) => {
    let wasRejected = false;
    let requestedData = false;

    function setStateAndResolve () {
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