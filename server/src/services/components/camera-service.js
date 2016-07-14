'use strict';

let Camera = require('../../hardware/components/camera'),
  logService = require('./../log-service');

let components = {};

function load (setup) {
  if(Object.prototype.toString.call(setup) === '[object Array]' ) {
    return Promise.all(setup.map(setupItem => loadItem(setupItem)));
  } else {
    return loadItem(setup);
  }
}

function loadItem (setup) {
  if (components[setup.key]) {
    let errorMessage = 'Camera key already exists: ' + setup.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  components[setup.key] = {
    key: setup.key,
    name: setup.name,
    hardwareComponent: new Camera(setup),
    coordinates: setup.coordinates
  };

  return get(setup.key)
    .then(component => {
      logService.debug('Camera loaded: ' + setup.key);
      return component;
    })
    .catch(err => {
      logService.debug('Error getting camera after loading: ' + setup.key + '. Error: ' + JSON.stringify(err));
      return err;
    });
}

function startStreaming (key) {
  let component = components[key].hardwareComponent;
  if (!component) {
    let errorMessage = 'Camera not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.startStreaming();
}

function get (key) {
  let component = components[key];
  if (!component) {
    let errorMessage = 'Camera not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  let defaultAction = component.hardwareComponent.state.value ? 'stop-streaming' : 'start-streaming';
  return Promise.resolve({
    name: component.hardwareComponent.name,
    key: component.key,
    typeKey: 'camera',
    state: component.hardwareComponent.state,
    coordinates: component.coordinates,
    defaultAction: defaultAction,
    actions: [
      defaultAction
    ]
  });
}

function stopStreaming (key) {
  let component = components[key].hardwareComponent;
  if (!component) {
    let errorMessage = 'Camera not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.stopStreaming();
}

function getAll () {
  return Object.keys(components).map(key => {
    return {
      key: key
    };
  });
}

module.exports = {
  get: get,
  getAll: getAll,
  load: load,
  actions: {
    'start-streaming': startStreaming,
    'stop-streaming': stopStreaming
  },
  events: {}
};