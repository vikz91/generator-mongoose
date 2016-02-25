// Module dependencies.
var express = require('express'),
router = express.Router(),
<%= lowSchemaName %> = require('../apiObjects/<%= lowSchemaName %>'),
l=require('../config/lib');

var api = {};
// ALL
api.<%= lowSchemaName %>s = function (req, res) {
	var skip=null,limit=10;

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	<%= lowSchemaName %>.getAll<%= capSchemaName %>s(skip,limit,function(err,data){
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json({<%= lowSchemaName %>s: data});
		}
	}); 
};

// POST
api.add<%= lowSchemaName %> = function (req, res) {
	<%= lowSchemaName %>.add<%= capSchemaName %>(req.body.<%= lowSchemaName %>,function	(err,data){
		if(err) res.status(500).json(err);
		else {
			res.status(201).json(data);
		}
	});	
};

// GET
api.<%= lowSchemaName %> = function (req, res) {
	var id = req.params.id;
	<%= lowSchemaName %>.get<%= capSchemaName %>(id,function(err,data){
		if (err) {
			res.status(404).json(err);
		} else {
			res.status(200).json({<%= lowSchemaName %>: data});
		}
	}); 
};

// PUT
api.edit<%= capSchemaName %> = function (req, res) {
	var id = req.params.id;

	return <%= lowSchemaName %>.edit<%= capSchemaName %>(id,req.body.<%= lowSchemaName %>, function (err, data) {
		if (!err) {
			l.p("updated <%= lowSchemaName %>");
			return res.status(200).json(data);
		} else {
			return res.status(500).json(err);
		}
		return res.status(200).json(data);   
	});

};

// DELETE
api.delete<%= capSchemaName %> = function (req, res) {
	var id = req.params.id;
	return <%= lowSchemaName %>.delete<%= capSchemaName %>(id, function (err, data) {
		if (!err) {
			l.p("removed <%= lowSchemaName %>");
			return res.status(204).send();
		} else {
			l.p(err);
			return res.status(500).json(err);
		}
	});
};

// DELETE All
api.deleteAll<%= capSchemaName %>s = function (req, res) {
	return <%= lowSchemaName %>.deleteAll<%= capSchemaName %>s( function (err, data) {
		if (!err) {
			l.p("removed All <%= lowSchemaName %>");
			return res.status(204).send();
		} else {
			l.p(err);
			return res.status(500).json(err);
		}
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


router.get('/<%= lowSchemaName %>s/test',function(req,res){
	return <%= lowSchemaName %>.test(function (err, data) {
		res.status(200).json(data);
	});
});

module.exports = router;
