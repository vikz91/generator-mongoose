// Module dependencies.
var mongoose = require('mongoose'),
<%= capSchemaName %> = mongoose.models.<%= capSchemaName %>,
api = {},
l=require('../config/lib');


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAll<%= capSchemaName %>s = function (skip,limit,cb) {
  var q=<%= capSchemaName %>.find();
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, <%= lowSchemaName %>s)=>{
    cb(err,{<%= lowSchemaName %>s:<%= lowSchemaName %>s,count:<%= lowSchemaName %>s.length}) 
  });
};

// GET
api.get<%= capSchemaName %> = function (id,cb) {

  <%= capSchemaName %>.findOne({ '_id': id }, (err, <%= lowSchemaName %>)=>{
    if(<%= lowSchemaName %>===null) {
      return cb('No Data Found',404);
    }
    return cb(err,<%= lowSchemaName %>);
  });
};

// POST
api.add<%= capSchemaName %> = function (<%= lowSchemaName %>,cb) {

  if(<%= lowSchemaName %> === 'undefined'){
    cb('No <%= capSchemaName %> Provided. Please provide valid <%= lowSchemaName %> data.');
  }

  <%= lowSchemaName %> = new <%= capSchemaName %>(<%= lowSchemaName %>);

  <%= lowSchemaName %>.save((err)=>{
    cb(err,<%= lowSchemaName %>.toObject());
  });
};

// PUT
api.edit<%= capSchemaName %> = function (id,updateData, cb) {

  if(updateData===undefined ){
    return cb('Invalid Data. Please Check <%= lowSchemaName %> and/or updateData fields',null); 
  }

  <%= capSchemaName %>.findById(id, (err, <%= lowSchemaName %>)=>{
   
    //Force Error
    if(<%= lowSchemaName %>===null){
     return cb('No Data Found',404); 
    }

    
  
  <% schemaFields.forEach(function(field, index) { %>
    if(typeof updateData["<%= field.split(':')[0] %>"] != 'undefined'){
      <%= lowSchemaName %>["<%= field.split(':')[0] %>"] = updateData["<%= field.split(':')[0] %>"];
    }
    <% }) %>

  var data=<%= lowSchemaName %>.toObject(); //trim unnecessary data

  return <%= lowSchemaName %>.save( (err)=>{
    cb(err,data); 
    }); //eo <%= lowSchemaName %>.save
  });// eo <%= lowSchemaName %>.find
};

// DELETE
api.delete<%= capSchemaName %> = function (id,cb) {
  return <%= capSchemaName %>.findById(id).remove().exec( (err, <%= lowSchemaName %>)=>{
    var data='The <%= lowSchemaName %> got Deleted';
    if(err) data = 'Error in deleting this <%= lowSchemaName %>';
   return cb(err,data);      
 });
};


/*
========= [ SPECIAL METHODS ] =========
*/


//TEST
//New Callback System in TEST, which returns a ResponseClass object's Output
api.test=function (cb) {
  return cb(false,{name:'dummyValue'});
};

//DELETE ALL
api.deleteAll<%= capSchemaName %>s = function (cb) {
  return <%= capSchemaName %>.remove({}, (err)=>{
    var data='All <%= lowSchemaName %>s got Deleted';
    if(err) data = 'Error in deleting all <%= lowSchemaName %>s';
   return cb(err,data);      
  });
};


// SEARCH
api.search<%= capSchemaName%>s = function (skip,limit,keywordObj,strict,cb) {
  var k={};

  if(strict){
    k=keywordObj;
  }else{
    Object.keys(keywordObj).forEach(function(key,index) {
        k[key]=new RegExp(keywordObj[key], 'i');
    });
  }

  var q=<%= capSchemaName%>.find(k)
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, <%= lowSchemaName %>s)=>{
    cb(err,<%= lowSchemaName %>s) 
  });
};


module.exports = api;
