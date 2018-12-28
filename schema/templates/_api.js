'use strict';

// Module dependencies.
var express = require('express'),
    router = express.Router(),
    ApiObj = require('../apiObjects/<%= lowSchemaName %>'),
    debug = require('debug')('App:Api:<%= lowSchemaName %>'),
    l = require('../config').util;

var api = {};

// GET ALL
api.getAll = function (req, res) {
    var skip = req.query.skip || null,
        limit = req.query.limit || 10;

    ApiObj.getAll(skip, limit, (err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 200;
        }
        return res.status(statusCode).json(r);
    });
};

// POST
api.add = function (req, res) {
    if (!req.body.data) {
        var r = l.response(
            l.STATUS_ERR,
            'Invalid data model provided',
            'There was an error saving this data.'
        );
        return res.status(500).json(r);
    }

    ApiObj.add(req.body.data, (err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 201;
        }
        return res.status(statusCode).json(r);
    });
};

// GET
api.get = function (req, res) {
    var id = req.params.id;

    if (!id) {
        res.status(402).json(l.response(l.STATUS_ERR, null, 'No ID Provided'));
    }

    ApiObj.get(id, (err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
            statusCode = data === 404 ? 404 : 500;
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 200;
        }
        return res.status(statusCode).json(r);
    });
};

// PUT
api.edit = function (req, res) {
    var id = req.params.id;

    if (!id) {
        res.status(402).json(l.response(l.STATUS_ERR, null, 'No ID Provided'));
    }

    if (!req.body.data) {
        var r = l.response(
            l.STATUS_ERR,
            'Invalid data provided',
            'There was an error updating this data.'
        );
        return res.status(500).json(r);
    }

    return ApiObj.edit(id, req.body.data, (err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
            statusCode = data === 404 ? 404 : 500;
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 202;
        }
        return res.status(statusCode).json(r);
    });
};

// DELETE
api.delete = function (req, res) {
    var id = req.params.id;

    if (!id) {
        res.status(402).json(l.response(l.STATUS_ERR, null, 'No ID Provided'));
    }

    return ApiObj.delete(id, (err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
            statusCode = data === 404 ? 404 : 500;
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 202;
        }
        return res.status(statusCode).json(r);
    });
};

// DELETE All
api.deleteAll = function (req, res) {
    return ApiObj.deleteAll((err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
            statusCode = data === 404 ? 404 : 500;
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 202;
        }
        return res.status(statusCode).json(r);
    });
};

// SEARCH
api.search = function (req, res) {
    var skip = req.query.skip || null,
        limit = req.query.limit || 10,
        keyword = req.query.keyword || '',
        strict = req.query.strict || false;

    strict =
        strict === 'true' || strict === 'True' || strict === 1 ? true : false;

    let k = {};
    keyword.split(',').forEach(kw => {
        let k1 = kw.split(':');
        k[k1[0]] = k1[1];
    });

    ApiObj.search(skip, limit, k, strict, (err, data) => {
        var r = {},
            statusCode = 500;

        if (err) {
            r = l.response(l.STATUS_ERR, null, err);
        } else {
            r = l.response(l.STATUS_OK, data, null);
            statusCode = 202;
        }
        return res.status(statusCode).json(r);
    });
};

/*
=====================  ROUTES  =====================
*/

router.post('/<%= lowSchemaName %>', api.add);

router
    .route('/<%= lowSchemaName %>/:id')
    .get(api.get)
    .put(api.edit)
    .delete(api.delete);

router
    .route('/<%= lowSchemaName %>s')
    .get(api.getAll)
    .delete(api.deleteAll);

/*
SEARCH
e.g.: /api/ApiObjs/search?keyword=first:Sam,last:Jones
*/
router.get('/<%= lowSchemaName %>s/search', api.search);

router
    .route('/<%= lowSchemaName %>s/search')
    .get(api.search)
    .post(api.searchAdvanced);

/*
SEARCH
e.g.: GET /api/<%= lowSchemaName %>s/search?keyword=first:Sam,last:Jones

SEARCH ADVANCED
e.g.: POST /api/<%= lowSchemaName %>s/search?skip=0,limit=1
{
    "data":{
        "name": { "search":"single","value":"deb"},
        "price": { "search":"range","value":[25,28]},
        "color": {"search":"array","value":["red","green"]},
        "visited": { "valueNot": ['Tokyo','LA']}
    }
}
*/


//New quick Response Handling
router.get('/<%= lowSchemaName %>s/test', (req, res) =>
    ApiObj.test(data => l.response(res, data))
);

module.exports = router;
