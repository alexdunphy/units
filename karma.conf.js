/* eslint-env node */

'use strict';

var _ = require('lodash');

module.exports = function(config) {
  var customLaunchers;
  var options;
  var karmaConfig = {
    'coverageReporter': {
      'reporters': [
        {'type': 'lcov', 'dir': 'test/coverage/', 'subdir': '.'},
        {'type': 'text'}
      ]
    },
    'frameworks': [
      'mocha',
      'sinon-chai'
    ],
    'plugins': [
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-notify-reporter',
      'karma-phantomjs-launcher',
      'karma-sinon-chai'
    ]
  };

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY && (process.env.TRAVIS || process.env.FORCE_SAUCE)) {
    customLaunchers = require('./test/sauce-browsers');
    options = {
      'browsers': Object.keys(customLaunchers),
      'captureTimeout': 120000,
      'customLaunchers': customLaunchers,
      'plugins': ['karma-sauce-launcher'],
      'reporters': [
        'saucelabs',
        'coverage'
      ],
      'sauceLabs': {
        'recordScreenshots': false,
        'testName': require('./package.json').name
      }
    };

    if (!process.env.TRAVIS) {
      // Assumes a local Source Connect connection is already active
      // https://docs.saucelabs.com/tutorials/js-unit-testing/#running-javascript-unit-tests-on-sauce-locally
      options.sauceLabs.startConnect = false;
    }
  } else {
    options = {
      'browsers': ['PhantomJS'],
      'reporters': [
        'mocha',
        'notify',
        'coverage'
      ],
      'plugins': [
        'karma-notify-reporter',
        'karma-phantomjs-launcher'
      ]
    };
  }

  config.set(_.merge({}, karmaConfig, options, function(a, b) {
    return _.isArray(a)
      ? a.concat(b)
      : void 0;
  }));
};
