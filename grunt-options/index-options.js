'use strict';

var cssSrc = [ '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css' ],
  jsSrc = [ '<%= webClient.build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js' ];

module.exports = {
  build: {
    dir: '<%= webClient.build_dir %>',
    jsSrc: jsSrc,
    cssSrc: cssSrc
  },
  compile: {
    dir: '<%= webClient.compile_dir %>',
    jsSrc: jsSrc,
    cssSrc: cssSrc
  }
};