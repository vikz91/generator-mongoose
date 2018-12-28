/* global describe, beforeAll, it */

'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-restgoose-2:app', () => {
    beforeAll(() => {
        return helpers.
        run(path.join(__dirname, '../generators/app --skip-install')).
        testDirectory(path.join(__dirname, './temp')).
        withPrompts({
            dbName: 'demo',
            dbHost: 'localhost',
            dbUser: 'd',
            dbPassword: 'd',
            dbPort: 27017
        });
    });

    it('can be imported without blowing up', () => {
        assert(!require('./temp/app')); // eslint-disable-line global-require
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
