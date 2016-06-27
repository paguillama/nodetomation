'use strict';

var dbManager = require('./db-manager');

function commonFactory(collectionName) {
  function getAll() {
    return new Promise(function (resolve, reject) {
      dbManager.db.collection(collectionName).find().toArray(function (err, items) {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  }

  function get(key) {
    return new Promise(function (resolve, reject) {
      dbManager.db.collection(collectionName).find(key).toArray(function (err, items) {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  }

  function remove(key) {
    return new Promise(function (resolve, reject) {
      dbManager.db.collection(collectionName).deleteOne({ key: key }, function (err, items) {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  }

  function add(item) {
    return new Promise(function (resolve, reject) {
      dbManager.db.collection(collectionName).insertOne(item, function (err, dbItem) {
        if (err) {
          reject(err);
        } else {
          resolve(dbItem);
        }
      });
    });
  }

  return {
    getAll: getAll,
    get: get,
    remove: remove,
    add: add
  };
}

module.exports = commonFactory;
//# sourceMappingURL=common-factory.js.map
