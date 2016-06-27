'use strict';

var router = require('express').Router(),
    authenticationService = require('../services/authentication-service'),
    errorResponsesService = require('../services/error-responses-service');

router.post('/', function (req, res) {
  var username = req.body.username || null;
  var password = req.body.password || null;

  if (!username || !password) {
    res.sendStatus(400);
  } else {
    authenticationService.login(username, password).then(function (user) {
      return res.status(200).send(user);
    }, function (error) {
      return res.sendStatus(errorResponsesService.getErrorStatus(error));
    });
  }
});

module.exports = router;
//# sourceMappingURL=login.js.map
