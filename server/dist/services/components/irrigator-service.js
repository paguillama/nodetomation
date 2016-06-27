'use strict';

var Irrigator = require('./../../hardware/components/irrigator'),
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
    var errorMessage = 'Irrigator key already exists: ' + setup.key;
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

function turnOn(key, actionOptions) {
  return new Promise(function (resolve, reject) {

    var component = components[key].hardwareComponent;
    if (!component) {
      var errorMessage = 'Irrigator not found: ' + key;
      logService.error(errorMessage);
      return reject({
        code: 'NOTFOUND',
        message: errorMessage
      });
    }

    var on = component.on();
    if (!actionOptions || !actionOptions.seconds) {
      on.then(resolve).catch(reject);
    } else {
      on.then(function () {
        setTimeout(function () {
          component.off().then(resolve).catch(reject);
        }, actionOptions.seconds * 1000);
      }).catch(reject);
    }
  });
}

function turnOff(key) {
  var component = components[key].hardwareComponent;
  if (!component) {
    var errorMessage = 'Irrigator not found: ' + key;
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
    var errorMessage = 'Irrigator not found: ' + key;
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
    typeKey: 'irrigator',
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
//# sourceMappingURL=irrigator-service.js.map
