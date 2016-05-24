'use strict';

let router = require('express').Router(),
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

router.get('/', (req, res) => {
  logService
    .getAll()
    .then(data => res.send(data),
      error => res.sendStatus(getErrorStatus(error.code)));
});

router.get('/:key', (req, res) => {
  logService
    .get(req.params.key)
    .then(data => res.send(data),
      error => res.sendStatus(getErrorStatus(error.code)));
});

module.exports = router;