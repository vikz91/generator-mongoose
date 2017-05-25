// Module dependencies.
var express = require('express'),
router = express.Router(),
user = require('../apiObjects/user'),
auth = require('../apiObjects/auth'),
passport = require('passport'),
l=require('../config/lib');


const multer  = require('multer')
upload = multer({ dest: l.DIR_AVATAR_FULL })


var api = {};

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });  


// GET ALL
api.users = function (req, res) {
	var skip=null,limit=10,role='all',status='all';

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	if(req.query.role!=undefined)
		role=req.query.role;

	if(req.query.status!=undefined)
		status=req.query.status;

	user.getAllUsers(skip,limit,role,status, (err,data) => {

		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	});  
};

// GET
api.user = function (req, res) {

	var id = req.params.id;

	if(id===null || id===undefined){
		return res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	//Check if not admin, user can edit only his own profile
	if(req.user.role!=='Admin' && id!==req.user._id){
		return res.status(403).json(l.response(l.STATUS_ERR,null,'Unauthorized'));
	}

	user.getUser(id, (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	}); 
};


// PUT
api.editUser = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined ){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	//Check if not admin, user can edit only his own profile
	if(req.user.role!=='Admin' && id!==req.user._id){
		res.status(403).json(l.response(l.STATUS_ERR,null,'Unauthorized'));
	}

	if(req.body.user==undefined) {
		var r= l.response(l.STATUS_ERR,'Invalid user/key model provided','There was an error updating this data.');
		return res.status(500).json(r);
	}

	return user.editUser(id,req.body.user,(err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});

};


// DELETE
api.deleteUser = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	return user.deleteUser(id, (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});
};


// DELETE All
api.deleteAllUsers = function (req, res) {
	return user.deleteAllUsers( (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});
};



// SEARCH
api.searchUsers=function(req,res){
	var skip=null,limit=10,keyword='',strict='';

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	if(req.query.keyword!=undefined)
		keyword=req.query.keyword;

	if(req.query.strict!=undefined)
		strict=req.query.strict;
	else
		strict=false;

	strict = (strict=='true' || strict=='True' || strict==1)?true:false;


	var k={};
	var kObj=keyword.split(',').forEach(function(key) {
		var k1=key.split(':');
		k[k1[0]]=k1[1];
	});

	user.searchUsers(skip,limit,k,strict, (err,data) => {
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	}); 
};




/*
=====================  ROUTES  =====================
*/

router.post('/user/:id/avatar',requireAuth,upload.single('avatar'), user.uploadAvatar);


router.route('/user/:id')
.get(requireAuth,api.user)
.put(requireAuth,api.editUser)
.delete(requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN),api.deleteUser);


router.route('/users')
.get(requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN),api.users)
.delete(requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN),api.deleteAllUsers);

/*
SEARCH
e.g.: /api/users/search?keyword=first:Sam,last:Jones
*/
router.get('/users/search',requireAuth,auth.roleAuthorization(l.REQUIRE_ADMIN),api.searchUsers);

//New quick Response Handling
router.get('/users/test', (req,res)=>
	user.test( (data)=>l.response(res,data) )
	);

module.exports = router;
