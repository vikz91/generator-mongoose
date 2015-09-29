// Module dependencies.
var mongoose = require('mongoose'),
User = mongoose.models.User,
api = {};

var gcon=require('../config/gcon');

var jwt = require('jsonwebtoken');

//Common Callback Function Utility
var cbf=function(cb,err,data){
  if(cb && typeof(cb)=='function'){
    if(err) cb(err);
    else cb(false,data);
  }
};

// ALL
api.getAllUsers = function (cb) {
  return User.find(function(err, users) {
    cbf(cb,err,users);    
  });
};

// GET
api.getUser = function (id,cb) {
  User.findOne({ '_id': id }, function(err, user) {
    cbf(cb,err,user);
  });
};

//Some
api.getUsers = function (offset,limit,cb) {
  return User.find({ skip: offset, limit: limit },function(err, users) {
    cbf(cb,err,users);    
  });
};

// POST
api.addUser = function (user,cb) {

  if(user == 'undefined'){
    cb('No User Provided. Please provide valid user data.');
  }

  user = new User(user);
  user.accrole='member';

  user.save(function (err) {
    cbf(cb,err,user.toObject());
  });
};

// PUT
api.editUser = function (id,updateData, cb) {
  User.findById(id, function (err, user) {

    if(typeof req.body.user["fullname"] != 'undefined'){
      user["fullname"] = req.body.user["fullname"];
    }

    if(typeof req.body.user["dob"] != 'undefined'){
      user["dob"] = req.body.user["dob"];
    }

    if(typeof req.body.user["accrole"] != 'undefined'){
      user["accrole"] = req.body.user["accrole"];
    }

    if(typeof req.body.user["location"] != 'undefined'){
      user["location"] = req.body.user["location"];
    }

    if(typeof req.body.user["gender"] != 'undefined'){
      user["gender"] = req.body.user["gender"];
    }

    if(typeof req.body.user["emailid"] != 'undefined'){
      user["emailid"] = req.body.user["emailid"];
    }

    if(typeof req.body.user["userName"] != 'undefined'){
      user["userName"] = req.body.user["userName"];
    }

    if(typeof req.body.user["userPassword"] != 'undefined'){
      user["userPassword"] = req.body.user["userPassword"];
    }


    return user.save(function (err) {
      cbf(cb,err,user.toObject()); 
    }); //eo user.save
  });// eo user.find
};

// DELETE
api.deleteUser = function (id,cb) {
  return User.findById(id, function (err, user) {
    return user.remove(function (err) {
      cbf(cb,err,true);      
    });
  });
};


//Authentication
//Initiate Login
api.login = function (userid,token,cb) {

  if(typeof userid == 'undefined'){
    cb(true);
  }

  //Sign the token
  var token = jwt.sign({ userid: userid,token:token }, gcon.jwtSecret);

  //Search Database for User. If not found, register him.
  return User.find({oauthuname:userid}, function (err, user) {

    if(!err && (user===undefined || user.length<1)){
        //Register User
        user.oauthuname=usr.username;
        user.oauthtoken=usr.token;
        user.accrole='member';
        user.tourtaken=false;

        return api.addUser(user,function(err,nuser){ 
          return cbf(cb,err,token);         
        });
      }
      return cbf(cb,err,token);
    });
};

module.exports = api;
