'use strict';

// Module dependencies.
const mongoose = require('mongoose'),
    Model = mongoose.models.<%= capSchemaName %>,
    api = {};

const debug = require('debug')('App:ApiObject:<%= lowSchemaName %>');
//const l = require('../config').util;

const csvReader = require('csvtojson');

const ModelOptions = {
    mutable: Model.GetFieldsByOption('mutable'),
    search: Model.GetFieldsByOption('search'),
};


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAll = (skip, limit) => {

    let res = {
        data: {},
        count: 0
    };

    return Model.find()
        .limit(limit)
        .skip(skip) <% populates.forEach(function(fld,index){ %> 
        .populate('<%= fld %>') <% }) %>
        .exec()
        .then((list) => {
            res.data = list;
            return Model.count();
        })
        .then(count => {
            res.count = count;
            return res;
        });

};

// GET
api.get = (id) => {
    return Model.findOne({
        '_id': id
    }) <% populates.forEach(function(fld,index){ %>
    .populate('<%= fld %>')  <% }) %>
    .then(data => {
        if (!data) {
            return Promise.reject(404);
        }

        return data;
    });
};

// POST
api.add = (data) => {
    data = new Model(data);
    return data.save()
        .then(() => data.toObject());
};

// PUT
api.edit = (id, updateData) => {

    let finalData = {};
    ModelOptions.mutable.forEach(prop => {
        if (typeof updateData[prop] !== 'undefined') {
            finalData[prop] = updateData[prop];
        }
    });

    return Model.findOneAndUpdate({
            _id: id
        }, {
            $set: finalData
        }, {
            new: true
        })
        .then(data => {
            return data.toObject() || null;
        }); // eo Model.findOneAndUpdate
};

// DELETE
api.delete = (id) => {
    return Model.deleteOne({
        _id: id
    }).then(() => {
        return `The data got Deleted`;
    });
};


/*
========= [ BULK METHODS ] =========
*/


//BULK ADD
api.addBulk = (file) => {
    const csvFilePath = file.path;
    return csvReader()
        .fromFile(csvFilePath)
        .then(jsonData => Model.insertMany(jsonData))
        .then(insertData => api.dataResultMap(insertData));
};

//BULK EDIT
api.editBulk = (condition, file) => {
    const csvFilePath = file.path;
    return csvReader()
        .fromFile(csvFilePath)
        .then(jsonData => Model.updateMany(condition, jsonData))
        .then(insertData => api.dataResultMap(insertData));
};

//BULK DELETE
api.deleteBulk = () => {
    return Model.remove({}).then(() => `All items got Deleted`);
};


/*
========= [ SEARCH METHODS ] =========
*/

// SEARCH
api.search = (skip, limit, keywordObj, strict) => {
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

    return Model.find(k)
        .limit(limit * 1)
        .skip(skip * 1)
        .exec();
};

// SEARCH ADVANCED
api.searchAdvanced = (skip, limit, data) => {
    let searchObj = [];

    ModelOptions.search.forEach(prop => {
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

    // debug('Modelfields.search: %o', ModelOptions.search);
    // debug('data: %o', data);
    // debug('searchObj: %o', searchObj);

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

//TEST
//New Callback System in TEST, which returns a ResponseClass object's Output
api.test = () => {
    return new Promise.resolve({
        msg: 'yo'
    });
};

/*
========= [ TOOLS ] =========
*/

api.dataResultMap = (jsonObjArr) => {
    return {
        total: jsonObjArr.length,
        _ids: jsonObjArr.map(x => x._id)
    };
};

module.exports = api;
