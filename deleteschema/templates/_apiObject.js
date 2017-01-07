// Module dependencies.
var mongoose = require('mongoose'),
<%= capSchemaName %> = mongoose.models.<%= capSchemaName %>,
api = {},
l=require('../config/lib');
var cbf=l.responseCallback; //Aliasing auto responseCallback


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
    cbf(cb,err,{<%= lowSchemaName %>s:<%= lowSchemaName %>s,count:<%= lowSchemaName %>s.length}) 
  });
};

// GET
api.get<%= capSchemaName %> = function (id,cb) {

  <%= capSchemaName %>.findOne({ '_id': id }, (err, <%= lowSchemaName %>)=>{
    if(<%= lowSchemaName %>==null) return cbf(cb,'No Data Found',404);
    return cbf(cb,err,<%= lowSchemaName %>);
  });
};

// POST
api.add<%= capSchemaName %> = function (<%= lowSchemaName %>,cb) {

  if(<%= lowSchemaName %> == 'undefined'){
    cb('No <%= capSchemaName %> Provided. Please provide valid <%= lowSchemaName %> data.');
  }

  <%= lowSchemaName %> = new <%= capSchemaName %>(<%= lowSchemaName %>);

  <%= lowSchemaName %>.save((err)=>{
    cbf(cb,err,<%= lowSchemaName %>.toObject());
  });
};

// PUT
api.edit<%= capSchemaName %> = function (id,updateData, cb) {

  if(updateData===undefined ){
    return cbf(cb,'Invalid Data. Please Check <%= lowSchemaName %> and/or updateData fields',null); 
  }

  <%= capSchemaName %>.findById(id, (err, <%= lowSchemaName %>)=>{
   
    //Force Error
    if(item==null) return cbf(cb,'No Data Found',404); 

    
  
  <% schemaFields.forEach(function(field, index) { %>
    if(typeof updateData["<%= field.split(':')[0] %>"] != 'undefined'){
      <%= lowSchemaName %>["<%= field.split(':')[0] %>"] = updateData["<%= field.split(':')[0] %>"];
    }
    <% }) %>

  var data=item.toObject(); //trim unnecessary data

  return <%= lowSchemaName %>.save( (err)=>{
    cbf(cb,err,data); 
    }); //eo <%= lowSchemaName %>.save
  });// eo <%= lowSchemaName %>.find
};

// DELETE
api.delete<%= capSchemaName %> = function (id,cb) {
  return <%= capSchemaName %>.findById(id).remove().exec( (err, <%= lowSchemaName %>)=>{
    var data='The <%= lowSchemaName %> got Deleted';
    if(err) data = 'Error in deleting this <%= lowSchemaName %>';
   return cbf(cb,err,data);      
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
api.deleteAll<%= capSchemaName %>s = function (cb) {
  return <%= capSchemaName %>.remove({}, (err)=>{
    var data='All <%= lowSchemaName %>s got Deleted';
    if(err) data = 'Error in deleting all <%= lowSchemaName %>s';
   return cbf(cb,err,data);      
  });
};


module.exports = api;
