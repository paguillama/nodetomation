'use strict';

let liveCommunicationService = require('../../services/live-communication-service'),
  eventEmitter = require('../../event-emitter'),
  request = require('request'),
  logService = require('../../services/log-service'),
  exec = require('child_process').exec;

class Camera {
  constructor(setup) {
    this.key = setup.key;
    this.name = setup.name;
    this.state = {
      value: false
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

    if (this.state.realValue) {
      this.state.value = true;
      eventEmitter.emit('component-state-changed');
      return Promise.resolve();
    }

    // TODO - use this when arrow functions work as expected
    let that = this;

    return new Promise((resolve, reject) => {
      let wasRejected = false;
      let requestedData = false;

      function requestAndResolve () {
        logService.debug('Streamer command ran: ' + that.config.streamerCommand);
        requestedData = true;
        requestData();
        that.state.value = true;
        resolve();
        eventEmitter.emit('component-state-changed');
      }

      // really? and security? maybe just run it as a daemon
      if (that.config.streamerCommand) {
        logService.debug('Running streamer command: ' + that.config.streamerCommand);
        exec(that.config.streamerCommand, function (error, stdout, stderr) {
          if (error !== null) {
            var message = 'Error running streamer command: ' + that.config.streamerCommand + '. Error: ' + JSON.stringify(error) + '. Stdout: ' + JSON.stringify(stdout) + '. stderr: ' + JSON.stringify(stderr);
            wasRejected = true;
            reject(message);
            logService.error(message);
          } else {
            requestAndResolve();
          }
        });

        setTimeout(function () {
          // WORKAROUND - because exec callback is not being executed until the process is finished
          if (!wasRejected && !requestedData) {
            requestAndResolve();
          }
        }, 2000);
      } else {
        requestAndResolve();
      }

      function requestData () {
        var requestStream = request(that.config.url);

        requestStream.on('error', function(err) {
          logService.error('Streamer request "' + that.config.key + '" error: ' + JSON.stringify(err));
        });

        requestStream.on('response', function() {
          logService.debug('Streamer response OK: ' + that.config.key);
        });

        requestStream.on('data', function (data) {
          liveCommunicationService.broadcast('nodeto-streaming' + (that.config.key ? '-' + that.config.key : ''), data.toString('base64'));
        });

        requestedData = true;
      }
    });
  }

  stopStreaming() {
    // TODO

    if (!this.state.value) {
      return Promise.reject({
        code: 'BADREQUEST'
      });
    }

    this.state.value = false;

    // TODO - remove it from startStreaming when stopStreaming is done
    this.state.realValue = true;

    eventEmitter.emit('component-state-changed');

    return Promise.resolve();
  }
}

module.exports = Camera;