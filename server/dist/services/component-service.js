'use strict';

var logService = require('./log-service'),
    eventEmitter = require('../event-emitter'),
    componentRepository = require('../data-access/component-repository'),
    liveCommunicationService = require('./live-communication-service');

var servicesMap = {
  fan: require('./components/fan-service'),
  light: require('./components/light-service'),
  irrigator: require('./components/irrigator-service'),
  camera: require('./components/camera-service'),
  thermometer: require('./components/thermometer-service')
};

var componentsKeyServiceMap = {},
    componentKeys = [];

function get(key) {
  var typeKey = componentsKeyServiceMap[key];
  if (!typeKey) {
    var errorMessage = 'Component key not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return servicesMap[typeKey].get(key);
}

function getAll() {
  var promises = componentKeys.map(function (componentKey) {
    return servicesMap[componentsKeyServiceMap[componentKey]].get(componentKey);
  });

  return Promise.all(promises);
}

function load() {
  return new Promise(function (resolve, reject) {
    componentRepository.getAll().then(function (components) {
      var promises = components.map(function (component) {
        return loadComponent(component);
      });
      Promise.all(promises).then(function (componentData) {
        emitComponentChange();

        resolve(componentData);
      }).catch(reject);
    }).catch(reject);
  });
}

function loadComponent(setup) {
  logService.debug('Loading ' + setup.key);
  var service = servicesMap[setup.typeKey];
  if (!service) {
    return Promise.reject('Component type key not found: ' + setup.typeKey);
  }

  return service.load(setup).then(function (data) {
    componentsKeyServiceMap[setup.key] = setup.typeKey;
    componentKeys.push(setup.key);
    return data;
  });
}

function action(componentKey, actionKey, actionOptions) {
  var typeKey = componentsKeyServiceMap[componentKey];
  if (!typeKey) {
    var errorMessage = 'Component key not found: ' + componentKey;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }
  if (!servicesMap[typeKey].actions[actionKey]) {
    var _errorMessage = 'Action key ' + actionKey + ' not found for component key ' + componentKey;
    logService.error(_errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: _errorMessage
    });
  }

  return servicesMap[typeKey].actions[actionKey](componentKey, actionOptions);
}

function event(componentKey, eventKey, config) {
  var typeKey = componentsKeyServiceMap[componentKey];
  if (!typeKey) {
    var errorMessage = 'Component key not found: ' + componentKey;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }
  if (!servicesMap[typeKey].events[eventKey]) {
    var _errorMessage2 = 'Event key ' + eventKey + ' not found for component key ' + componentKey;
    logService.error(_errorMessage2);
    return Promise.reject({
      code: 'NOTFOUND',
      message: _errorMessage2
    });
  }

  return servicesMap[typeKey].events[eventKey](componentKey, config);
}

function init() {
  eventEmitter.on('component-state-changed', emitComponentChange);
}

function emitComponentChange() {
  getAll().then(function (componentsData) {
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
//# sourceMappingURL=component-service.js.map
