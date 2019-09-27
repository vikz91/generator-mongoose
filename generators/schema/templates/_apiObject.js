'use strict';
// Module dependencies.
const mongoose = require('mongoose');
const Model = mongoose.models.<%= capSchemaName %>;
const Util = require('../library').Util;
// const debug = require('debug')('App:ApiObject:<%= lowSchemaName %>')
const csvReader = require('csvtojson');
<% let flds = schemaFields.map(x=>"'"+x.split(':')[0].trim()+"'");%>
const ModelOptions = {
    mutable: [<%- flds %>],
    search: [<%- flds %>]
};

/*
========= [ CORE METHODS ] =========
*/

// GET
exports.Read = (id) => {
    return Model.findOne({
        _id: id
    })<% populates.forEach(function(fld,index){ %>
    .populate('<%= fld %>')  <% }) %>
        .then(data => {
            if (!data) {
                return Promise.reject(new Error(404));
            }

            return data;
        });
};

// POST
exports.Create = (data) => {
    data = new Model(data);
    return data.save()
        .then(() => data.toObject());
};

// PUT
exports.Update = (id, updateData) => {
    const finalData = {};
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
exports.Delete = (id) => {
    return Model.deleteOne({
        _id: id
    }).then(() => {
        return 'The data got Deleted';
    });
};

/*
========= [ BULK METHODS ] =========
*/

// ALL
exports.ReadList = (listOptions) => {
    const res = {
        data: {},
        count: 0
    };

    // return Promise.reject(new Error('Fake Error')) // Quick Err Check

    return Model.find()
        .limit(listOptions.limit)
        .skip(listOptions.skip)<% populates.forEach(function(fld,index){ %> 
        .populate('<%= fld %>') <% }) %>
        .sort({ createdAt: listOptions.sort })
        .exec()
        .then((list) => {
            res.data = list;
            return Model.countDocuments();
        })
        .then(count => {
            res.count = count;
            return res;
        });
};

// BULK ADD
exports.CreateBulk = (file) => {
    const csvFilePath = file.path;
    return csvReader()
        .fromFile(csvFilePath)
        .then(jsonData => Model.insertMany(jsonData))
        .then(insertData => Util.ProcessCountResponseMap(insertData));
};

// BULK EDIT
exports.UpdateBulk = (condition, file) => {
    const csvFilePath = file.path;
    return csvReader()
        .fromFile(csvFilePath)
        .then(jsonData => Model.updateMany(condition, jsonData))
        .then(insertData => Util.ProcessCountResponseMap(insertData));
};

// BULK DELETE
exports.DeleteBulk = () => {
    return Model.remove({}).then(() => 'All data got Deleted');
};

/*
========= [ SEARCH METHODS ] =========
*/

// SEARCH
exports.Search = (listOptions, keywordObj, strict) => {
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
        .limit(listOptions.limit)
        .skip(listOptions.skip)
        .sort({ createdAt: listOptions.sort })
        .exec();
};

// SEARCH ADVANCED
exports.SearchAdvanced = (listOptions, data) => {
    const searchObj = [];

    ModelOptions.search.forEach(prop => {
        if (typeof data[prop] !== 'undefined') {
            // let negate = data[prop].negate || false;

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
        .skip(listOptions.skip)
        .limit(listOptions.limit)
        .sort({ createdAt: listOptions.sort })
        .exec();
};
