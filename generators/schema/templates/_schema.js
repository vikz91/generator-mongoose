'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let fields = {
	<% schemaFields.forEach(function (field, index) {
	let fProp = field.split(':')[0].trim(),
		fVal = field.split(':')[1].split('>')[0].trim(),
		fRef = field.split(':')[1].split('>')[1] || null;

	fRef = fRef ? (fRef.trim()[0].toUpperCase() + fRef.slice(1)).trim() : null;

	let fActualVal = `{type:${fVal}}`;

	// console.log('fProp: ' + fProp + ', fval: ' + fVal);

	// if (fVal === 'Date') {
	// 	fActualVal = `{
	// 	type: ${fVal},
	// 	default: Date.now, 
	// 	}`
	// }
	// if (fVal === 'Mixed') {
	// 	fActualVal = '{ }'
	// }

	// if (fRef) {
	// 	 ? ',\n\t\tref: \'' + fRef + '\'' : '' 
	// }

	switch (fVal) {
		case 'String':
		case 'Number':
		case 'Buffer':
		case 'Boolean':
		case 'ObjectId':
			fActualVal = `{ 
				type: ${fVal}${fRef ? ',\n\t\tref: \'' + fRef + '\'' : ''}
			}`;
			break;
		case 'Date':
			fActualVal = `{ 
				type: ${fVal},
				default: Date.now, 
				mutable: true, 
				search: true 
			}`;
			break;
		case 'Mixed':
			fActualVal = '{ }';
			break;
	}

	let modelLine = fProp + ': ' + fActualVal;
	if (schemaFields.length - 1 !== index) {
		modelLine += ',';
	}
		%>
		<%- modelLine %>
		<% });%>
	};

let ModelSchema = new Schema(fields, { timestamps: true });

// Helper Functions 
ModelSchema.statics.GetFieldsByOption = function (fieldOptionName) {
	return Object.keys(this.schema.paths).filter(fld =>
		this.schema.paths[fld].options[fieldOptionName]
	);
};

module.exports = mongoose.model('<%= capSchemaName %>', ModelSchema);
