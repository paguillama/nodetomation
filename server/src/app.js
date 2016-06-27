'use strict';

let express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  expressJwt = require('express-jwt');

let config = require('./config'),
  appConfig = config.setEnvironment(process.env.NODE_ENV),
  routes = require('./routes'),
  logService = require('./services/log-service'),
  dataAccess = require('./data-access'),
  boardService = require('./services/board-service'),
  componentService = require('./services/component-service'),
  actionService = require('./services/action-service'),
  scheduleService = require('./services/schedule-service'),
  eventService = require('./services/event-service'),
  systemService = require('./services/system-service'),
  authenticationService = require('./services/authentication-service');

let app = express();

let staticPath = path.join(__dirname, appConfig.routing.staticPath);

app.use(favicon(path.join(staticPath, '/assets/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressJwt({
  secret: appConfig.auth.secret
}).unless({ path: [
  '/',
  /^\/assets\//,
  /^\/fonts\//,
  '/api/v1/login',
  /^\/streaming\//
]}));

let routeKeys = Object.keys(routes);
for(let routeKey of routeKeys) {
  app.use(routeKey, routes[routeKey]);
}

logService.configure(appConfig.logging);

app.use(express.static(staticPath));

app.use(function (err, req, res, next) {
  /* eslint no-unused-vars: 0 */
  // Express error handling uses functions with four parameters.
  // We need the next parameter, otherwise the function will not be
  // recognized as an error handler

  res.locals.error = err;
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: appConfig.logging.sendErrorDetails ? err : {}
  });
});

dataAccess.connect(appConfig.dataAccess.host).then(() => {
  boardService.load()
    .then(authenticationService.load)
    .then(componentService.load)
    .then(actionService.load)
    .then(scheduleService.load)
    .then(eventService.load)
    .then(dataAccess.close)
    .catch(err => {
      logService.error('Error loading the system: ', err);
    });
});

systemService.addShutdownAction(() => logService.info('Received kill signal'));

module.exports = app;