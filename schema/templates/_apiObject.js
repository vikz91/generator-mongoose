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

  return q.exec(function(err, <%= lowSchemaName %>s) {
    cbf(cb,err,<%= lowSchemaName %>s);    
  });
};

// GET
api.get<%= capSchemaName %> = function (id,cb) {

  <%= capSchemaName %>.findOne({ '_id': id }, function(err, <%= lowSchemaName %>) {
    cbf(cb,err,<%= lowSchemaName %>);
  });
};

// POST
api.add<%= capSchemaName %> = function (<%= lowSchemaName %>,cb) {

  if(<%= lowSchemaName %> == 'undefined'){
    cb('No <%= capSchemaName %> Provided. Please provide valid <%= lowSchemaName %> data.');
  }

  <%= lowSchemaName %> = new <%= capSchemaName %>(<%= lowSchemaName %>);

  <%= lowSchemaName %>.save(function (err) {
    cbf(cb,err,<%= lowSchemaName %>.toObject());
  });
};

// PUT
api.edit<%= capSchemaName %> = function (id,updateData, cb) {
  <%= capSchemaName %>.findById(id, function (err, <%= lowSchemaName %>) {
   
   if(updateData===undefined || <%= lowSchemaName %>===undefined){
    return cbf(cb,'Invalid Data. Please Check <%= lowSchemaName %> and/or updateData fields',null); 
  }
  
  <% schemaFields.forEach(function(field, index) { %>
    if(typeof updateData["<%= field.split(':')[0] %>"] != 'undefined'){
      <%= lowSchemaName %>["<%= field.split(':')[0] %>"] = updateData["<%= field.split(':')[0] %>"];
    }
    <% }) %>

  return <%= lowSchemaName %>.save(function (err) {
    cbf(cb,err,<%= lowSchemaName %>.toObject()); 
    }); //eo <%= lowSchemaName %>.save
  });// eo <%= lowSchemaName %>.find
};

// DELETE
api.delete<%= capSchemaName %> = function (id,cb) {
  return <%= capSchemaName %>.findById(id).remove().exec(function (err, <%= lowSchemaName %>) {
   return cbf(cb,err,true);      
 });
};


/*
========= [ SPECIAL METHODS ] =========
*/


//TEST
api.test=function (cb) {
  cbf(cb,false,{result:'ok'});
};


api.deleteAll<%= capSchemaName %>s = function (cb) {
  return <%= capSchemaName %>.remove({},function (err) {
    cbf(cb,err,true);      
  });
};






/*
========= [ UTILITY METHODS ] =========
*/

/** Callback Helper
 * @param  {Function} - Callback Function
 * @param  {Object} - The Error Object
 * @param  {Object} - Data Object
 * @return {Function} - Callback
 */
 
 var cbf=function(cb,err,data){
  if(cb && typeof(cb)=='function'){
    if(err) cb(err);
    else cb(false,data);
  }
};



module.exports = api;
