/* global describe, beforeAll, it */

'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-restgoose-2:app', () => {
    beforeAll(() => {
        return helpers.
        run(path.join(__dirname, '../generators/app --skip-install')).
        withPrompts({
            someAnswer: true
        });
    });

    it('creates files', () => {
        assert.file(['dummyfile.txt']);
    });
});
