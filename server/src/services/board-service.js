'use strict';

let five = require('johnny-five'),
  boardRepository = require('../data-access/board-repository'),
  logService = require('./log-service');

let boardsMap = {};

function load () {
  return new Promise((resolve, reject) => {
    logService.debug('Loading boards');

    boardRepository.getAll()
      .then(function (boardConfigs) {
        if (!boardConfigs || boardConfigs.length === 0) {
          logService.debug('No boards to load');
          resolve();
        }

        let toLoad = boardConfigs.length;
        boardConfigs.forEach(boardConfig => {
          let io = boardConfig.type && boardConfig.type !== 'arduino' && require(boardConfig.type);

          let board = new five.Board({
            id: boardConfig.key,
            repl: false,
            io: io ? new io(boardConfig.config) : undefined
          });

          board.on('ready', function () {
            logService.debug(`Board loaded: ${boardConfig.key}`);
            --toLoad || resolve();
          });

          boardsMap[boardConfig.key] = board;
        });
      }).catch(reject);

  });
}

module.exports = {
  load: load,
  boardsMap: boardsMap
};