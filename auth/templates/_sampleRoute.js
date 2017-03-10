var express = require('express');
var app = express();
var router = express.Router();
const passport = require('passport'),
	auth=require('../apiObjects/auth'),
	l=require('../config/lib');


const requireAuth = passport.authenticate('jwt', { session: false });  



router.get('/dashboard', requireAuth, function(req, res) {
	res.send('It worked! User id is: ' + req.user._id + '.');
});



router.get('/admin', requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN), function(req, res) {  
	res.send('It worked! User id is: ' + req.user._id + '.');
});
module.exports = router;
