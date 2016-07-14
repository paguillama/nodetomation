'use strict';

let Thermometer = require('./../../hardware/components/thermometer'),
  logService = require('./../log-service'),
  config = require('../../config');

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
    let errorMessage = 'Thermometer key already exists: ' + setup.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  setup.unit = config.configuration.regional.units.temperature;

  components[setup.key] = {
    key: setup.key,
    name: setup.name,
    hardwareComponent: new Thermometer(setup),
    coordinates: setup.coordinates
  };
  logService.debug('Thermometer loaded: ' + setup.key);
  return get(setup.key);
}

function temperatureMoreThan (key, config) {
  // TODO - maybe promise-based?

  let component = components[key];
  if (component) {
    let shouldTrigger = true;

    component.hardwareComponent.onChange(state => {
      if (shouldTrigger && config.value <= state.value) {
        config.execute();
        shouldTrigger = false;
      }

      if (config.triggerAfterBelow > state.value && !shouldTrigger) {
        shouldTrigger = true;
      }
    });
  } // TODO - else
}

function temperatureLessThan (key, config) {
  // TODO - maybe promise-based?

  let component = components[key];
  if (component) {
    let shouldTrigger = true;

    component.hardwareComponent.onChange(state => {
      if (shouldTrigger && config.value >= state.value) {
        config.execute();
        shouldTrigger = false;
      }

      if (config.triggerAfterAbove < state.value && !shouldTrigger) {
        shouldTrigger = true;
      }
    });
  } // TODO - else
}

function get (key) {
  let component = components[key];
  if (!component) {
    let errorMessage = 'Thermometer not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return Promise.resolve({
    name: component.name,
    key: component.key,
    typeKey: 'thermometer',
    state: component.hardwareComponent.state,
    coordinates: component.coordinates,
    actions: []
  });
}

module.exports = {
  get: get,
  load: load,
  actions: {},
  events: {
    'temperature-more-than': temperatureMoreThan,
    'temperature-less-than': temperatureLessThan
  }
};