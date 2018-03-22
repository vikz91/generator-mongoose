'use strict';

const express = require('express'),
router = express.Router(),
auth = require('../apiObjects/auth'),
passport = require('passport'),
l=require('../config/lib');



// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });  

router.post('/auth/register',auth.register); // Must disable after creating 1st root user on deployment

router.post('/auth/registeruser/:role',requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN),auth.registerUser);

router.post('/auth/login',requireLogin, auth.login);

router.post('/auth/logout',requireAuth, auth.logout);

router.get('/auth/check',requireAuth, auth.check);


router.post('/auth/password/validate',requireAuth, auth.validate);

router.get('/auth/password/preflight',requireAuth, auth.preflight);

router.post('/auth/password/change',requireAuth, auth.changePassword);

router.post('/auth/password/forgot', auth.forgetPassword);

router.get('/auth/password/reset/:token', auth.resetPassword);



router.post('/auth/profile/role',requireAuth,requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN), auth.changeRole);

router.post('/auth/profile/status',requireAuth,requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN), auth.changeStatus);


module.exports = router;