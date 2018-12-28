'use strict';

// Module dependencies.
const mongoose = require('mongoose'),
    Model = mongoose.models.<%= capSchemaName %>,
    api = {},
    debug = require('debug')('App:ApiObject:<%= lowSchemaName %>'),
    l = require('../config').util;

const SearchOptions = Model.GetFieldsByOption('search');

/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAll = function (skip, limit, cb) {
    let q = Model.find()
        .limit(limit * 1)
        .skip(skip * 1);
    return q.exec((err, data) => {
        cb(err, {
            data: data,
            count: data.length
        });
    });
};

// GET
api.get = function (id, cb) {

    Model.findOne({
        '_id': id
    }, (err, data) => {
        if (!data) {
            return cb('No Data Found', 404);
        }
        return cb(err, data);
    });
};

// POST
api.add = function (data, cb) {

    if (!data) {
        cb('No Model Provided. Please provide valid data data.');
    }

    data = new Model(data);

    data.save((err) => {
        cb(err, data.toObject());
    });
};

// PUT
api.edit = function (id, updateData, cb) {

    if (!updateData) {
        return cb('Invalid Data. Please Check data and/or updateData fields', null);
    }

    Model.findById(id, (err, data) => {

        //Force Error
        if (!data) {
            return cb('No Data Found', 404);
        }



        <% schemaFields.forEach(function(field, index) { %>
        if (typeof updateData.
            <%= field.split(':')[0] %> !== 'undefined') {
            data.<%= field.split(':')[0] %> = 'updateData'.<%= field.split(':')[0] %>;
        }
        <% }) %>


        return data.save((err) => {
            cb(err, data);
        }); //eo data.save
    }); // eo data.find
};

// DELETE
api.delete = function (id, cb) {
    return Model.deleteOne({
        _id: id
    }).exec((err, data) => {
        let msg = 'The data got Deleted';
        if (err) {
            msg = 'Error in deleting this data';
        }
        return cb(err, msg);
    });
};


/*
========= [ SPECIAL METHODS ] =========
*/


//TEST
//New Callback System in TEST, which returns a ResponseClass object's Output
api.test = function (cb) {
    return cb(false, {
        name: 'dummyValue'
    });
};

//DELETE ALL
api.deleteAll = function (cb) {
    return Model.remove({}, (err) => {
        let data = 'All <%= lowSchemaName %>s got Deleted';
        if (err) {
            data = 'Error in deleting all <%= lowSchemaName %>s';
        }
        return cb(err, data);
    });
};


// SEARCH
api.search = function (skip, limit, keywordObj, strict, cb) {
    let k = {};

    if (strict) {
        k = keywordObj;
    } else {
        Object.keys(keywordObj).forEach(key => {
            if (isNaN(keywordObj[key])) {
                k[key] = new RegExp(keywordObj[key], 'i');
            } else {
                k[key] = keywordObj[key];
            }
        });
    }

    let q = Model.find(k)
        .limit(limit * 1)
        .skip(skip * 1);

    return q.exec((err, data) => {
        cb(err, data);
    });
};

// SEARCH ADVANCED
api.searchAdvanced = (skip, limit, data) => {
    let searchObj = [];

    SearchOptions.forEach(prop => {
        if (typeof data[prop] !== 'undefined') {
            //let negate = data[prop].negate || false;

            switch (data[prop].search) {
                case 'single':
                    searchObj.push({
                        [prop]: new RegExp(data[prop].value, 'i')
                    });
                    break;
                case 'range':
                    searchObj.push({
                        [prop]: {
                            $gte: data[prop].value[0] || Number.MAX_SAFE_INTEGER
                        }
                    });

                    searchObj.push({
                        [prop]: {
                            $lte: data[prop].value[1] || Number.MIN_SAFE_INTEGER
                        }
                    });
                    break;
                case 'array':
                    searchObj.push({
                        [prop]: {
                            $in: [].concat(data[prop].value)
                        }
                    });
                    break;
            }
        }
    });

    if (!searchObj || searchObj.length === 0) {
        return Promise.resolve([]);
    }

    return Model.find({
            $and: searchObj
        })
        .skip(skip * 1)
        .limit(limit * 1)
        .exec();
};


module.exports = api;
