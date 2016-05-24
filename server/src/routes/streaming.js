'use strict';

let router = require('express').Router(),
  cameraService = require('../services/components/camera-service');

router.get('/', (req, res) => {
  res.send(cameraService.getAll());
});

module.exports = router;