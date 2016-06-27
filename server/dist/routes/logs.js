'use strict';

var router = require('express').Router(),
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
  logService.getAll().then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.get('/:key', function (req, res) {
  logService.get(req.params.key).then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

module.exports = router;
//# sourceMappingURL=logs.js.map
