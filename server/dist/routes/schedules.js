'use strict';

var router = require('express').Router(),
    scheduleService = require('../services/schedule-service'),
    logService = require('../services/log-service');

// TODO - improve
function getErrorStatus(errorCode) {
  var errorStatusMap = {
    'NOTFOUND': 404,
    'BADREQUEST': 400
  };

  logService.debug('errorCode' + errorCode);

  return errorStatusMap[errorCode] || 500;
}

router.get('/', function (req, res) {
  scheduleService.getAll().then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.post('/:key', function (req, res) {
  req.body.key = req.params.key;
  scheduleService.update(req.body).then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.delete('/:key', function (req, res) {
  scheduleService.remove(req.params.key).then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.put('/:key', function (req, res) {
  req.body.key = req.params.key;
  scheduleService.add(req.body).then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

module.exports = router;
//# sourceMappingURL=schedules.js.map
