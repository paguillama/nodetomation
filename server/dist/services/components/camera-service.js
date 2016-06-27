'use strict';

var Camera = require('../../hardware/components/camera'),
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
    var errorMessage = 'Camera key already exists: ' + setup.key;
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

  return get(setup.key).then(function (component) {
    logService.debug('Camera loaded: ' + setup.key);
    return component;
  }).catch(function (err) {
    logService.debug('Error getting camera after loading: ' + setup.key + '. Error: ' + JSON.stringify(err));
    return err;
  });
}

function startStreaming(key) {
  var component = components[key].hardwareComponent;
  if (!component) {
    var errorMessage = 'Camera not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.startStreaming();
}

function get(key) {
  var component = components[key];
  if (!component) {
    var errorMessage = 'Camera not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  var defaultAction = component.hardwareComponent.state.value ? 'stop-streaming' : 'start-streaming';
  return Promise.resolve({
    name: component.hardwareComponent.name,
    key: component.key,
    typeKey: 'camera',
    state: component.hardwareComponent.state,
    coordinates: component.coordinates,
    defaultAction: defaultAction,
    actions: [defaultAction]
  });
}

function stopStreaming(key) {
  var component = components[key].hardwareComponent;
  if (!component) {
    var errorMessage = 'Camera not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  return component.stopStreaming();
}

function getAll() {
  return Object.keys(components).map(function (key) {
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
//# sourceMappingURL=camera-service.js.map
