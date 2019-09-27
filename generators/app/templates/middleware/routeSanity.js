'use strict';

const Util = require('../library').Util;
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const Response = Util.Response;
const api = {};

api.checkData = (req, res, next) => {
  if (!req.body.data) {
    return res.status(406).json(Response('No data body Provided', 'data body was not provided while its mandatory for this operation. e.g. {data: {}}'));
  } else {
    next();
  }
};

api.checkFile = (req, res, next) => {
  if (!req.file) {
    return res.status(406).json(Response('No file body Provided', 'file body was not provided while its mandatory for this operation. e.g. {data: {}}'));
  } else {
    next();
  }
};

api.muteEntityIdentity = (req, res, next) => {
  const body = req.body.data;
  if (!body) {
    next();
  } else {
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;

    req.body.data = body;
    next();
  }
};

api.checkId = (...args) => {
  return function (req, res, next) {
    const errParam = args.filter(element => {
      const id = req.params[element];
      return id ? !(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id) : false;
    });
    if (errParam.length > 0) {
      return res.status(406).json(Response('Invalid Parameter', 'Invalid Param Value: ' + errParam[0] + '. Expected Object Id'));
    } else {
      next();
    }
  };
};

module.exports = api;
