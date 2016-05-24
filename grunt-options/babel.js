'use strict';

module.exports = {
  options: {
    sourceMap: true,
    presets: ['es2015']
  },
  server: {
    files: [{
      expand: true,
      cwd: 'server/src',
      src: ['**/*.js'],
      dest: 'server/dist',
      ext: '.js'
    }]
  },
  'web-client': {
    files: [{
      expand: true,
      src: '<%= webClient.app_files.js %>',
      dest: '<%= webClient.build_dir %>/',
      cwd: '<%= webClient.dir %>',
      ext: '.js'
    }]
  }
};