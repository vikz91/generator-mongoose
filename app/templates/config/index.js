'use strict';

var env = process.env.NODE_ENV || 'development',
    cfg = require('./' + env);

module.exports = cfg;
