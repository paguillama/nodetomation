'use strict';

let Irrigator = require('./../../hardware/components/irrigator'),
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
    let errorMessage = 'Irrigator key already exists: ' + setup.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  logService.debug('Irrigator loaded: ' + setup.key);
  components[setup.key] = {
    key: setup.key,
    name: setup.name,
    hardwareComponent: new Irrigator(setup),
    coordinates: setup.coordinates
  };
  return get(setup.key);
}

function turnOn (key, actionOptions) {
  return new Promise((resolve, reject) => {

    let component = components[key].hardwareComponent;
    if (!component) {
      let errorMessage = 'Irrigator not found: ' + key;
      logService.error(errorMessage);
      return reject({
        code: 'NOTFOUND',
        message: errorMessage
      });
    }

    let on = component.on();
    if (!actionOptions || !actionOptions.seconds) {
      on.then(resolve)
        .catch(reject);
    } else {
      on
        .then(() => {
          setTimeout(() => {
            component.off()
              .then(resolve)
              .catch(reject);
          }, actionOptions.seconds * 1000);
        })
        .catch(reject);
    }
  });
}

function turnOff (key) {
  let component = components[key].hardwareComponent;
  if (!component) {
    let errorMessage = 'Irrigator not found: ' + key;
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
    let errorMessage = 'Irrigator not found: ' + key;
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
    typeKey: 'irrigator',
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