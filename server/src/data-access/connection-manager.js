'use strict';

let MongoClient = require('mongodb').MongoClient,
  logService = require('../services/log-service'),
  dbManager = require('./db-manager');

let manager = {
  connect: connect,
  close: closeConnection
};

let connectedMongoClient;

function connect (connectionString) {
  return new Promise((resolve, reject) => {
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

function closeConnection () {
  logService.debug('Closing database connection');
  return new Promise((resolve, reject) => {
    delete dbManager.db;
    connectedMongoClient.close(err => {
      if (err) {
        logService.error('Error closing database connection', err);
        reject();
      } else {
        logService.debug('Database connection closed');
        connectedMongoClient = null;
        resolve();
      }
    });
  });
}

module.exports = manager;