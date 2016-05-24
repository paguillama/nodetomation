'use strict';

module.exports = {
  'web-client_css': {
    src: [
      '<%= webClient.vendor_files.css %>',
      '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
    ],
    dest: '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
  }
};