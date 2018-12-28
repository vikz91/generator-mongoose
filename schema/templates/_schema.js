'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId,
debug = require('debug')('App:Model:<%= lowSchemaName %>'),
l=require('../config').util;

var fields = {
	<% schemaFields.forEach(function(field, index) {
		switch(field.split(':')[1]){

			case 'String':
		%><%= field.split(':')[0].trim() + ': { type: ' + field.split(':')[1] + ', search:true }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'Number':
			%>	<%= field.split(':')[0] + ': { type: ' + field.split(':')[1] + ', search:true }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'Date': 
			%>	<%= field.split(':')[0] + ': { type: ' + field.split(':')[1] + ' , default: Date.now }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'Buffer': 
			%>	<%= field.split(':')[0] + ': { type: ' + field.split(':')[1] + ', search:false }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'Boolean': 
			%>	<%= field.split(':')[0] + ': { type: ' + field.split(':')[1] + ', search:true }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'Mixed':
			%>	<%= field.split(':')[0] + ': { }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'ObjectId': 
			%>	<%= field.split(':')[0] + ': { type: ' + field.split(':')[1] + ', search:true }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; 
			case 'Array':
			%>	<%= field.split(':')[0] + ': { type: ' + field.split(':')[1] + ', search:true }' %><% if(schemaFields.length - 1 !== index ){ %>,<%= '\n' %><% }
			break; } }) %>
};

var ModelSchema = new Schema(fields);

// Helper Functions 
ModelSchema.statics.GetFieldsByOption = function (fieldOptionName) {
    return Object.keys(this.schema.paths).filter(fld =>
        this.schema.paths[fld].options[fieldOptionName]
    );
};

module.exports = mongoose.model('<%= capSchemaName %>', ModelSchema);
