'use strict';

const crypto = require('crypto'),
  jwt = require('jsonwebtoken');

let userRepository = require('../data-access/user-repository'),
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
    return crypto.createHmac('sha256', config.configuration.auth.salt)
      .update(password, 'utf8')
      .digest('hex');
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

  return new Promise((resolve, reject) => {
    userRepository.get({
      username: username.toLowerCase()
    }).then(user => {
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
    }, error => {
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
function load () {
  logService.debug('Loading authentication');
  let addAdmin = process.argv
    .slice(2)
    .filter(argument => {
      return argument === '--add-admin';
    })[0];

  if (!addAdmin) {
    return Promise.resolve();
  }

  logService.debug('Add admin flag');
  return userRepository
    .getAll()
    .then(users => {
      if (!users.length) {
        return userRepository.add({
          username : 'admin',
          password : getHash('admin')
        }).then(() => logService.info('Admin user added'))
          .catch(err => {
            logService.error('Error adding admin user', err);
            throw err;
          });
      }
    })
    .catch(err => {
      logService.error('Error getting all users', err);
      throw err;
    });
}

module.exports = {
  login: login,
  load: load
};