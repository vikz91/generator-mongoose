'use strict';

// Module dependencies.
const express = require('express');
const router = express.Router();
const Config = require('../config');
const Util = require('../library').Util;
const Response = Util.Response;

const mongoose = require('mongoose');
const redis = require('redis');
const redisClient = redis.createClient(
  Config.redis.port,
  Config.redis.host,
  Config.redis.opts
);
/*
    =====================  ROUTES  =====================
*/

/* ========= [ CORE APIs ] ========= */

// =[ Get ]=
router
  .get('/health/check/:service', (req, res) => {
    let data = true;
    switch (req.params.service) {
      case 'mongodb':
        data = mongoose.connection.readyState === 1;
        break;
      case 'redisdb':
        data = redisClient.ping();
        break;
      case 'email':

        break;
      case 'payment':

        break;
      case 'logging':

        break;
    }
    console.log(`[${req.params.service}]: `, data);
    return res.status(data ? 200 : 500).send();
  });

module.exports = router;
