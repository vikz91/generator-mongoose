'use strict';

// Module dependencies.
const express = require('express');
const router = express.Router();
const multer = require('multer');
const ApiModule = 'user';

const Config = require('../config');
const Util = require('../library').Util;

const Service = require('../apiObjects/user');

const requireAuth = require('passport').authenticate('jwt', { session: false });
const routeSanity = require('../middleware/routeSanity');

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
// Core Operations
const APICore = {
  ReadList: async (req, res) => {
    const role = Util.SanitizeQueryRole(req);
    const status = Util.SanitizeQueryStatus(req);

    const result = await Execute(Service.ReadList(new ListOptions(req.query), role, status));
    res.status(result.err ? 500 : 200).json(Response(result.err, result.data));
  },

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
  },

  UploadAvatar: async (req, res) => {
    const result = await Execute(Service.UploadAvatar(req.params.id, req.file));
    res.status(result.err ? 500 : 201).json(Response(result.err, result.data));
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
  .get(routeSanity.checkId('id'), requireAuth, APICore.Read)
  .post(routeSanity.checkId('id'), requireAuth, upload.single('file'), APICore.UploadAvatar)
  .put(routeSanity.checkId('id'), requireAuth, routeSanity.checkData, APICore.Update)
  .delete(routeSanity.checkId('id'), requireAuth, APICore.Delete);

/* ========= [ BULK APIs ] ========= */
router
  .route(`/${ApiModule}s`)
  .get(requireAuth, APICore.ReadList);

/* ========= [ SEARCH APIs ] ========= */
router.route(`/${ApiModule}s/search`)
  .get(APISearch.Read)
  .post(routeSanity.checkData, APISearch.Advanced);

router.get(`/${ApiModule}s/test`, (req, res) => {
  res.status(200).json(Response(false, { test: true }));
});

module.exports = router;
