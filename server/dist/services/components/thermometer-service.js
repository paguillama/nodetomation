'use strict';

var Thermometer = require('./../../hardware/components/thermometer'),
    logService = require('./../log-service'),
    config = require('../../config');

var components = {};

function load(setup) {
  if (Object.prototype.toString.call(setup) === '[object Array]') {
    var promises = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = setup[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var setupItem = _step.value;

        promises.push(loadItem(setupItem));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return Promise.all(promises);
  } else {
    return loadItem(setup);
  }
}

function loadItem(setup) {
  if (components[setup.key]) {
    var errorMessage = 'Thermometer key already exists: ' + setup.key;
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

function temperatureMoreThan(key, config) {
  // TODO - maybe promise-based?

  var component = components[key];
  if (component) {
    (function () {
      var shouldTrigger = true;

      component.hardwareComponent.onChange(function (state) {
        if (shouldTrigger && config.value <= state.value) {
          config.execute();
          shouldTrigger = false;
        }

        if (config.triggerAfterBelow > state.value && !shouldTrigger) {
          shouldTrigger = true;
        }
      });
    })();
  } // TODO - else
}

function temperatureLessThan(key, config) {
  // TODO - maybe promise-based?

  var component = components[key];
  if (component) {
    (function () {
      var shouldTrigger = true;

      component.hardwareComponent.onChange(function (state) {
        if (shouldTrigger && config.value >= state.value) {
          config.execute();
          shouldTrigger = false;
        }

        if (config.triggerAfterAbove < state.value && !shouldTrigger) {
          shouldTrigger = true;
        }
      });
    })();
  } // TODO - else
}

function get(key) {
  var component = components[key];
  if (!component) {
    var errorMessage = 'Thermometer not found: ' + key;
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
//# sourceMappingURL=thermometer-service.js.map
