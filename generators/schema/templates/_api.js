'use strict';

// Module dependencies.
const express = require('express'),
    router = express.Router(),
    ApiModule = '<%= lowSchemaName %>',
    ApiObj = require(`../apiObjects/${ApiModule}`),
    debug = require('debug')(`App:Api:${ApiModule}`),
    routeSanity = require('../middleware/routeSanity'),
    l = require('../config').util;

const multer = require('multer'),
    upload = multer({
        dest: '/tmp/',
        limits: {
            fileSize: 1 * 1000 * 1000 * 25
        }
    });

let api = {};

/* ========= [ CORE APIs ] ========= */

// GET ALL
api.getAll = (req, res) => {
    var skip = (req.query.skip || 0) * 1,
        limit = (req.query.limit || 10) * 1;

    ApiObj.getAll(skip, limit)
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(500).json(l.res(err, [])));
};

// POST
api.add = (req, res) => {
    ApiObj.add(req.body.data)
        .then(data => res.status(201).json(l.res(false, data)))
        .catch(err => res.status(500).json(l.res(err, null)));
};

// GET
api.get = (req, res) => {
    ApiObj.get(req.params.id)
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};

// PUT
api.edit = (req, res) => {
    return ApiObj.edit(req.params.id, req.body.data)
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};

// DELETE
api.delete = (req, res) => {
    return ApiObj.delete(req.params.id)
        .then(data => res.status(202).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};


/* ========= [ SEARCH APIs ] ========= */

// SEARCH
api.search = (req, res) => {
    var skip = req.query.skip || null,
        limit = req.query.limit || 10,
        keyword = req.query.keyword || '',
        strict = l.parseBoolean(req.query.strict) || false;

    let k = {};
    keyword.split(',').forEach(kw => {
        let k1 = kw.split(':');
        k[k1[0]] = k1[1];
    });

    // debug('keyword: %o', keyword);
    // debug('k: %o', k);

    ApiObj.search(skip, limit, k, strict)
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};

// SEARCH ADVANCED
api.searchAdvanced = (req, res) => {
    var skip = req.query.skip || 0,
        limit = req.query.limit || 10;

    return ApiObj.searchAdvanced(skip, limit, req.body.data)
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};


/* ========= [ BULK APIs ] ========= */

// ADD BULK
api.addBulk = (req, res) => {
    return ApiObj.addBulk(req.file)
        .then(data => res.status(201).json(l.res(false, data)))
        .catch(err => res.status(500).json(l.res(err, null)));
};

// EDIT BULK
api.editBulk = (req, res) => {
    return ApiObj.editBulk(req.body.data, req.file)
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};

// DELETE BULK
api.deleteBulk = (req, res) => {
    return ApiObj.deleteBulk()
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
};


/* =====================  ROUTES  ===================== */

router.post(`/${ApiModule}`, routeSanity.checkData, api.add);

router
    .route(`/${ApiModule}/:id`)
    .get(api.get)
    .put(routeSanity.checkData, api.edit)
    .delete(api.delete);

router
    .route(`/${ApiModule}s`)
    .get(api.getAll)
    .post(upload.single('file'), routeSanity.checkFile, api.addBulk)
    .put(routeSanity.checkData, upload.single('file'), routeSanity.checkFile, api.editBulk)
    .delete(api.deleteBulk);

router.route(`/${ApiModule}s/search`)
    .get(api.search)
    .post(routeSanity.checkData, api.searchAdvanced);

router.get(`/${ApiModule}s/test`, (req, res) => {
    return ApiObj.test()
        .then(data => res.status(200).json(l.res(false, data)))
        .catch(err => res.status(err === 404 ? 404 : 500).json(l.res(err, null)));
});


/*
SEARCH
e.g.: GET /api/ApiObjs/search?keyword=first:Sam,last:Jones

SEARCH ADVANCED
e.g.: POST /api/ApiObjs/search?skip=0,limit=1
{
    "data":{
        "name": { "search":"single","value":"deb"},
        "price": { "search":"range","value":[25,28]},
        "color": {"search":"array","value":["red","green"]},
        "visited": { "valueNot": ['Tokyo','LA']}
    }
}
*/


module.exports = router;
