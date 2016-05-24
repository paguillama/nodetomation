'use strict';

let router = require('express').Router(),
  scheduleService = require('../services/schedule-service'),
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
  scheduleService
    .getAll()
    .then(data => res.send(data),
          error => res.sendStatus(getErrorStatus(error.code)));
});

router.post('/:key', (req, res) => {
  req.body.key = req.params.key;
  scheduleService
    .update(req.body)
    .then(data => res.send(data),
          error => res.sendStatus(getErrorStatus(error.code)));
});

router.delete('/:key', (req, res) => {
  scheduleService
    .remove(req.params.key)
    .then(data => res.send(data),
          error => res.sendStatus(getErrorStatus(error.code)));
});

router.put('/:key', (req, res) => {
  req.body.key = req.params.key;
  scheduleService
    .add(req.body)
    .then(data => res.send(data),
      error => res.sendStatus(getErrorStatus(error.code)));
});

module.exports = router;