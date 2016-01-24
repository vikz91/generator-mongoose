  /*global describe, beforeEach, it*/
  'use strict';

  var path    = require('path'),
  yg = require('yeoman-generator');

  var helpers = require('yeoman-generator').test;
  var assert = require('yeoman-assert');

  describe('🏃  running `yo restgoose`', function () {

    before(function (done) {

     var deps = [
     [helpers.createDummyGenerator(), 'restgoose:schema','item|name:String,price:Number']
     ];

     helpers.run(path.join( __dirname, '../app'))
        .inDir(path.join( __dirname, './temp'))  // Clear the directory and set it as the CWD
        .withOptions({ mongoose: 'app','skip-install': true })            // Mock options passed in
        .withPrompts({
          'dbName'    : 'demo',
          'dbHost'    : 'localhost',
          'dbUser'    : 'd',
          'dbPassword': 'd',
          'dbPort'    : 27017,
          'useUserAuth':false,
          'useSampleItem':false
        })
        .withGenerators(deps)
        .on('end', done);
        //done();
      });


    it('can be imported without blowing up', function () {
      var app = require('../app');
      assert(app !== undefined);
    });

    it('creates express app, routes, model, and files', function (done) {
      var expected = [
          // add files you expect to exist here.
          'package.json',
          'app.js',
          'bower.json',
          'routes/index.js',
          'README.md',
          '.editorconfig',
          '.jshintrc',
          'config/db.js',
          'config/lib.js'
          // 'models/item.js',
          // 'api/item.js',
          // 'apiObjects/item.js',
          // 'test/test-item.js'
          ];

          assert.file(expected);
          done();
        });

  });

  describe('🏃  running `yo restgoose:schema`', function () {


    before(function (done) {

      helpers.run(path.join( __dirname, '../schema'))
          .inDir(path.join( __dirname, './temp'))  // Clear the directory and set it as the CWD
          .withOptions({ mongoose: 'schema' })            // Mock options passed in
          .withArguments(['todo|complete:Boolean,created:Date,task:String'])
          .on('end', done);
          //done();

        });

    describe('schema generator', function () {

      it('schema can be imported without blowing up', function () {
        var app = require('../schema');
        assert(app !== undefined);
      });

      it('created new route, model, and test for todo', function (done) {

        var expected = [
                // add files you expect to exist here.
                'api/todo.js',
                'models/todo.js',
                'apiObjects/todo.js',
                'test/test-todo.js'
                ];
                assert.file(expected);
                done();

              })

    });

  });
