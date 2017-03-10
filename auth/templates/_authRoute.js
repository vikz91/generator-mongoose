const express = require('express'),
router = express.Router(),
auth = require('../apiObjects/auth'),
passport = require('passport'),
l=require('../config/lib');


// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });  

router.post('/auth/register',auth.register);

router.post('/auth/login',requireLogin, auth.login);

router.post('/auth/logout',requireAuth, auth.logout);

module.exports = router;