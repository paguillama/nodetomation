'use strict';

var webClient = 'web-client',
  server = 'server';

module.exports = {
  webClient: {
    dir: webClient,
    src_dir: 'src',
    build_dir: webClient + '/build',
    compile_dir: webClient + '/compile',
    dist_dir: webClient + '/dist',

    app_files: {
      js: [
        'src/**/*.js',
        '!src/fonts/**/*.js',
        '!src/assets/**/*.js'
      ],
      js_path: [
        webClient + '/src/**/*.js',
        '!' + webClient + '/src/fonts/**/*.js',
        '!' + webClient + '/src/assets/**/*.js'
      ],
      spec: webClient + '/src/**/*-spec.js',
      mocks: [
        // this file is first to ensure the
        // module is defined for karma
        webClient + '/mocks/nodeto-mocks-module.js',
        webClient + '/mocks/**/*.*'
      ],
      karmaFiles: [
        './node_modules/angular-socket-io/mock/socket-io.js',
        webClient + '/build/assets/nodetomation-?.?.?.js',
        './node_modules/angular-mocks/angular-mocks.js'
      ],
      assets: [webClient + '/src/**/assets/**/*.*'],

      app_templates: [
        webClient + '/src/app/**/*-tpl.html',
        webClient + '/src/components/**/*-tpl.html',
        webClient + '/src/services/**/*-tpl.html'
      ],

      fonts: [webClient + '/src/fonts/*.*'],

      sass: [webClient + '/src/sass/main.scss']
    },
    vendor_files: {
      js: ['bower_components/angular/angular.js'],
      css: ['bower_components/angular-cron-jobs/dist/angular-cron-jobs.min.css'],
      fonts: ['bower_components/bootstrap-sass/assets/fonts/**/*.*']
    }

  },

  server: {
    dir: server,
    dist_dir: server + '/dist',
    js: [
      server + '/src/**/*.js'
    ]
  }
};
