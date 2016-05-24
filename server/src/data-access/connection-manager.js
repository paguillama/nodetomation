'use strict';

let MongoClient = require('mongodb').MongoClient,
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
  return new Promise((resolve, reject) => {
    delete dbManager.db;
    connectedMongoClient.close(err => {
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