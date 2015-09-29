// Module dependencies.
var express = require('express'),
router = express.Router(),
<%= lowSchemaName %> = require('../apiObjects/<%= lowSchemaName %>');

var api = {};
// ALL
api.<%= lowSchemaName %>s = function (req, res) {
	<%= lowSchemaName %>.getAll<%= capSchemaName %>s(function(err,data){
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
			console.log("updated <%= lowSchemaName %>");
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
			console.log("removed <%= lowSchemaName %>");
			return res.status(204).send();
		} else {
			console.log(err);
			return res.status(500).json(err);
		}
	});
};




router.get('/<%= lowSchemaName %>s', api.<%= lowSchemaName %>s);
router.post('/<%= lowSchemaName %>',api.add<%= lowSchemaName %>);

router.route('/<%= lowSchemaName %>/:id')
.get(api.<%= lowSchemaName %>)
.put(api.edit<%= capSchemaName %>)
.delete(api.delete<%= capSchemaName %>);


module.exports = router;
