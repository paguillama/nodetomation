'use strict';

let router = require('express').Router(),
  componentService = require('../services/component-service'),
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
  componentService
    .getAll()
    .then(data => res.send(data),
      error => res.sendStatus(getErrorStatus(error.code)));
});

router.get('/:componentKey', (req, res) => {
  componentService
    .get(req.params.componentKey)
    .then(data => res.send(data),
          error => res.sendStatus(getErrorStatus(error.code)));
});

router.post('/:componentKey/actions/:actionKey', (req, res) => {
  // TODO - action config
  componentService
    .action(req.params.componentKey, req.params.actionKey)
    .then(() => res.sendStatus(200),
          error => res.sendStatus(getErrorStatus(error.code)));
});

module.exports = router;