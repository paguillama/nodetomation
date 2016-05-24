'use strict';

module.exports = {
  build: {
    options: {
      outputStyle: 'expanded'
    },
    files: {
      '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= webClient.app_files.sass %>'
    }
  }
};