'use strict';

let events = {},
  eventRepository = require('../data-access/event-repository'),
  actionService = require('./action-service'),
  componentService = require('./component-service'),
  logService = require('./log-service');

function load () {
  return new Promise((resolve, reject) => {
    eventRepository.getAll().then(events => {
      let promises = events.map(event => {
        return loadEvent(event);
      });
      Promise.all(promises)
        .then(resolve)
        .catch(reject);
    }).catch(reject);
  });
}

function loadEvent (config) {
  return new Promise((resolve, reject) => {
    if (events[config.key]) {
      let errorMessage = 'Event key already exists: ' + config.key;
      logService.error(errorMessage);
      return reject({
        code: 'BADREQUEST',
        message: errorMessage
      });
    }

    events[config.key] = {
      name: config.name,
      key: config.key,
      config: config
    };

    config.componentEvents.forEach(componentEvent => {
      componentEvent.eventConfig.execute = () => {
        let promises = config.actions.map(action => {
          return actionService.execute(action.actionKey);
        });

        return Promise.all(promises);
      };

      componentService.event(componentEvent.componentKey, componentEvent.eventKey, componentEvent.eventConfig);
    });

    return get(config.key);
  });
}

function getAll (isDto) {
  let keys = Object.keys(events);

  let getPromises = keys.map((key) => {
    return get(key, isDto);
  });

  return Promise.all(getPromises);
}

function get (key, isDto) {
  if (!events[key]) {
    let errorMessage = 'Event key do not exists: ' + key;
    logService.error(errorMessage);
    return Promise.reject({
      code: 'NOTFOUND',
      message: errorMessage
    });
  }

  if (!isDto) {
    return Promise.resolve(events[key]);
  }

  return Promise.resolve({
    name: events[key].name,
    key: events[key].key
  });
}

module.exports = {
  load: load,
  get: get,
  getAll: getAll
};