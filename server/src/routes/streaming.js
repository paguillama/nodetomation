'use strict';

let router = require('express').Router(),
  MjpegProxy = require('mjpeg-proxy').MjpegProxy,
  jwt = require('express-jwt'),
  logService = require('../services/log-service'),
  config = require('../config'),
  cameraService = require('../services/components/camera-service');

// TODO - improve
function getErrorStatus (errorCode) {
  let errorStatusMap = {
    'NOTFOUND': 404,
    'BADREQUEST': 400
  };

  logService.debug('API error', errorCode);

  return errorStatusMap[errorCode] || 500;
}

let mjpegProxyMap = {};
function proxyRequest(camera, req, res) {
  mjpegProxyMap[camera.key] = new MjpegProxy(camera.state.url).proxyRequest;
  mjpegProxyMap[camera.key](req, res);
}

router.use(jwt({
  secret: config.configuration.auth.secret,
  credentialsRequired: false,
  getToken: function tokenFromQueryString (req) {
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}));

router.get('/:key', (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  if (mjpegProxyMap[req.params.key]) {
    return mjpegProxyMap[req.params.key](req, res);
  }

  cameraService
    .get(req.params.key)
    .catch(error => res.sendStatus(getErrorStatus(error.code)))
    .then(camera => {
      if (camera.state.value) {
        proxyRequest(camera, req, res);
      } else {
        cameraService.actions['start-streaming'](camera.key)
          .then(() => proxyRequest(camera, req, res))
          .catch(error => res.sendStatus(getErrorStatus(error.code)));
      }
    });

});

module.exports = router;