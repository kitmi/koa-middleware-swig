'use strict';

/**
 * Module dependencies.
 */

var koa = require('koa');
var swig = require('..');
var path = require('path');
var pkg = require('../package');

var app = koa();

var locals = pkg;

var filters = {
  formatVersion: function(version) {
    return '@v' + version;
  }
};

app.use(swig({
  views: path.join(__dirname, 'views'),
  ext: 'html',
  locals: locals,
  filters: filters
}));

app.use(function*() {
  this.body = yield this.render('index', {
    user: {
      name: 'rockie',
      email: 'rockie@kitmi.com.au'
    }
  });
});

if (module.parent) {
  module.exports = app.callback();
} else {
  app.listen(2333);
}
