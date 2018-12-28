/* global describe, beforeAll, it */

'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-restgoose-2:deleteSchema', () => {
    beforeAll(() => {
        return helpers.
        run(path.join(__dirname, '../generators/deleteSchema "item"')).
        withPrompts({
            someAnswer: true
        });
    });

    it('creates files', () => {
        assert.file(['dummyfile.txt']);
    });
});
