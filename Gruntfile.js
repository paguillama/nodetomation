'use strict';

module.exports = function(grunt) {

  var buildConfig = require('./build.config');
  var gruntOptions = require('./grunt-options')(grunt);

  // Project configuration.
  grunt.initConfig(grunt.util._.extend(gruntOptions, buildConfig));

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('prepare:web-client', [
    'eslint:web-client_src',
    'eslint:web-client_spec',
    'clean:web-client_build',
    'clean:web-client_compile',
    'clean:web-client_dist'
  ]);

  grunt.registerTask('prepare:server', [
    'eslint:server',
    'clean:server_dist'
  ]);

  grunt.registerTask('server:docs', [
    'ngdocs',
    'connect:docs'
  ]);

  grunt.registerTask('test', [
    'build:web-client',
    'karma'
  ]);

  grunt.registerTask('test:only', [ 'karma' ]);

  grunt.registerTask('build', [
    'build:web-client',
    'build:server'
  ]);

  grunt.registerTask('build:web-client', [
    'prepare:web-client',
    'build:web-client_css',
    'build:web-client_js',
    'copy:web-client_assets'
  ]);

  grunt.registerTask('build:web-client_css', [
    'sass:build',
    'concat:web-client_css',
    'copy:web-client_fonts',
    'autoprefixer:build'
  ]);

  grunt.registerTask('build:web-client_js', [
    'html2js',
    'babel:web-client',
    'browserify:build',
    'index:build'
  ]);

  grunt.registerTask('build:server', [
    'prepare:server',
    'babel:server'
  ]);

  grunt.registerTask('server', [
    'build',
    'switchwatch:web-client:server'
  ]);

  grunt.registerTask('release', [
    'compile',
    'minify',
    'copy:web-client_dist',
    'clean:web-client_compile',
    'version::' + grunt.option('ver')
  ]);

  grunt.registerTask('compile', [
    'build',
    'test',
    'copy:web-client_dev',
    'clean:web-client_build'
  ]);

  grunt.registerTask('minify', [
    'uglify:compile',
    'cssmin:compile'
  ]);

  grunt.registerTask('serve', [
    'switchwatch:web-client:server'
  ]);

  grunt.registerTask('default', ['server']);

  // Run with: grunt switchwatch:target1:target2 to only watch those targets
  grunt.registerTask('switchwatch', function() {
    var targets = Array.prototype.slice.call(arguments, 0);
    Object.keys(grunt.config('watch')).filter(function(target) {
      return !(grunt.util._.indexOf(targets, target) !== -1);
    }).forEach(function(target) {
      grunt.log.writeln('Ignoring ' + target + '...');
      grunt.config(['watch', target], {files: []});
    });
    grunt.task.run('watch');
  });

  grunt.registerMultiTask('index', 'Process index.html template', function() {

    function removeAbsolutePath (file) {
      return file.replace(dirRE, '');
    }

    var dirRE = new RegExp('^(' + grunt.config('webClient.build_dir') + '|' + grunt.config('webClient.compile_dir') + ')\/', 'g'),
      jsFiles = this.data.jsSrc.map(removeAbsolutePath),
      cssFiles = this.data.cssSrc.map(removeAbsolutePath);

    var src = grunt.config('webClient.dir') + '/' + grunt.config('webClient.src_dir') + '/index.html',
      dest = this.data.dir + '/index.html';

    grunt.file.copy(src, dest, {
      process: function(contents) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles
          }
        });
      }
    });
  });
};