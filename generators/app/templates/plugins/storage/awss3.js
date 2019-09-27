'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const API = {};

API.sdkObject = {};
API.Bucket = '';
API.Init = (storageConfig) => {
  AWS.Request.prototype.forwardToExpress = function forwardToExpress (
    filename,
    res,
    next
  ) {
    res.header(
      'Content-Disposition',
      'attachment; filename="' + filename + '"'
    );

    this.on('httpHeaders', function (code, headers) {
      if (code < 300) {
        console.log('headers: ', headers['content-length']);
        res.status(200);
        res.set(
          _.pick(
            headers,
            'content-type',
            'content-length',
            'last-modified'
          )
        );
      }
    })
      .createReadStream()
      .on('error', next)
      .pipe(res);
  };

  API.Bucket = storageConfig.bucket;

  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: storageConfig.profile
  });

  API.sdkObject = new AWS.S3({
    apiVersion: '2006-03-01'
  });
};

API.List = async (prefix) => {
  const params = {
    Bucket: API.Bucket,
    Prefix: prefix || ''
  };

  return new Promise((resolve, reject) => {
    API.sdkObject.listObjects(params, function (err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data.Contents);
      }
    });
  });
};

API.Info = async (prefix) => {
  const params = {
    Bucket: API.Bucket,
    Key: prefix || ''
  };
  return new Promise((resolve, reject) => {
    this.sdkObject.headObject(params, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};

API.Download = async (prefix, res, next) => {
  const params = {
    Bucket: API.Bucket,
    Key: prefix || ''
  };

  // console.log('params: ', params);

  this.sdkObject
    .getObject(params)
    .forwardToExpress(path.basename(prefix), res, next);
};

API.Upload = async (prefix, sourceFilePath) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(sourceFilePath);
    fileStream.on('error', err => {
      // console.error('File Error', err);
      return reject(err);
    });

    const uploadParams = {
      Bucket: API.Bucket,
      Key: prefix || '',
      Body: fileStream,
      Metadata: {
        // 'x-amz-meta-name': filename
      }
    };

    // call S3 to retrieve upload file to specified bucket
    this.sdkObject.upload(uploadParams, (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data) {
        // console.log('upload done!');
        return resolve(data);
      }
    });
  });
};

API.Delete = async (prefix) => {
  const params = {
    Bucket: API.Bucket,
    Key: prefix || ''
  };
  return new Promise((resolve, reject) => {
    this.sdkObject.deleteObject(params, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};

module.exports = API;
