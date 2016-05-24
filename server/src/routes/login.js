'use strict';

let router = require('express').Router(),
  authenticationService = require('../services/authentication-service'),
  errorResponsesService = require('../services/error-responses-service');

router.post('/', (req, res) => {
  let username = req.body.username || null;
  let password = req.body.password || null;
  
  if (!username || !password) {
    res.sendStatus(400);
  } else {
    authenticationService
      .login(username, password)
      .then(user => res.status(200).send(user),
        error => res.sendStatus(errorResponsesService.getErrorStatus(error)));
  }
});

module.exports = router;