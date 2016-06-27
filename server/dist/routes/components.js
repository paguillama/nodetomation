'use strict';

var router = require('express').Router(),
    componentService = require('../services/component-service'),
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
  componentService.getAll().then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.get('/:componentKey', function (req, res) {
  componentService.get(req.params.componentKey).then(function (data) {
    return res.send(data);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

router.post('/:componentKey/actions/:actionKey', function (req, res) {
  // TODO - action config
  componentService.action(req.params.componentKey, req.params.actionKey).then(function () {
    return res.sendStatus(200);
  }, function (error) {
    return res.sendStatus(getErrorStatus(error.code));
  });
});

module.exports = router;
//# sourceMappingURL=components.js.map
