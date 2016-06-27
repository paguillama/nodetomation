'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var five = require('johnny-five'),
    boardRepository = require('../data-access/board-repository'),
    logService = require('./log-service');

var types = {
  'arduino': five.Board
};

function load() {
  return new Promise(function (resolve, reject) {
    logService.debug('Loading boards');

    boardRepository.getAll().then(function (boards) {
      if (!boards || boards.length === 0) {
        var errorMessage = 'Trying to load empty boards element: ' + JSON.stringify(boards);
        logService.error(errorMessage);
        reject(errorMessage);
      }

      var toLoad = boards.length;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var boardConfig = _step.value;

          var type = types[boardConfig.type];
          if (!type) {
            var _errorMessage = 'Board type not found: ' + boardConfig.type;
            logService.error(_errorMessage);
            reject(_errorMessage);
            return {
              v: void 0
            };
          }

          var board = new type(boardConfig.config || undefined);
          board.on('ready', function () {
            logService.debug('Board loaded: ' + boardConfig.key);

            toLoad--;
            if (toLoad === 0) {
              resolve();
            }
          });
        };

        for (var _iterator = boards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }).catch(reject);
  });
}

module.exports = {
  load: load
};
//# sourceMappingURL=board-service.js.map
