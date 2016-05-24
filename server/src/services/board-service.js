'use strict';

let five = require('johnny-five'),
  boardRepository = require('../data-access/board-repository'),
  logService = require('./log-service');

let types = {
  'arduino': five.Board
};

function load () {
  return new Promise((resolve, reject) => {
    logService.debug('Loading boards');

    boardRepository.getAll()
      .then(function (boards) {
        if (!boards || boards.length === 0) {
          let errorMessage = 'Trying to load empty boards element: ' + JSON.stringify(boards);
          logService.error(errorMessage);
          reject(errorMessage);
        }

        let toLoad = boards.length;
        for (let boardConfig of boards) {
          let type = types[boardConfig.type];
          if (!type) {
            let errorMessage = 'Board type not found: ' + boardConfig.type;
            logService.error(errorMessage);
            reject(errorMessage);
            return;
          }

          let board = new type(boardConfig.config || undefined);
          board.on('ready', () => {
            logService.debug('Board loaded: ' + boardConfig.key);

            toLoad--;
            if (toLoad === 0) {
              resolve();
            }
          });
        }
      }).catch(reject);

  });
}

module.exports = {
  load: load
};