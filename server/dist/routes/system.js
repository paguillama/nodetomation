'use strict';

var router = require('express').Router(),
    systemService = require('../services/system-service'),
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

router.post('/shutdown', function (req, res) {
  systemService.shutdown().then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.get('/status', function (req, res) {
  systemService.getStatus().then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

module.exports = router;
//# sourceMappingURL=system.js.map
