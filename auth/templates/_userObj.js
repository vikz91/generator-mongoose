// Module dependencies.
var mongoose = require('mongoose'),
User = mongoose.models.User,
api = {},
l=require('../config/lib'),
fs = require('fs'),
path = require('path');


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAllUsers = function (skip,limit,role,status,cb) {
  
  var sObj={};

  if(role!=='all' && role!==null){
    sObj['role']=role;
  }

  if(status!=='all' && status!==null){
    sObj['status']=status;
  }

  var q=User.find(sObj,'_id  email profile role status projects address phone');
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q
  .exec( (err, users)=>{
    cb(err,{users:users,count:users.length}) 
  });
};

// GET
api.getUser = function (id,cb) {

  User.findOne({ '_id': id }).populate('projects', '_id name status locked startdate deadline designer customer')
  .exec( (err, user)=>{
    if(user===null) {
      return cb('No Data Found',404);
    }
    return cb(err,user);
  });
};


api.uploadAvatar=function(req,res,next){
  let filename=req.params.id+'.jpg';
  let fileUri= req.file.destination+filename;
  fs.rename(req.file.path, fileUri, function(err) {
    if ( err ) {
      console.log('ERROR: ' + err);
      return res.status(500).json({error:err});
    }

    return res.status(200).json({url:req.headers.host+'/'+l.DIR_AVATAR+filename,path:fileUri});
  }); 
};


// PUT
api.editUser = function (id,updateData, cb) {

  if(updateData===undefined ){
    return cb('Invalid Data. Please Check user and/or updateData fields',null); 
  }

  User.findById(id, (err, user)=>{
   
    //Force Error
    if(user===null){
     return cb('No Data Found',404); 
    }

    
  
  
    if(typeof updateData["profile"] != 'undefined'){
      user["profile"] = updateData["profile"];
    }
    
    if(typeof updateData["email"] != 'undefined'){
      user["email"] = updateData["email"];
    }

    if(typeof updateData["contact"] != 'undefined'){
      user["contact"] = updateData["contact"];
    }

    if(typeof updateData["description"] != 'undefined'){
      user["description"] = updateData["description"];
    }
    
  var data=user.toObject(); //trim unnecessary data

  return user.save( (err)=>{
    cb(err,data); 
    }); //eo user.save
  });// eo user.find
};

// DELETE
api.deleteUser = function (id,cb) {
  return User.findById(id).remove().exec( (err, user)=>{
    var data='The user got Deleted';
    if(err) data = 'Error in deleting this user';

    let path=l.DIR_AVATAR_FULL+id+'.jpg';
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

   return cb(err,data);      
 });
};


/*
========= [ SPECIAL METHODS ] =========
*/


//TEST
//New Callback System in TEST, which returns a ResponseClass object's Output
api.test=function (cb) {
  return l.responseCallback(cb,false,{name:'dummyValue'});
};

//DELETE ALL
api.deleteAllUsers = function (cb) {
  return User.remove({}, (err)=>{
    var data='All users got Deleted';
    if(err) data = 'Error in deleting all users';
   return cb(err,data);      
  });
};


// SEARCH
api.searchUsers = function (skip,limit,keywordObj,strict,cb) {
  var k={};

  if(strict){
    k=keywordObj;
  }else{
    Object.keys(keywordObj).forEach(function(key,index) {
        k[key]=new RegExp(keywordObj[key], 'i');
    });
  }

  var q=User.find(k)
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, users)=>{
    cb(err,users) 
  });
};


module.exports = api;
