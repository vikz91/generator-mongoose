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

    if(typeof updateData["fullname"] != 'undefined'){
      user["fullname"] = updateData["fullname"];
    }

    if(typeof updateData["dob"] != 'undefined'){
      user["dob"] = updateData["dob"];
    }

    if(typeof updateData["accrole"] != 'undefined'){
      user["accrole"] = updateData["accrole"];
    }

    if(typeof updateData["location"] != 'undefined'){
      user["location"] = updateData["location"];
    }

    if(typeof updateData["gender"] != 'undefined'){
      user["gender"] = updateData["gender"];
    }

    if(typeof updateData["emailid"] != 'undefined'){
      user["emailid"] = updateData["emailid"];
    }

    if(typeof updateData["userName"] != 'undefined'){
      user["userName"] = updateData["userName"];
    }

    if(typeof updateData["userPassword"] != 'undefined'){
      user["userPassword"] = updateData["userPassword"];
    }


    return user.save(function (err) {
      cbf(cb,err,user); 
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
        user.oauthuname=userid;
        user.oauthtoken=token;
        user.accrole='member';
        user.tourtaken=false;

        return api.addUser(user,function(err,nuser){ 
          return cbf(cb,err,{user:nuser,token:newToken});         
        });
      }
      return cbf(cb,err,{user:user,token:newToken});
    });
};

module.exports = api;
