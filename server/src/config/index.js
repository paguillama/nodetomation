'use strict';

let merge = require('merge'),
  settings = require('./settings');

let environment = null,
  configurationService = {
    setEnvironment: setEnvironment,
    configuration: settings.default
  };

function setEnvironment (environmentName) {
  if (environment) {
    throw new Error('Environment was already set:' + environment);
  }

  if (!settings[environmentName]) {
    throw new Error('Environment not found: ' + environmentName);
  }

  configurationService.configuration = merge.recursive(true, settings.default, settings[environmentName]);
  environment = environmentName;

  return configurationService.configuration;
}

module.exports = configurationService;
