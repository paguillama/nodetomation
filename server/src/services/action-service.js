'use strict';

let actions = {},
  actionRepository = require('../data-access/action-repository'),
  componentService = require('./component-service'),
  logService = require('./log-service');

function load () {
  return new Promise((resolve, reject) => {
    actionRepository.getAll().then(actions => {
      let promises = [];
      for (let action of actions) {
        promises.push(loadAction(action));
      }
      Promise.all(promises)
        .then(resolve)
        .catch(reject);
    }).catch(reject);
  });
}

function loadAction (config) {
  if (actions[config.key]) {
    let errorMessage = 'Action key already exists: ' + config.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  actions[config.key] = {
    name: config.name,
    key: config.key,
    execute: () => {
      logService.info('Executing action: ' + config.key);
      let promises = config.componentActions.map(componentAction => {
        return componentService.action(componentAction.componentKey, componentAction.actionKey, componentAction.actionOptions);
      });

      return Promise.all(promises);
    }
  };
  return get(config.key);
}

function execute (key) {
  return new Promise((resolve, reject) => {
    get(key).then(action => {
      action.execute()
        .then(resolve)
        .catch(reject);
    });
  });
}

function getAll (isDto) {
  let keys = Object.keys(actions);

  let getPromises = keys.map((key) => {
    return get(key, isDto);
  });

  return Promise.all(getPromises);
}

function get (key, isDto) {
  if (!actions[key]) {
    let errorMessage = 'Action key do not exists: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  if (!isDto) {
    return Promise.resolve(actions[key]);
  }

  return Promise.resolve({
    name: actions[key].name,
    key: actions[key].key
  });
}

module.exports = {
  load: load,
  get: get,
  getAll: getAll,
  execute: execute
};