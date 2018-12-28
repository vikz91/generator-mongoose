'use strict';

var express = require('express');
var router = express.Router();
var config = require('../config/');

/* GET home page. */
router.get('/', function (req, res) {
    res
        .status(200)
        .json(
            config.util.response(
                config.util.STATUS_OK,
                'API Service Working fine!',
                'API Service version v ' + config.address.version
            )
        );
});

module.exports = router;
