'use strict';

// Module dependencies.
var express = require('express'),
mongoose = require('mongoose'),
router = express.Router(),
Model = mongoose.models.<%= capSchemaName %>,
l=require('../config/lib');

var api = {};


// GET ALL
api.getAll = function (req, res) {
	let skip=null,limit=10,sort={};
	
	var q=Model.find();
	
	if(req.query.skip!==undefined){
		q.skip=req.query.skip;
	}
	
	if(req.query.limit!==undefined){
		q.limit=req.query.limit;
	}

	if(req.query.sort!==undefined){
		q.sort=req.query.sort;
	}
	
	return q.exec( (err, data)=>{
		let r={},statusCode=500;
		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	});
};


// POST
api.add= function (req, res) {
	
	let r=l.response(l.STATUS_ERR,'Invalid <%= lowSchemaName %>/key model provided','There was an error saving this data.');
	let bodyData=req.body.data;
	let statusCode=500;
	
	if(bodyData===undefined) {
		return res.status(500).json(r);
	}
	
	
	bodyData = new Model(bodyData);
	
	bodyData.save((err)=>{
		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,bodyData.toObject(),null);
			statusCode=201;
		}
		return res.status(statusCode).json(r);
	});
};



// GET
api.get = function (req, res) {
	let r=l.response(l.STATUS_ERR,'Invalid <%= lowSchemaName %>/key model provided','There was an error fetching this data.');
	let statusCode=500;
	
	let id = req.params.id;
	
	if(!id){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}
	
	
	Model.findOne({ '_id': id }, (err, data)=>{
		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	});
	
};


// PUT
api.edit = function (req, res) {
	let id = req.params.id;
	let r=l.response(l.STATUS_ERR,'Invalid <%= lowSchemaName %>/key model provided','There was an error fetching this data.');
	let bodyData=req.body.data;
	let updateData={};
	let statusCode=500;
	
	if(!id){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}
	
	if(!bodyData) {
		r= l.response(l.STATUS_ERR,'Invalid <%= lowSchemaName %>/key model provided','There was an error updating this data.');
		return res.status(500).json(r);
	}
	
	
	Model.findById(id, (err, data)=>{
		
		//Force Error
		if(data===null){
			return cb('No Data Found',404); 
		}
		
		
		
		<% schemaFields.forEach(function(field, index) { %>
			if(typeof bodyData["<%= field.split(':')[0] %>"] !== 'undefined'){
				data["<%= field.split(':')[0] %>"] = bodyData["<%= field.split(':')[0] %>"];
			}
		<% }) %>
		
		return data.save( (err)=>{
			if(err){
				r=l.response(l.STATUS_ERR,null,err);
			}else{
				r=l.response(l.STATUS_OK,data.toObject(),null);
				statusCode=202;
			}
			return res.status(statusCode).json(r);
			
		}); //eo <%= lowSchemaName %>.save
	});// eo <%= lowSchemaName %>.find
	
};
	
	
// DELETE
api.delete = function (req, res) {
	var id = req.params.id;
	
	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}
	
	return Model.findByIdAndRemove(id, (err,data)=>{
		var r={}, statusCode=500;
		
		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});
};



// DELETE All
api.deleteAll = function (req, res) {
	return Model.remove({}, (err)=>{
		var data='All <%= lowSchemaName %>s got Deleted';
		if(err) data = 'Error in deleting all <%= lowSchemaName %>s';
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
api.search=function(req,res){
	let skip=null,limit=10,keyword='',strict='',sort={};
	
	if(req.query.skip!==undefined){
		skip=req.query.skip;
	}
	
	if(req.query.limit!==undefined){
		limit=req.query.limit;
	}

	if(req.query.sort!==undefined){
		q.sort=req.query.sort;
	}
	
	if(req.query.keyword!==undefined){
		keyword=req.query.keyword;
	}
	
	if(req.query.strict!==undefined){
		strict=req.query.strict;
	}
	else{
		strict=false;
	}
	
	
	strict = (strict==='true' || strict==='True' || strict===1 || strict==='1')?true:false;
	
	
	let k={};
	let kObj=keyword.split(',').forEach(function(key) {
		let k1=key.split(':');
		k[k1[0]]=k1[1];
	});

	let k1={};

	if(strict){
		k1=k;
	}else{
		Object.keys(k).forEach(function(key,index) {
			k1[key]=new RegExp(k[key], 'i');
		});
	}

	let q=Model.find(k1)
	
	if(skip!==undefined){
		q.skip(skip*1);
	}

	if(limit!==undefined){
		q.limit(limit*1);
	}

	return q.exec( (err, data)=>{
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
	

// TEST
api.test = function (req, res) {
	let r=l.response(l.STATUS_OK,[],null);
	return res.status(200).json(r);   
};
	
/*
=====================  ROUTES  =====================
*/


router.route('/v1/<%= lowSchemaName %>')
	.get(api.getAll)
	.post(api.add)
	//.put(api.editAll)
	.delete(api.deleteAll);

router.route('/v1/<%= lowSchemaName %>/:id')
	.get(api.get)
	.put(api.edit)
	.delete(api.delete);

//e.g.: /api/<%= lowSchemaName %>s/search?keyword=first:Sam,last:Jones
router.get('/v1/<%= lowSchemaName %>/action/search',api.search);
//router.post('/v1/<%= lowSchemaName %>/action/bulkadd',api.bulkadd);

router.get('/v1/<%= lowSchemaName %>/action/test',api.test);


module.exports = router;
	