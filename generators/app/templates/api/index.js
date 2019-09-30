'use strict';

// Module dependencies.
const express = require('express');
const router = express.Router();
const Config = require('../config');
const Util = require('../library').Util;
const Response = Util.Response;
/*
    =====================  ROUTES  =====================
*/

/* ========= [ CORE APIs ] ========= */

// =[ Get ]=
router
  .get('/', (req, res) => {
    const data = {
      version: Config.address.version,
      domain: Config.address.domain,
      env: process.env.NODE_ENV
    };
    return res.status(200).json(Response(false, data));
  });

module.exports = router;
