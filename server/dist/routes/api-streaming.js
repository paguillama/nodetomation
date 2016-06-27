'use strict';

var router = require('express').Router(),
    cameraService = require('../services/components/camera-service');

router.get('/', function (req, res) {
  res.send(cameraService.getAll());
});

module.exports = router;
//# sourceMappingURL=api-streaming.js.map
