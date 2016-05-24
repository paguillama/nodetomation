'use strict';

let Fan = require('./../../hardware/components/fan'),
  logService = require('./../log-service');

let components = {};

function load (setup) {
  if(Object.prototype.toString.call(setup) === '[object Array]' ) {
    let promises = [];
    for (let setupItem of setup) {
      promises.push(loadItem(setupItem));
    }
    return Promise.all(promises);
  } else {
    return loadItem(setup);
  }
}

function loadItem (setup) {
  if (components[setup.key]) {
    let errorMessage = 'Fan key already exists: ' + setup.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  logService.debug('Fan loaded: ' + setup.key);
  components[setup.key] = {
    key: setup.key,
    name: setup.name,
    hardwareComponent: new Fan(setup),
    coordinates: setup.coordinates
  };
  return get(setup.key);
}

function turnOn (key) {
  let component = components[key].hardwareComponent;
  if (!component) {
    let errorMessage = 'Fan not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.on();
}

function turnOff (key) {
  let component = components[key].hardwareComponent;
  if (!component) {
    let errorMessage = 'Fan not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.off();
}

function get (key) {
  let component = components[key];
  if (!component) {
    let errorMessage = 'Fan not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  let defaultAction = component.hardwareComponent.state.value ? 'turn-off' : 'turn-on';
  return Promise.resolve({
    name: component.hardwareComponent.name,
    key: component.key,
    typeKey: 'fan',
    state: component.hardwareComponent.state,
    coordinates: component.coordinates,
    defaultAction: defaultAction,
    actions: [
      defaultAction
    ]
  });
}

module.exports = {
  get: get,
  load: load,
  actions: {
    'turn-on': turnOn,
    'turn-off': turnOff
  },
  events: {}
};