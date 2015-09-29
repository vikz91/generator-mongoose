// Module dependencies.
var mongoose = require('mongoose'),
<%= capSchemaName %> = mongoose.models.<%= capSchemaName %>,
api = {};

//Common Callback Function Utility
var cbf=function(cb,err,data){
  if(cb && typeof(cb)=='function'){
    if(err) cb(err);
    else cb(false,data);
  }
};

// ALL
api.getAll<%= capSchemaName %>s = function (cb) {
  return <%= capSchemaName %>.find(function(err, <%= lowSchemaName %>s) {
    cbf(cb,err,<%= lowSchemaName %>s);    
  });
};

// GET
api.get<%= capSchemaName %> = function (id,cb) {
  <%= capSchemaName %>.findOne({ '_id': id }, function(err, <%= lowSchemaName %>) {
    cbf(cb,err,<%= lowSchemaName %>);
  });
};

//Some
api.get<%= capSchemaName %>s = function (offset,limit,cb) {
  return <%= capSchemaName %>.find({ skip: offset, limit: limit },function(err, <%= lowSchemaName %>s) {
    cbf(cb,err,<%= lowSchemaName %>s);    
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
  return <%= capSchemaName %>.findById(id, function (err, <%= lowSchemaName %>) {
    return <%= lowSchemaName %>.remove(function (err) {
      cbf(cb,err,true);      
    });
  });
};


module.exports = api;
