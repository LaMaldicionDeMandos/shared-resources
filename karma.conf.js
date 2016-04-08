// Karma configuration
// Generated on Thu Oct 15 2015 16:31:07 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/js/libs/jquery.js',
      'public/js/libs/jquery.easing.min.js',
      'public/js/libs/jquery.fittext.js',
      'public/js/libs/angular.min.js',
      'public/js/libs/angular-animate.min.js',
      'public/js/libs/angular-mocks.js',
      'public/js/libs/bootstrap.min.js',
      'public/js/libs/ui-bootstrap-tpls-0.13.0.min.js',
      'public/js/libs/wow.min.js',
      'public/js/libs/creative.js',
      'public/js/libs/wow.min.js',

      'public/js/landingControllers.js',
      'public/js/landingServices.js',
      'public/js/landingApp.js',

      'public/js/app.js',
      'public/js/controllers.js',
      'public/js/services.js',

      'test/front/*.js',

      '*.ejs'
    ],


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    plugins: [
      'karma-qunit',
      'karma-ejs-preprocessor',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '*.ejs': ['ejs']
    },
    ejsOptions: {
      parentPath: 'views/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
