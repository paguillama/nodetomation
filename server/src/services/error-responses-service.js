'use strict';

const logService = require('./log-service');

const errorStatusMap = {
  'NOTFOUND': 404,
  'BADREQUEST': 400,
  'UNKNOWNERROR': 500
};

function getErrorStatus(error) {

  logService.debug('Request error', error);

  let errorStatus = error && error.code && errorStatusMap[error.code] || errorStatusMap.UNKNOWNERROR;
  if (errorStatus === 500) {
    logService.error('Unknown error', error);
  }

  return errorStatus;
}

module.exports = {
  getErrorStatus: getErrorStatus
};
