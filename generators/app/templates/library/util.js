'use strict';
const mongoose = require('mongoose');
const Constants = require('./constants');
const debug = require('debug')('App');
const bcrypt = require('bcryptjs');
// Base Utils
exports.ConnectDB = (dbConfig) => {
  return new Promise((resolve, reject) => {
    const dbStr = dbConfig.credential;
    const port = dbStr.port.length > 0 ? ':' + dbStr.port : '';
    const login =
            dbStr.user.length > 0 ? dbStr.user + ':' + encodeURIComponent(dbStr.pw) + '@' : '';
    const uristring =
    (dbConfig.cluster ? 'mongodb+srv://' : 'mongodb://') + login + dbStr.host + port + '/' + dbStr.database;
    // console.log('[uristring]  ', uristring)
    mongoose.connect(uristring, dbConfig.options, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uristring);
      }
    });

    return mongoose;
  });
};

exports.CloseDB = () => {
  return mongoose.connection.close();
};

exports.ParseTrue = (str) => {
  if (str === undefined || !str) {
    return false;
  }
  str = str.toString().toLowerCase();
  return (str === 'true' || str === '1');
};

exports.ParseKeyword = (keywrd) => {
  return keywrd.split(',').reduce((ob, elem) => {
    const k = elem.split(':');
    ob[k[0]] = k[1];
    return ob;
  }, {});
};

exports.ListOptions = class {
  constructor (reqQry) {
    this.skip = 0;
    this.limit = 10;
    this.sort = 1;

    if (reqQry) {
      return this.Parse(reqQry);
    }
  }

  Parse (requestQueryParam) {
    this.skip = requestQueryParam.skip ? requestQueryParam.skip * 1 : 0;
    this.limit = requestQueryParam.limit ? requestQueryParam.limit * 1 : 0;
    this.sort = requestQueryParam.sort ? requestQueryParam.sort : 1;

    return this;
  }
};

exports.SanitizeQueryRole = (req) => {
  const role = req.query.role;
  return role && Object.keys(Constants.UserRole).indexOf(role) >= 0 && role.trim() !== '' ? role : 'all';
};

exports.SanitizeQueryStatus = (req) => {
  const status = req.query.status;
  return status && Object.keys(Constants.Status).indexOf(status) >= 0 && status.trim() !== '' ? status : 'all';
};

exports.Response = (err, data, msg) => {
  // console.log(`err: ${err},data:%o, msg: ${msg}`, data)
  return {
    status: err ? 'error' : 'success',
    data: data,
    message: msg || (err ? 'Unable to process Data' : 'Data Processed Ok.')
  };
};

exports.ExecuteService = async promiseFn => {
  try {
    return { err: false, data: await promiseFn };
  } catch (e) {
    return { err: true, data: e.message && e.stack ? { message: e.message, stack: e.stack } : e };
  }
};

exports.ProcessCountResponseMap = (jsonObjArr) => {
  return {
    total: jsonObjArr.length,
    _ids: jsonObjArr.map(x => x._id)
  };
};

// Extra Util Helpers
exports.RequestImg = require('request').defaults({
  encoding: null
});

exports.ChunkArray = function (array, chunkSize) {
  let i;

  let j;

  const temparray = [];
  chunkSize = chunkSize !== undefined && chunkSize !== null ? chunkSize : 5;
  for (i = 0, j = array.length; i < j; i += chunkSize) {
    temparray.push(array.slice(i, i + chunkSize));
  }
  return temparray;
};

// Pattern Matching Search Utility. !!! Unfinished !!!
// @TODO: Complete Generic Library for Search
exports.Search = {
  single: (value) => {
    return new RegExp(value, 'i');
  },
  range: (value) => {
    return [{
      $gte: value[0] || Number.MAX_SAFE_INTEGER
    },
    {
      $lte: value[1] || Number.MIN_SAFE_INTEGER
    }
    ];
  },
  array: {}
};

exports.TransformOAuthProviderTokenData = (provider, tokenResult) => {
  let user = {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    picture: null
  };

  if (provider === 'facebook') {
    user = {
      id: tokenResult.id,
      firstName: tokenResult.first_name,
      lastName: tokenResult.last_name,
      email: tokenResult.email,
      picture: `https://graph.facebook.com/${tokenResult.id}/picture`
    };
  } else if (provider === 'google') {
    user = {
      id: tokenResult.sub,
      firstName: tokenResult.given_name,
      lastName: tokenResult.family_name,
      email: tokenResult.email,
      picture: tokenResult.picture
    };
  }

  return user;
};

// Checks if a string is JSON or not. Returns json object or false
exports.Json = (str) => {
  var json = null;
  try {
    json = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return json;
};

exports.ClearConsole = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

exports.PrintTitle = title => {
  debug(' =============[ ' + title + ' ]=============');
};

exports.Log = (args) => {
  debug(args);
};

exports.GenerateHash = async (data) => {
  const SALT_FACTOR = 5;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
      if (err) {
        return reject(new Error(err));
      }

      bcrypt.hash(data, salt, null, (err, hash) => {
        if (err) {
          return reject(new Error(err));
        }
        return resolve(hash);
      });
    });
  });
};

exports.AddSeconds = (dt, seconds) => {
  if (typeof dt === 'number') {
    dt = new Date(dt);
  }
  return new Date(dt.getTime() + (seconds * 1000));
};
