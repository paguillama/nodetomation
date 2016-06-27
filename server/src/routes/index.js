'use strict';

let componentsRoute = require('./components'),
  loginRoute = require('./login'),
  schedulesRoute = require('./schedules'),
  apiStreamingRoute = require('./api-streaming'),
  streamingRoute = require('./streaming'),
  systemRoute = require('./system'),
  logsRoute = require('./logs'),
  routing = require('../config').configuration.routing;

let routes = {};

// API
routes[routing.apiBaseUrl + '/v1/system'] = systemRoute;
routes[routing.apiBaseUrl + '/v1/logs'] = logsRoute;
routes[routing.apiBaseUrl + '/v1/login'] = loginRoute;
routes[routing.apiBaseUrl + '/v1/components'] = componentsRoute;
routes[routing.apiBaseUrl + '/v1/schedules'] = schedulesRoute;
routes[routing.apiBaseUrl + '/v1/streaming'] = apiStreamingRoute;

// STREAMING
routes[routing.streamingBaseUrl + '/v1/'] = streamingRoute;

module.exports = routes;