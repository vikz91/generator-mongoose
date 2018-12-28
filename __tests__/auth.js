'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-restgoose2:auth', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/auth'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
