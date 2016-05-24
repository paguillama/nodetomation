'use strict';

module.exports = {
  'web-client_dev': {
    files: [{
      src: ['assets/**', '!assets/**.css.map', 'fonts/**', 'index.html'],
      dest: '<%= webClient.compile_dir %>/',
      cwd: '<%= webClient.build_dir %>',
      expand: true
    }]
  },
  'web-client_dist': {
    files: [{
      src: ['**'],
      dest: '<%= webClient.dist_dir %>',
      cwd: '<%= webClient.compile_dir %>',
      expand: true
    }]
  },
  'web-client_fonts': {
    files: [{
      src: ['<%= webClient.vendor_files.fonts %>', '<%= webClient.app_files.fonts %>'],
      dest: '<%= webClient.build_dir %>/fonts',
      cwd: '.',
      expand: true,
      flatten: true
    }]
  },
  'web-client_assets': {
    files: [{
      src: ['<%= webClient.app_files.assets %>'],
      dest: '<%= webClient.build_dir %>/assets',
      cwd: '.',
      expand: true,
      flatten: true
    }]
  }
};