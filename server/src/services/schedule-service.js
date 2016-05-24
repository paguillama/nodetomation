'use strict';

let CronJob = require('cron').CronJob,
  scheduleRepository = require('../data-access/schedule-repository'),
  logService = require('./log-service'),
  actionService = require('./action-service');

let scheduled = {};

function load () {
  return new Promise((resolve, reject) => {
    scheduleRepository.getAll()
      .then(schedules => {
        let promises = [];
        for (let schedule of schedules) {
          promises.push(loadSchedule(schedule));
        }
        Promise.all(promises)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

function loadSchedule (config) {
  if (scheduled[config.key]) {
    let errorMessage = 'Schedule task key already exists: ' + config.key;
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

  for(let task of config.tasks) {
    let onTick = task.actionKey ? () => actionService.execute(task.actionKey) : task.onTick;

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
  }

  return get(config.key);
}

function remove (key) {
  if (!scheduled[key]) {
    let errorMessage = 'Schedule task key do not exists: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  for(let task of scheduled[key].tasks) {
    task.cronJob.stop();
  }

  delete scheduled[key];
  return Promise.resolve();
}

function update (config) {
  return new Promise((resolve, reject) => {
    remove(config.key).then(() => {
      loadSchedule(config).then(resolve, reject);
    }, reject);
  });
}

function getAll () {
  let keys = Object.keys(scheduled);

  let getPromises = keys.map((key) => {
    return get(key);
  });

  return Promise.all(getPromises);
}

function get (key) {
  if (!scheduled[key]) {
    let errorMessage = 'Schedule key not found: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  let schedule = scheduled[key];

  let scheduleToReturn = {
    name: schedule.name,
    key: schedule.key,
    tasks: schedule.tasks.map(task => {
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