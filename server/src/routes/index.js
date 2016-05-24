'use strict';

let componentsRoute = require('./components'),
  loginRoute = require('./login'),
  schedulesRoute = require('./schedules'),
  streamingRoute = require('./streaming'),
  systemRoute = require('./system'),
  logsRoute = require('./logs'),
  apiBaseUrl = require('../config').configuration.routing.apiBaseUrl;

module.exports[apiBaseUrl + '/v1/system'] = systemRoute;
module.exports[apiBaseUrl + '/v1/logs'] = logsRoute;
module.exports[apiBaseUrl + '/v1/login'] = loginRoute;
module.exports[apiBaseUrl + '/v1/components'] = componentsRoute;
module.exports[apiBaseUrl + '/v1/schedules'] = schedulesRoute;
module.exports[apiBaseUrl + '/v1/streaming'] = streamingRoute;