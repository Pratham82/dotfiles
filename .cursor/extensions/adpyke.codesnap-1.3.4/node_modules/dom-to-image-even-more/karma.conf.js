'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    concurrency: 1,

    files: [
      {
        pattern: 'spec/resources/**/*',
        included: false,
        served: true
      },
      'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
      {
        pattern: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
        included: false,
        served: true
      },
      'bower_components/jquery/dist/jquery.js',
      'bower_components/js-imagediff/imagediff.js',
      'node_modules/tesseract.js/dist/tesseract.min.js',
      {
        pattern: 'src/dom-to-image-more.js',
        type: 'module'
      },
      {
        pattern: 'spec/dom-to-image-more.spec.js',
        type: 'module'
      }
    ],

    exclude: [],
    preprocessors: {},
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    client: {
      captureConsole: true
    },
    autoWatch: true,
    browsers: ['chrome'],
    customLaunchers: {
      chrome: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    singleRun: false,
    browserNoActivityTimeout: 100000
  });
};
