'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var winston = require('winston'),
    moment = require('moment'),
    extend = require('util')._extend,
    transports = require('./transports'),
    config = require('../../config');

var defaultWinstonFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

var winstonLogger = new winston.Logger();

var loggerTransports = [];

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

function log(level, text, metadata) {
  if (metadata) {
    // TODO Removing stringify winston stores only the metadata on log
    winstonLogger.log(level, text, JSON.stringify(metadata));
  } else {
    winstonLogger.log(level, text);
  }
}

function logFactory(level) {
  return function (text, metadata) {
    log(level, text, metadata);
  };
}

function configure(config) {
  // TODO - use winstonLogger.configure or remove old
  // transports before adding the new config ones
  var transport = void 0;
  config.transports.forEach(function (transportConfig) {
    transportConfig = extend({}, transportConfig);
    transport = transports[transportConfig.type];
    if (transport) {
      if (transportConfig.nodetoConfig && transportConfig.nodetoConfig.timestampFormat) {
        transportConfig.winstonConfig.timestamp = function () {
          return moment().format(transportConfig.nodetoConfig.timestampFormat);
        };
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

function get(key) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var loggerTransport = _step.value;

      if (loggerTransport.transport.get) {
        return {
          v: loggerTransport.transport.get(key).then(function (logData) {
            logData.logs = logData.logs.reverse().map(function (logItem) {
              if (logItem.timestamp) {
                var format = loggerTransport.config.nodetoConfig && loggerTransport.config.nodetoConfig.timestampFormat || defaultWinstonFormat;
                var momentDate = moment(logItem.timestamp, format, true);
                logItem.timeLabel = momentDate.isValid() ? momentDate.format(config.configuration.regional.instantTimeFormat) : logItem.timestamp;
              }
              return logItem;
            });
            return logData;
          })
        };
      }
    };

    for (var _iterator = loggerTransports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ret = _loop();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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

  return Promise.reject({
    message: 'No logging source registered',
    code: 'NOTFOUND'
  });
}

function getAll() {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = loggerTransports[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _loggerTransport = _step2.value;

      if (_loggerTransport.transport.getAll) {
        return _loggerTransport.transport.getAll();
      }
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

  return Promise.reject({
    message: 'No logging source registered',
    code: 'NOTFOUND'
  });
}
//# sourceMappingURL=log-service.js.map
