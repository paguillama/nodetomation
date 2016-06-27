'use strict';

var crypto = require('crypto'),
    jwt = require('jsonwebtoken');

var userRepository = require('../data-access/user-repository'),
    config = require('../config'),
    logService = require('./log-service');

/**
 * validatePassword
 * @description checks the given password against the one in the storage
 * @param givenPassword
 * @param userPassword
 * @returns {boolean}
 */
function validatePassword(givenPassword, userPassword) {
  return userPassword === getHash(givenPassword);
}

/**
 * getHash
 * @description returns a hash of a given password or false if it cannot create the hash
 * @param password
 * @returns {string|boolean}
 */
function getHash(password) {
  try {
    return crypto.createHmac('sha256', config.configuration.auth.salt).update(password, 'utf8').digest('hex');
  } catch (err) {
    logService.error('Error validating password', err);
    return false;
  }
}

/**
 * login
 * @description Evaluates the given credentials and returns a proper token
 * in the case the user is valid.
 * @params user: the user credentials
 * @returns {Promise}
 */
function login(username, password) {

  return new Promise(function (resolve, reject) {
    userRepository.get({
      username: username.toLowerCase()
    }).then(function (user) {
      user = user.length > 0 ? user[0] : null;
      if (!user || !validatePassword(password, user.password)) {
        return reject({ code: 'BADREQUEST' });
      }
      resolve({
        token: getToken(user),
        user: {
          username: user.username
        }
      });
    }, function (error) {
      logService.error(error);
      reject(error);
    });
  });
}

/**
 * getToken
 * @description Get a new signed token from JWT for the given user.
 * @param user
 */
function getToken(user) {
  return jwt.sign({
    username: user.username,
    id: user._id
  }, config.configuration.auth.secret);
}

/**
 * load
 * @description Checks the --add-admin argument and adds the admin if there are no users in the storage.
 * @returns {Promise}
 */
function load() {
  logService.debug('Loading authentication');
  var addAdmin = process.argv.slice(2).filter(function (argument) {
    return argument === '--add-admin';
  })[0];

  if (!addAdmin) {
    return Promise.resolve();
  }

  logService.debug('Add admin flag');
  return userRepository.getAll().then(function (users) {
    if (!users.length) {
      return userRepository.add({
        username: 'admin',
        password: getHash('admin')
      }).then(function () {
        return logService.info('Admin user added');
      }).catch(function (err) {
        logService.error('Error adding admin user', err);
        throw err;
      });
    }
  }).catch(function (err) {
    logService.error('Error getting all users', err);
    throw err;
  });
}

module.exports = {
  login: login,
  load: load
};
//# sourceMappingURL=authentication-service.js.map
