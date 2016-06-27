'use strict';

var Client = require('ssh2').Client,
    moment = require('moment'),
    config = require('../config'),
    logService = require('./log-service'),
    shutdownManager = require('node-shutdown-manager').createShutdownManager({
  timeout: 5000,
  logger: {
    log: function log(message) {
      return logService.info(message);
    }
  }
});

function shutdown() {
  logService.info('Shutting down server');
  return new Promise(function (resolve, reject) {
    var conn = new Client();
    conn.on('ready', function () {
      conn.exec('sudo shutdown now', function (err, stream) {
        if (err) {
          logService.error('Shutting down command error: ', err);
          reject(err);
          return;
        }

        stream.on('close', function () {
          conn.end();
          resolve();
        });
      });
    });

    conn.on('error', function (err) {
      logService.error('Shutting down connection error: ', err);
      reject(err);
    });

    conn.connect({
      host: '127.0.0.1',
      port: 22,
      username: config.configuration.shutdown.username,
      password: config.configuration.shutdown.password
    });
  });
}

function addShutdownAction(shutdownAction) {
  shutdownManager.addShutdownAction(shutdownAction);
}

function getStatus() {
  return Promise.resolve({
    // TODO - do not hardcode format here
    systemTime: moment().format()
  });
}

module.exports = {
  shutdown: shutdown,
  getStatus: getStatus,
  addShutdownAction: addShutdownAction
};
//# sourceMappingURL=system-service.js.map
