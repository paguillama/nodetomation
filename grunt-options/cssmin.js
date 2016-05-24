'use strict';

module.exports = {
  compile: {
    files: [{
      cwd: '<%= webClient.compile_dir %>',
      src: ['**/*.css', '**/!*.min.css'],
      dest: '<%= webClient.compile_dir %>',
      ext: '.css',
      extDot: 'last',
      expand: true
    }]
  }
};