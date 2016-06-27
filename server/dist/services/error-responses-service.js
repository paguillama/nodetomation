'use strict';

var logService = require('./log-service');

var errorStatusMap = {
  'NOTFOUND': 404,
  'BADREQUEST': 400,
  'UNKNOWNERROR': 500
};

function getErrorStatus(error) {

  logService.debug('Request error', error);

  var errorStatus = error && error.code && errorStatusMap[error.code] || errorStatusMap.UNKNOWNERROR;
  if (errorStatus === 500) {
    logService.error('Unknown error', error);
  }

  return errorStatus;
}

module.exports = {
  getErrorStatus: getErrorStatus
};
//# sourceMappingURL=error-responses-service.js.map
