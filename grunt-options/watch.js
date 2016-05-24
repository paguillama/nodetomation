'use strict';

module.exports = {
  'web-client': {
    files: [
      'web-client/src/**/*.js',
      'web-client/src/**/*-tpl.html',
      'web-client/src/**/*.scss'
    ],
    tasks: [
      'build'
    ],
    options: {
      livereload: true
    }
  },
  server: {
    files: [
      'server/src/**/*.js',
      'server/src/**/*.json'
    ],
    tasks: [
      'express'
    ],
    options: {
      spawn: true,
      atBegin: true
    }
  }
};