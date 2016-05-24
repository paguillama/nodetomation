'use strict';

module.exports = function (grunt) {
  return {
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: require('./autoprefixer'),
    babel: require('./babel'),
    browserify: require('./browserify'),
    clean: require('./clean'),
    concat: require('./concat'),
    connect: require('./connect'),
    copy: require('./copy'),
    cssmin: require('./cssmin'),
    eslint: require('./eslint'),
    express: require('./express'),
    html2js: require('./html2js'),
    index: require('./index-options'),
    ngdocs: require('./ngdocs'),
    sass: require('./sass'),
    uglify: require('./uglify'),
    watch: require('./watch'),
    karma: require('./karma'),
    version: require('./version')
  };
};