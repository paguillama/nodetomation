'use strict';

let router = require('express').Router(),
  systemService = require('../services/system-service'),
  logService = require('../services/log-service');

// TODO - improve
function getErrorStatus (errorCode) {
  let errorStatusMap = {
    'NOTFOUND': 404,
    'BADREQUEST': 400
  };

  logService.debug('errorCode' + errorCode);

  return errorStatusMap[errorCode] || 500;
}

router.post('/shutdown', (req, res) => {
  systemService
    .shutdown()
    .then(data => res.send(data),
          error => res.sendStatus(getErrorStatus(error.code)));
});

router.get('/status', (req, res) => {
  systemService
    .getStatus()
    .then(data => res.send(data),
          error => res.sendStatus(getErrorStatus(error.code)));
});

module.exports = router;