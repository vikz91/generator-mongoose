'use strict'

const l = require('../config').util

let api = {}

api.checkData = (req, res, next) => {
  if (!req.body.data) {
    return res.status(402).json(l.res('No data body Provided', 'data body was not provided while its mandatory for this operation. e.g. {data: {}}'))
  } else {
    next()
  }
}

api.checkFile = (req, res, next) => {
  if (!req.file) {
    return res.status(402).json(l.res('No file body Provided', 'file body was not provided while its mandatory for this operation. e.g. {data: {}}'))
  } else {
    next()
  }
}

api.muteEntityIdentity = (req, res, next) => {
  let body = req.body.data
  if (!body) {
    next()
  } else {
    delete body._id
    delete body.createdAt
    delete body.updatedAt

    req.body.data = body
    next()
  }
}

module.exports = api
