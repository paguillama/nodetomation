'use strict';

var Fan = require('./../../hardware/components/fan'),
    logService = require('./../log-service');

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
    var errorMessage = 'Fan key already exists: ' + setup.key;
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

function turnOn(key) {
  var component = components[key].hardwareComponent;
  if (!component) {
    var errorMessage = 'Fan not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.on();
}

function turnOff(key) {
  var component = components[key].hardwareComponent;
  if (!component) {
    var errorMessage = 'Fan not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.off();
}

function get(key) {
  var component = components[key];
  if (!component) {
    var errorMessage = 'Fan not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  var defaultAction = component.hardwareComponent.state.value ? 'turn-off' : 'turn-on';
  return Promise.resolve({
    name: component.hardwareComponent.name,
    key: component.key,
    typeKey: 'fan',
    state: component.hardwareComponent.state,
    coordinates: component.coordinates,
    defaultAction: defaultAction,
    actions: [defaultAction]
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
//# sourceMappingURL=fan-service.js.map
