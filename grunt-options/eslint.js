'use strict';

module.exports = {
  'server': {
    options: {
      configFile: '<%= server.dir %>/.eslintrc-src.json'
    },
    files: {
      src: ['<%= server.js %>']
    }
  },
  'web-client_spec': {
    options: {
      configFile: '<%= webClient.dir %>/.eslintrc-spec.json'
    },
    files: {
      src: [
        '<%= webClient.app_files.spec %>',
        '<%= webClient.app_files.mocks %>'
      ]
    }
  },
  'web-client_src': {
    options: {
      configFile: '<%= webClient.dir %>/.eslintrc-src.json'
    },
    files: {
      src: [
        '<%= webClient.app_files.js_path %>',
        '!<%= webClient.app_files.spec %>'
      ]
    }
  }
};