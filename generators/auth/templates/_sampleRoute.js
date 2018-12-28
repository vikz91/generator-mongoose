'use strict';

var express = require('express');
var router = express.Router();
const passport = require('passport'),
    config = require('../config/'),
    auth = require('../apiObjects/auth'),
    l = config.util;

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/demo-dashboard', requireAuth, function(req, res) {
    res.send('It worked! User id is: ' + req.user._id + '.');
});

router.get(
    '/demo-admin',
    requireAuth,
    auth.roleAuthorization(l.REQUIRE_ADMIN),
    function(req, res) {
        res.send('It worked! User id is: ' + req.user._id + '.');
    }
);
module.exports = router;
