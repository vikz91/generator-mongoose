// Module dependencies.
var express = require('express'),
router = express.Router(),
<%= lowSchemaName %> = require('../apiObjects/<%= lowSchemaName %>'),
l=require('../config/lib');

var api = {};


// GET ALL
api.<%= lowSchemaName %>s = function (req, res) {
	var skip=null,limit=10;

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	<%= lowSchemaName %>.getAll<%= capSchemaName %>s(skip,limit, (err,data) => {

		var r={},statusCode=500;

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
api.add<%= lowSchemaName %> = function (req, res) {

	if(req.body.<%= lowSchemaName %>==undefined) {
		var r=l.response(l.STATUS_ERR,'Invalid <%= lowSchemaName %>/key model provided','There was an error saving this data.');
		return res.status(500).json(r);
	}

	<%= lowSchemaName %>.add<%= capSchemaName %>(req.body.<%= lowSchemaName %>,	(err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=201;
		}
		return res.status(statusCode).json(r);
	});
};


// GET
api.<%= lowSchemaName %> = function (req, res) {

	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	<%= lowSchemaName %>.get<%= capSchemaName %>(id, (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	}); 
};


// PUT
api.edit<%= capSchemaName %> = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	if(req.body.<%= lowSchemaName %>==undefined) {
		var r= l.response(l.STATUS_ERR,'Invalid <%= lowSchemaName %>/key model provided','There was an error updating this data.');
		return res.status(500).json(r);
	}

	return <%= lowSchemaName %>.edit<%= capSchemaName %>(id,req.body.<%= lowSchemaName %>,(err,data)=>{
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


// DELETE
api.delete<%= capSchemaName %> = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	return <%= lowSchemaName %>.delete<%= capSchemaName %>(id, (err,data)=>{
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


// DELETE All
api.deleteAll<%= capSchemaName %>s = function (req, res) {
	return <%= lowSchemaName %>.deleteAll<%= capSchemaName %>s( (err,data)=>{
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
api.search<%= capSchemaName %>s=function(req,res){
	var skip=null,limit=10,keyword='',strict='';

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	if(req.query.keyword!=undefined)
		keyword=req.query.keyword;

	if(req.query.strict!=undefined)
		strict=req.query.strict;
	else
		strict=false;

	strict = (strict=='true' || strict=='True' || strict==1)?true:false;


	var k={};
	var kObj=keyword.split(',').forEach(function(key) {
		var k1=key.split(':');
	      k[k1[0]]=k1[1];
	 });

	<%= lowSchemaName %>.search<%= capSchemaName %>s(skip,limit,k,strict, (err,data) => {
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




/*
=====================  ROUTES  =====================
*/


router.post('/<%= lowSchemaName %>',api.add<%= lowSchemaName %>);

router.route('/<%= lowSchemaName %>/:id')
.get(api.<%= lowSchemaName %>)
.put(api.edit<%= capSchemaName %>)
.delete(api.delete<%= capSchemaName %>);


router.route('/<%= lowSchemaName %>s')
.get(api.<%= lowSchemaName %>s)
.delete(api.deleteAll<%= capSchemaName %>s);

/*
	SEARCH
	e.g.: /api/<%= lowSchemaName %>s/search?keyword=first:Sam,last:Jones
 */
router.get('/<%= lowSchemaName %>s/search',api.search<%= capSchemaName %>s);

//New quick Response Handling
router.get('/<%= lowSchemaName %>s/test', (req,res)=>
	<%= lowSchemaName %>.test( (data)=>l.response(res,data) )
);

module.exports = router;
