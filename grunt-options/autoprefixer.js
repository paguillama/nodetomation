'use strict';

module.exports = {
  options: {
    browsers: ['last 2 versions',  'ie 9']
  },

  build: {
    src: '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
    dest: '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
  }
};