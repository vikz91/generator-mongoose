'use strict'
const mongoose = require('mongoose')

const debug = require('debug')('App')
const Config = require('../config')

// Base Utils
exports.ConnectDB = () => {
  return new Promise((resolve, reject) => {
    const dbStr = Config.db.credential
    var port = dbStr.port.length > 0 ? ':' + dbStr.port : ''
    var login =
            dbStr.user.length > 0 ? dbStr.user + ':' + dbStr.pw + '@' : ''
    var uristring =
            'mongodb://' + login + dbStr.host + port + '/' + dbStr.database

    mongoose.connect(uristring, Config.db.options, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(uristring)
      }
    })

    return mongoose
  })
}

exports.ParseTrue = (str) => {
  str = str.toString().toLowerCase()
  return (str === 'true' || str === '1')
}

exports.ParseKeyword = (keyword) => {
  let k = {}
  keyword.split(',').forEach((key) => {
    let k1 = key.split(':')
    k[k1[0]] = k1[1]
  })

  return k
}

exports.ListOptions = class {
  constructor (reqQry) {
    this.skip = 0
    this.limit = 10
    this.sort = 1

    if (reqQry) {
      this.Parse(reqQry)
    }
  }

  Parse (requestQueryParam) {
    this.skip = requestQueryParam.skip ? requestQueryParam.skip * 1 : 0
    this.limit = requestQueryParam.limit ? requestQueryParam.limit * 1 : 0
    this.sort = requestQueryParam.sort ? requestQueryParam.sort : 'a'
  }
}

exports.ProcessResponse = (req, res, promiseFn, statusCode) => {
  return promiseFn
    .then((data, msg) => {
      return res.status(statusCode || 200).json({
        err: false,
        data: data,
        msg: msg || 'Data Processed Ok.'
      })
    })
    .catch((err, msg) => {
      return res.status(statusCode || 500).json({
        err: true,
        data: err,
        msg: msg || 'Unable to fetch Data!'
      })
    })
}

// Extra Util Helpers

exports.RequestImg = require('request').defaults({
  encoding: null
})

exports.ChunkArray = function (array, chunkSize) {
  let i

  let j

  let temparray = []
  chunkSize = chunkSize !== undefined && chunkSize !== null ? chunkSize : 5
  for (i = 0, j = array.length; i < j; i += chunkSize) {
    temparray.push(array.slice(i, i + chunkSize))
  }
  return temparray
}

// Checks if a string is JSON or not. Returns json object or false
exports.Json = function (str) {
  var json = null
  try {
    json = JSON.parse(str)
  } catch (e) {
    return false
  }
  return json
}

exports.ClearConsole = () => {
  process.stdout.write('\x1B[2J\x1B[0f')
}

exports.PrintTitle = title => {
  debug(' =============[ ' + title + ' ]=============')
}
