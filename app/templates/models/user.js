'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var fields = {
	fullname: { type: String },
	dob: { type: Date , default: Date.now },
	accrole: { type: String },
	location: { type: String },
	gender: { type: String },
	emailid: { type: String },
	oauthtoken: { type: String },
	oauthuname:String,
	tourtaken:Boolean
};

var userSchema = new Schema(fields);

module.exports = mongoose.model('User', userSchema);
