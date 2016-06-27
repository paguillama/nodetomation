'use strict';

var MongoClient = require('mongodb').MongoClient,
    dbManager = require('./db-manager');

var manager = {
  connect: connect,
  close: closeConnection
};

var connectedMongoClient = void 0;

function connect(connectionString) {
  return new Promise(function (resolve, reject) {
    if (dbManager.db) {
      return reject('connection already exists');
    }
    if (connectedMongoClient) {
      // TODO - I'm not sure about this
      return reject('connection attempt already exists');
    }
    // TODO - check configuration - authentication;
    connectedMongoClient = MongoClient.connect(connectionString, function (err, db) {
      dbManager.db = db;
      resolve();
    });
  });
}

function closeConnection() {
  return new Promise(function (resolve, reject) {
    delete dbManager.db;
    connectedMongoClient.close(function (err) {
      if (err) {
        reject();
      } else {
        connectedMongoClient = null;
        resolve();
      }
    });
  });
}

module.exports = manager;
//# sourceMappingURL=connection-manager.js.map
