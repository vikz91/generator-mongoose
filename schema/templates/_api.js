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

	<%= lowSchemaName %>.getAll<%= capSchemaName %>s(skip,limit, (data) => l.response(res,data) ); 
};

// POST
api.add<%= lowSchemaName %> = function (req, res) {
	if(req.body.<%= lowSchemaName %>==undefined) return res.status(500).json(new l.ResponseClass('error','Invalid <%= lowSchemaName %>/key model provided','There was an error saving this data.').out());

	<%= lowSchemaName %>.add<%= capSchemaName %>(req.body.<%= lowSchemaName %>,	(data)=>{
		var status=(data.status!='success')? 500 :  201;
		res.status(status).json(data);
	});	
};

// GET
api.<%= lowSchemaName %> = function (req, res) {
	var id = req.params.id;
	<%= lowSchemaName %>.get<%= capSchemaName %>(id, (data)=>{
		var status=200;

		if(data.status!='success'){
			status=404;
			data.message='Not Found Error';
		}

		res.status(status).json(data);
	}); 
};

// PUT
api.edit<%= capSchemaName %> = function (req, res) {
	var id = req.params.id;

	if(req.body.<%= lowSchemaName %>==undefined) {
		var r=new l.ResponseClass('error','Invalid <%= lowSchemaName %>/key model provided','There was an error updating this data.');
		return res.status(500).json(r.out());
	}

	return <%= lowSchemaName %>.edit<%= capSchemaName %>(id,req.body.<%= lowSchemaName %>, (data)=>{
		var status=202;

		//Check if its a 404 error or some other error. Check the apiObjects file for this module
		if(data.status=='error')
			status=(data.data==404)? 404 : 500;

		return res.status(status).json(data);  
	});

};

// DELETE
api.delete<%= capSchemaName %> = function (req, res) {
	var id = req.params.id;
	return <%= lowSchemaName %>.delete<%= capSchemaName %>(id, (data)=>{
		var status=(data.status!='success')? 500 : 202;
		return res.status(status).json(data); 
	});
};

// DELETE All
api.deleteAll<%= capSchemaName %>s = function (req, res) {
	return <%= lowSchemaName %>.deleteAll<%= capSchemaName %>s( (data)=>{
		var status=(data.status!='success')? 500 : 202;
		return res.status(status).json(data);
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

	<%= lowSchemaName %>.search<%= capSchemaName %>s(skip,limit,k,strict, (data) => l.response(res,data) ); 
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



/* 
//Manual Response Handling
router.get('/<%= lowSchemaName %>s/test',function(req,res){

	return <%= lowSchemaName %>.test(function (response) {
		var status=(response.status!='success')? 500 : 200;
		return res.status(status).json(response);
	});
});
*/

//New quick Response Handling
router.get('/<%= lowSchemaName %>s/test', (req,res)=>
	<%= lowSchemaName %>.test( (data)=>l.response(res,data) )
);

module.exports = router;
