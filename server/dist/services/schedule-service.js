'use strict';

var CronJob = require('cron').CronJob,
    scheduleRepository = require('../data-access/schedule-repository'),
    logService = require('./log-service'),
    actionService = require('./action-service');

var scheduled = {};

function load() {
  return new Promise(function (resolve, reject) {
    scheduleRepository.getAll().then(function (schedules) {
      var promises = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = schedules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var schedule = _step.value;

          promises.push(loadSchedule(schedule));
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

function loadSchedule(config) {
  if (scheduled[config.key]) {
    var errorMessage = 'Schedule task key already exists: ' + config.key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'BADREQUEST',
      message: errorMessage
    });
  }

  scheduled[config.key] = {
    name: config.name,
    key: config.key,
    start: config.start,
    tasks: []
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop = function _loop() {
      var task = _step2.value;

      var onTick = task.actionKey ? function () {
        return actionService.execute(task.actionKey);
      } : task.onTick;

      scheduled[config.key].tasks.push({
        key: task.key,
        cronTime: task.cronTime,
        actionKey: task.actionKey,
        cronJob: new CronJob({
          cronTime: task.cronTime,
          onTick: onTick,
          start: config.start !== false && task.start !== false
        })
      });
    };

    for (var _iterator2 = config.tasks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return get(config.key);
}

function remove(key) {
  if (!scheduled[key]) {
    var errorMessage = 'Schedule task key do not exists: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = scheduled[key].tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _task = _step3.value;

      _task.cronJob.stop();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  delete scheduled[key];
  return Promise.resolve();
}

function update(config) {
  return new Promise(function (resolve, reject) {
    remove(config.key).then(function () {
      loadSchedule(config).then(resolve, reject);
    }, reject);
  });
}

function getAll() {
  var keys = Object.keys(scheduled);

  var getPromises = keys.map(function (key) {
    return get(key);
  });

  return Promise.all(getPromises);
}

function get(key) {
  if (!scheduled[key]) {
    var errorMessage = 'Schedule key not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  var schedule = scheduled[key];

  var scheduleToReturn = {
    name: schedule.name,
    key: schedule.key,
    tasks: schedule.tasks.map(function (task) {
      return {
        key: task.key,
        cronTime: task.cronTime,
        actionKey: task.actionKey
      };
    })
  };

  return Promise.resolve(scheduleToReturn);
}

module.exports = {
  getAll: getAll,
  get: get,
  load: load,
  update: update,
  remove: remove
};
//# sourceMappingURL=schedule-service.js.map
