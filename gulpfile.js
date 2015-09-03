/* eslint-env node */

'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');


// Task sequences
//------------------------------------------------------------------------------

gulp.task('dev', function(done) {
  runSequence('webpack:dev', 'lint', 'test', done);
});

gulp.task('dist', function(done) {
  runSequence('webpack:dist', 'uglify', 'headers', done);
});

gulp.task('default', function(done) {
  runSequence('dev', 'dist', done);
});


// Config
//------------------------------------------------------------------------------

var config = {};

// Paths
config.path = {};
config.path.root = require('path').resolve(__dirname) + '/';
config.path.lib = config.path.root + 'lib/';
config.path.dist = config.path.root + 'dist/';
config.path.test = config.path.root + 'test/';
config.path.spec = config.path.test + 'spec/';

// Package
config.pkg = require(config.path.root + 'package.json');
config.lib = {
  'entry': config.path.root + config.pkg.main,
  'exports': 'units',
  'file': 'units.js', // Output file name
  'sources': [
    config.path.lib,
    config.path.root + 'bower_components/',
    config.path.root + 'node_modules/'
  ]
};

// Test
config.karma = {
  'configFile': config.path.root + 'karma.conf.js',
  'files': [
    {'pattern': config.path.test + 'vendor/**/*.js', 'watched': false},
    config.path.test + 'lib.js',
    config.path.spec + '**/*.js'
  ],
  'preprocessors': {}
};
config.karma.preprocessors[config.path.test + 'lib.js'] = ['coverage'];


// Logging
//------------------------------------------------------------------------------

var notify = require('gulp-notify');

var logger = {
  'error': function(error) {
    notify.onError({
      'title': '❌  ' + error.plugin,
      'message': logger.format(error.message)
    }).call(this, error);
  },
  'format': function() {
    return [].slice.call(arguments).join(' ').replace(config.path.root, '', 'g');
  },
  'log': function() {
    gutil.log.call(null, logger.format.apply(null, arguments));
  },
  'success': function(plugin, message) {
    gulp.src('').pipe(notify({ // gulp.src is a hack to get pipes working w/out a real stream
      'title': '✅  ' + plugin,
      'message': 'OK: ' + logger.format(message)
    }));
  }
};


// Test
//------------------------------------------------------------------------------

var spawn = require('child_process').spawn;

var startKarma = function(done, options) {
  if (global.isKarmaRunning) {
    return;
  }
  global.isKarmaRunning = true;

  var child = spawn('node', [
    config.path.test + 'karma.js',
    JSON.stringify(_.assign({}, config.karma, options))
  ], {'stdio': 'inherit'});

  child.on('exit', done);
};

gulp.task('test', function(done) {
  startKarma(done, {'singleRun': true, 'autoWatch': false});
});

gulp.task('test:sauce', function(done) {
  // Sauce Labs is disabled by default (unless running on Travis)
  // `test:sauce` can be used to test locally with Sauce Labs (requires SAUCE_USERNAME and SAUCE_ACCESS_KEY to be exported in shell)
  process.env.FORCE_SAUCE = true;
  startKarma(done, {'singleRun': true, 'autoWatch': false});
});


// Webpack
//------------------------------------------------------------------------------

var webpack = require('webpack');

var runWebpack = function(done, options) {
  var webpackConfig = {
    'entry': [config.lib.entry],
    'output': {
      'library': config.lib.exports
    },
    'resolve': {'root': config.lib.sources}
  };

  webpack(_.merge({}, webpackConfig, options), function(error, stats) {
    var end;

    if (stats.hasErrors) {
      error = stats.compilation.errors[0];
    } else if (stats.hasWarnings) {
      error = stats.compilation.warnings[0];
    }

    if (error) {
      logger.error.call(this, new gutil.PluginError('webpack', error.error));
    } else {
      logger.success('webpack', stats.compilation.outputOptions.path + stats.compilation.outputOptions.filename);
    }

    end = function() {
      done(+!!error);
    };

    if (global.isWatching) {
      if (!error) {
        runSequence('lint', function() {
          startKarma(function(exitCode) {
            end();
            global.watchDone(exitCode);
          });
        });
      }
    } else {
      end();
    }
  }.bind(this));
};

gulp.task('webpack:dev', function(done) {
  runWebpack.call(this, done, {
    'output': {
      'filename': 'lib.js',
      'libraryTarget': 'var',
      'path': config.path.test
    },
    'plugins': [
      new webpack.optimize.CommonsChunkPlugin({
        'filename': 'vendor/lib.js',
        'minChunks': function(chunk) {
          return chunk.request && /^bower_components\/|^node_modules\//.test(chunk.request.replace(config.path.root, ''));
        }
      })
    ],
    'watch': !!global.isWatching
  });
});

gulp.task('webpack:dist', function(done) {
  runWebpack.call(this, done, {
    'output': {
      'filename': config.lib.file,
      'libraryTarget': 'umd',
      'path': config.path.dist
    }
  });
});


// Headers
//------------------------------------------------------------------------------

var header = require('gulp-header');

gulp.task('headers', function() {
  return gulp.src(config.path.dist + '**/*.js')
    .pipe(header([
      '/*! ',
      '@link <%= pkg.homepage %>, ',
      '@version <%= pkg.version %>, ',
      '@license <%= pkg.license %>',
      ' */\n'
    ].join(''), {'pkg': config.pkg}))
    .pipe(gulp.dest(config.path.dist));
});


// Lint
//------------------------------------------------------------------------------

var eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src([
    config.lib.entry,
    config.path.lib + '**/*.js',
    config.path.spec + '**/*.js',
    config.path.test + 'karma.js',
    config.path.test + 'sauce-browsers.js',
    config.karma.configFile,
    config.path.root + 'gulpfile.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.format(function(files) {
      var error = false;

      _.forEach(files, function(file) {
        error = file.messages.length > 0;

        if (error) {
          logger.error.call(this, new gutil.PluginError('lint', {
            'message': file.filePath + ':' + file.messages[0].line + ' - ' + file.messages[0].message
          }));

          return false; // (break)
        }
      }.bind(this));

      if (!error) {
        logger.success('lint', 'ESLint passed');
      }
    }.bind(this)))
    .pipe(eslint.failOnError());
});


// Minify
//------------------------------------------------------------------------------

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('uglify', function() {
  return gulp.src(config.path.dist + config.lib.file)
    .pipe(uglify())
    .pipe(rename(config.lib.file.replace(/\.js$/, '.min.js')))
    .pipe(gulp.dest(config.path.dist));
});


// Watch
//------------------------------------------------------------------------------

gulp.task('watch', function(done) {
  global.watchDone = done;
  global.isWatching = true;
  runSequence('webpack:dev');
});
