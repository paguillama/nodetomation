'use strict';

var actions = {},
    actionRepository = require('../data-access/action-repository'),
    componentService = require('./component-service'),
    logService = require('./log-service');

function load() {
  return new Promise(function (resolve, reject) {
    actionRepository.getAll().then(function (actions) {
      var promises = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var action = _step.value;

          promises.push(loadAction(action));
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

      Promise.all(promises).then(resolve).catch(reject);
    }).catch(reject);
  });
}

function loadAction(config) {
  if (actions[config.key]) {
    var errorMessage = 'Action key already exists: ' + config.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  actions[config.key] = {
    name: config.name,
    key: config.key,
    execute: function execute() {
      logService.info('Executing action: ' + config.key);
      var promises = config.componentActions.map(function (componentAction) {
        return componentService.action(componentAction.componentKey, componentAction.actionKey, componentAction.actionOptions);
      });

      return Promise.all(promises);
    }
  };
  return get(config.key);
}

function execute(key) {
  return new Promise(function (resolve, reject) {
    get(key).then(function (action) {
      action.execute().then(resolve).catch(reject);
    });
  });
}

function getAll(isDto) {
  var keys = Object.keys(actions);

  var getPromises = keys.map(function (key) {
    return get(key, isDto);
  });

  return Promise.all(getPromises);
}

function get(key, isDto) {
  if (!actions[key]) {
    var errorMessage = 'Action key do not exists: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  if (!isDto) {
    return Promise.resolve(actions[key]);
  }

  return Promise.resolve({
    name: actions[key].name,
    key: actions[key].key
  });
}

module.exports = {
  load: load,
  get: get,
  getAll: getAll,
  execute: execute
};
//# sourceMappingURL=action-service.js.map
