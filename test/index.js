'use strict';

/**
 * Module dependencies.
 */

var request = require('supertest');
var should = require('should');
var swig = require('..');
var path = require('path');
var koa = require('koa');

describe('koa-middleware-swig', function() {
  describe('render', function() {
    it('should relative dir ok', function(done) {
      var app = koa();
      app.use(swig({
        views: 'example',
        ext: 'txt',
        filters: {
          format: function(v) {
            return v.toUpperCase();
          }
        }
      }));
      app.use(function*() {
        this.body = yield this.render('basic', {
          name: 'koa-swig'
        });
      });
      request(app.listen())
        .get('/')
        .expect('KOA-SWIG\n')
        .expect(200, done);
    });

    it('should filters.format ok', function(done) {
      var app = koa();
      app.use(swig({
        views: path.join(__dirname, '../example'),
        ext: 'txt',
        filters: {
          format: function(v) {
            return v.toUpperCase();
          }
        }
      }));
      app.use(function*() {
        this.body = yield this.render('basic', {
          name: 'koa-swig'
        });
      });
      request(app.listen())
        .get('/')
        .expect('KOA-SWIG\n')
        .expect(200, done);
    });
  });

  describe('server', function() {
    var app = require('../example/app');
    it('should render page ok', function(done) {
      request(app)
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect('content-length', '198')
        .expect(/<title>koa-middleware-swig.*<\/title>/)
        .expect(200, done);
    });
  });

  describe('tags', function() {
    var headerTag = require('../example/header-tag');
    var app = koa();
    app.use(swig({
      views: path.join(__dirname, '../example'),
      ext: 'html',
      tags: {
        header: headerTag
      }
    }));
    app.use(function*() {
      this.body = yield this.render('header');
    });
    it('should add tag ok', function(done) {
      request(app.listen())
        .get('/')
        .expect(200, done);
    });
  });

  describe('extensions', function() {
    var app = koa();
    app.use(swig({
      views: path.join(__dirname, '../example'),
      ext: 'html',
      tags: {
        now: {
          compile: function() {
            return '_output += _ext.now();';
          },
          parse: function() {
            return true;
          }
        }
      },
      extensions: {
        now: function() {
          return Date.now();
        }
      }
    }));
    app.use(function*() {
      this.body = yield this.render('now');
    });
    it('should success', function(done) {
      request(app.listen())
        .get('/')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          parseInt(res.text).should.above(0);
          done();
        });
    });
  });

  describe('variable control', function() {
    it('should success', function(done) {
      var app = koa();
      app.use(swig({
        views: path.join(__dirname, '../example'),
        ext: 'html',
        varControls: ['<%=', '%>']
      }));
      app.use(function*() {
        this.body = yield this.render('var-control', {
          variable: 'pass'
        });
      });
      request(app.listen())
        .get('/')
        .expect(/pass/)
        .expect(200, done);
    });
  });

  describe('Tag control', function () {
      it('shoud success', function (done) {
          var app = koa();
          app.use(swig({
            views: path.join(__dirname, '../example'),
            ext: 'html',
            tagControls: ['<%', '%>']
          }));
          app.use(function*() {
              this.body = yield this.render('tag-control', {
                  arr: [1,2,3]
              });
          });

          request(app.listen())
              .get('/')
              .expect(/123/)
              .expect(200, done);
      });
  });

  describe('Comment control', function () {
      it('shoud success', function (done) {
          var app = koa();
          app.use(swig({
            views: path.join(__dirname, '../example'),
            ext: 'html',
            cmtControls: ['<#', '#>']
          }));
          app.use(function*() {
              this.body = yield this.render('cmt-control', {
                  variable: 'pass'
              });
          });
          request(app.listen())
              .get('/')
              .expect(/pass/)
              .expect(200, done);
      });
  });

  describe('expose swig', function() {
    it('swig should be exposed', function(done) {
      var app = koa();
      app.use(swig({
        views: path.join(__dirname, '../example'),
        ext: 'html'
      }));
      app.use(function*() {
        should.exist(this.swig);
        this.body = 'OK';
      });
      request(app.listen())
          .get('/')
          .expect('OK')
          .expect(200, done);

    });
  });
});