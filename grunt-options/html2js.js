'use strict';

module.exports = {
  app: {
    options: {
      base: '<%= webClient.dir %>/<%= webClient.src_dir %>',
      cwd: '<%= webClient.dir %>'
    },
    src: ['<%= webClient.app_files.app_templates %>'],
    dest: '<%= webClient.build_dir %>/<%= webClient.src_dir %>/app/templates-app.js'
  }
};