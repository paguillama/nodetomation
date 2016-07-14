'use strict';

let logService = require('./log-service'),
  eventEmitter = require('../event-emitter'),
  componentRepository = require('../data-access/component-repository'),
  boardService = require('./board-service'),
  liveCommunicationService = require('./live-communication-service');

let servicesMap = {
  fan: require('./components/fan-service'),
  light: require('./components/light-service'),
  irrigator: require('./components/irrigator-service'),
  camera: require('./components/camera-service'),
  thermometer: require('./components/thermometer-service')
};

let componentsKeyServiceMap = {},
  componentKeys = [];

function get (key) {
  let typeKey = componentsKeyServiceMap[key];
  if (!typeKey) {
    let errorMessage = 'Component key not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return servicesMap[typeKey].get(key);
}

function getAll () {
  let promises = componentKeys.map(componentKey => {
    return servicesMap[componentsKeyServiceMap[componentKey]].get(componentKey);
  });

  return Promise.all(promises);
}

function load () {
  return new Promise((resolve, reject) => {
    componentRepository.getAll()
      .then(components => {
        let promises = components.map(component => loadComponent(component));
        Promise.all(promises)
          .then(componentData => {
            emitComponentChange();
            resolve(componentData);
          })
          .catch(reject);

      }).catch(reject);
  });
}

function loadComponent (setup) {
  return new Promise((resolve, reject) => {
    logService.debug(`Loading component: ${setup.key}`);
    let service = servicesMap[setup.typeKey];
    if (!service) {
      return reject(`Component type key not found: ${setup.typeKey}`);
    }

    if (setup.board) {
      if (!boardService.boardsMap[setup.board]) {
        let message = `Board not found: ${setup.board}`;
        logService.debug(message);
        return reject(message);
      }
      setup.board = boardService.boardsMap[setup.board];
    }

    service.load(setup)
      .then(data => {
        componentsKeyServiceMap[setup.key] = setup.typeKey;
        componentKeys.push(setup.key);
        resolve(data);
      })
      .catch(reject);
  });
}

function action (componentKey, actionKey, actionOptions) {
  let typeKey = componentsKeyServiceMap[componentKey];
  if (!typeKey) {
    let errorMessage = `Component key not found: ${componentKey}`;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }
  if (!servicesMap[typeKey].actions[actionKey]) {
    let errorMessage = `Action key ${actionKey} not found for component key ${componentKey}`;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return servicesMap[typeKey].actions[actionKey](componentKey, actionOptions);
}

function event (componentKey, eventKey, config) {
  let typeKey = componentsKeyServiceMap[componentKey];
  if (!typeKey) {
    let errorMessage = `Component key not found: ${componentKey}`;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }
  if (!servicesMap[typeKey].events[eventKey]) {
    let errorMessage = `Event key ${eventKey} not found for component key ${componentKey}`;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return servicesMap[typeKey].events[eventKey](componentKey, config);
}

function init () {
  eventEmitter.on('component-state-changed', emitComponentChange);
}

function emitComponentChange () {
  getAll().then(componentsData => {
    liveCommunicationService.broadcast('nodeto-components', componentsData);
  });
}

init();

module.exports = {
  get: get,
  getAll: getAll,
  load: load,
  action: action,
  event: event
};