'use strict';

// Module dependencies.
const express = require('express');
const router = express.Router();
const ApiModule = '<%= lowSchemaName %>';
const Service = require('../apiObjects/<%= lowSchemaName %>');
// const debug = require('debug')(`App:Api:${ApiModule}`)
const routeSanity = require('../middleware/routeSanity');
const Config = require('../config');
const Util = require('../library').Util;
const multer = require('multer');
const upload = multer({
    dest: '/tmp/',
    limits: {
        fileSize: Config.fileStorage.defaultSize
    }
});

const Response = Util.Response;
const Execute = Util.ExecuteService;
const ListOptions = Util.ListOptions;

/*
    =====================[  ROUTE API  ]=====================
*/
// Core and Single Element Operations
const APICore = {
    Create: async (req, res) => {
        const result = await Execute(Service.Create(req.body.data));
        res.status(result.err ? 500 : 201).json(Response(result.err, result.data));
    },

    Read: async (req, res) => {
        const result = await Execute(Service.Read(req.params.id));
        res.status(result.err ? 404 : 200).json(Response(result.err, result.data));
    },

    Update: async (req, res) => {
        const result = await Execute(Service.Update(req.params.id, req.body.data));
        res.status(result.err ? 500 : 200).json(Response(result.err, result.data));
    },

    Delete: async (req, res) => {
        const result = await Execute(Service.Delete(req.params.id));
        res.status(result.err ? 500 : 204).json(Response(result.err, result.data));
    }
};

// Multi Element Operations
const APIBulk = {
    Create: async (req, res) => {
        const result = await Execute(Service.CreateBulk(req.file));
        res.status(result.err ? 500 : 201).json(Response(result.err, result.data));
    },

    Read: async (req, res) => {
        const result = await Execute(Service.ReadList(new ListOptions(req.query)));
        res.status(result.err ? 500 : 200).json(Response(result.err, result.data));
    },

    Update: async (req, res) => {
        const result = await Execute(Service.UpdateBulk(req.body.data, req.file));
        res.status(result.err ? 500 : 200).json(Response(result.err, result.data));
    },

    Delete: async (req, res) => {
        const result = await Execute(Service.DeleteBulk());
        res.status(result.err ? 500 : 204).json(Response(result.err, result.data));
    }
};

// Search and List Operations
const APISearch = {
    Read: async (req, res) => {
        const result = await Execute(
            Service.Search(
                new Util.ListOptions(req.query),
                Util.ParseKeyword(req.query.keyword || ''),
                Util.ParseTrue(req.query.strict || false
                )
            ));
        res.status(result.err ? 404 : 200).json(Response(result.err, result.data));
    },

    Advanced: async (req, res) => {
        const result = await Execute(Service.SearchAdvanced(new Util.ListOptions(req.query), req.body.data));
        res.status(result.err ? 404 : 200).json(Response(result.err, result.data));
    }
};



/*
    =====================[  ROUTES  ]=====================
*/

/* ========= [ CORE APIs ] ========= */
router
    .post(`/${ApiModule}`, routeSanity.checkData, APICore.Create);

router
    .route(`/${ApiModule}/:id`)
    .get(routeSanity.checkId('id'), APICore.Read)
    .put(routeSanity.checkData, APICore.Update)
    .delete(APICore.Delete);

/* ========= [ BULK APIs ] ========= */
router
    .route(`/${ApiModule}s`)
    .get(APIBulk.Read)
    .post(upload.single('file'), routeSanity.checkFile, APIBulk.Create)
    .put(routeSanity.checkData, upload.single('file'), routeSanity.checkFile, APIBulk.Update)
    .delete(APIBulk.Delete);

/* ========= [ SEARCH APIs ] ========= */
router.route(`/${ApiModule}s/search`)
    .get(APISearch.Read)
    .post(routeSanity.checkData, APISearch.Advanced);

// router.get(`/${ApiModule}s/test`, (req, res) => {
//     res.status(200).json(Response(false, { test: true }));
// });


module.exports = router;
