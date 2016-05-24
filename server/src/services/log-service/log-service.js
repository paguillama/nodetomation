'use strict';

let winston = require('winston'),
  moment = require('moment'),
  extend = require('util')._extend,
  transports = require('./transports'),
  config = require('../../config');

let defaultWinstonFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

let winstonLogger = new winston.Logger();

let loggerTransports = [];

module.exports = {
  configure: configure,
  log: log,
  get: get,
  getAll: getAll,
  error: logFactory('error'),
  warn: logFactory('warn'),
  info: logFactory('info'),
  verbose: logFactory('verbose'),
  debug: logFactory('debug'),
  silly: logFactory('silly')
};

function log (level, text, metadata) {
  if (metadata) {
    // TODO Removing stringify winston stores only the metadata on log
    winstonLogger.log(level, text, JSON.stringify(metadata));
  } else {
    winstonLogger.log(level, text);
  }
}

function logFactory (level) {
  return function (text, metadata) {
    log(level, text, metadata);
  };
}

function configure (config) {
  // TODO - use winstonLogger.configure or remove old
  // transports before adding the new config ones
  let transport;
  config.transports.forEach(transportConfig => {
    transportConfig = extend({}, transportConfig);
    transport = transports[transportConfig.type];
    if (transport) {
      if (transportConfig.nodetoConfig && transportConfig.nodetoConfig.timestampFormat) {
        transportConfig.winstonConfig.timestamp = () => moment().format(transportConfig.nodetoConfig.timestampFormat);
      }

      winstonLogger.add(transport.winstonTransport, transportConfig.winstonConfig);
      if (transport.configure) {
        transportConfig.logMethod = log;
        transport.configure(transportConfig);
      }
      loggerTransports.push({
        transport: transport,
        config: transportConfig
      });
    }
  });
}

function get (key) {
  for(let loggerTransport of loggerTransports) {
    if (loggerTransport.transport.get) {
      return loggerTransport.transport
        .get(key)
        .then(logData => {
          logData.logs = logData.logs
            .reverse()
            .map(logItem => {
              if (logItem.timestamp) {
                let format = loggerTransport.config.nodetoConfig && loggerTransport.config.nodetoConfig.timestampFormat || defaultWinstonFormat;
                let momentDate = moment(logItem.timestamp, format, true);
                logItem.timeLabel = momentDate.isValid() ? momentDate.format(config.configuration.regional.instantTimeFormat) : logItem.timestamp;
              }
              return logItem;
            });
          return logData;
        });
    }
  }

  return Promise.reject({
    message: 'No logging source registered',
    code: 'NOTFOUND'
  });
}

function getAll () {
  for(let loggerTransport of loggerTransports) {
    if (loggerTransport.transport.getAll) {
      return loggerTransport.transport.getAll();
    }
  }

  return Promise.reject({
    message: 'No logging source registered',
    code: 'NOTFOUND'
  });
}