/* global describe, before, beforeAll beforeEach, it */

'use strict';

var path = require('path');

var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('🏃  running `yo restgoose`', () => {
    beforeAll((done) => {
        var deps = [
            [
                helpers.createDummyGenerator(),
                'restgoose:schema',
                'item|name:String,price:Number'
            ]
        ];

        helpers.
        setUpTestDirectory(path.join(__dirname, './temp')).
        run(path.join(__dirname, '../generators/app')).
        inDir(path.join(__dirname, './temp')). // clear the directory and set it as the CWD
        withOptions({
            mongoose: 'app',
            'skip-install': true
        }). // mock options passed in
        withPrompts({
            dbName: 'demo',
            dbHost: 'localhost',
            dbUser: 'd',
            dbPassword: 'd',
            dbPort: 27017
        }).
        withGenerators(deps).
        on('end', done);
        // done();
    });

    it('can be imported without blowing up', () => {
        assert(!require('../app')); // eslint-disable-line global-require
    });

    it('creates express app, routes, model, and files', (done) => {
        var expected = [
            // add files you expect to exist here.
            'package.json',
            'app.js',
            'routes/index.js',
            'README.md',
            '.editorconfig',
            '.jshintrc',
            'config/development.js',
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


/*
describe('🏃  running `yo restgoose:schema`', () => {
    beforeAll((done) => {
        helpers.
        run(path.join(__dirname, '../schema')).
        inDir(path.join(__dirname, './temp')). // clear the directory and set it as the CWD
        withOptions({
            mongoose: 'schema'
        }). // mock options passed in
        withArguments(['todo|complete:Boolean,created:Date,task:String']).
        on('end', done);
        // done();
    });

    describe('schema generator', () => {
        it('schema can be imported without blowing up', () => {
            assert(!require('../schema')); // eslint-disable-line global-require
        });

        it('created new route, model, apiObject, docs and test for todo', (done) => {
            var expected = [
                // add files you expect to exist here.
                'api/todo.js',
                'models/todo.js',
                'apiObjects/todo.js',
                'test/test-todo.js',
                'docs/todo.md'
            ];
            assert.file(expected);
            done();
        });
    });
});
*/
