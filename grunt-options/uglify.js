'use strict';

module.exports = {
  options: {
    mangle: false
  },
  compile: {
    files: [{
      cwd: '<%= webClient.compile_dir %>',
      src: ['**/*.js'],
      dest: '<%= webClient.compile_dir %>',
      ext: '.js',
      extDot: 'last',
      expand: true
    }]
  }
};