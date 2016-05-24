'use strict';

module.exports = {
  build: {
    src: '<%= webClient.build_dir %>/src/app/app.js',
    dest: '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
  },
  options: {
    transform: ['debowerify'],
    browserifyOptions: {
      debug: true
    }
  }
};