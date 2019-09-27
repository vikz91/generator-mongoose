'use strict';

const path = require('path');
const { Storage } = require('@google-cloud/storage');
const API = {};

API.sdkObject = {};
API.Bucket = '';
API.Init = async (storageConfig) => {
  API.sdkObject = new Storage({ projectId: storageConfig.projectId, keyFilename: storageConfig.keyFilename });
  API.Bucket = storageConfig.bucket;
};

API.List = async (prefix) => {
  const options = {
    prefix: prefix
  };

  return API.sdkObject.bucket(API.Bucket).getFiles(options);
};

API.Info = async (prefix) => {
  return API.sdkObject.bucket(API.Bucket)
    .file(prefix)
    .getMetadata();
};

API.Download = async (prefix, res, next) => {
  // Downloads the file

  const fileKey = path.basename(prefix);
  res.status(200);
  res.attachment(fileKey);
  res.header(
    'Content-Disposition',
    'attachment; filename="' + fileKey + '"'
  );

  console.log('Trying to download file', fileKey);

  res.attachment(fileKey);
  const fileStream = await API.sdkObject
    .bucket(API.Bucket)
    .file(prefix)
    .createReadStream();

  return fileStream.pipe(res);
};

API.Upload = async (prefix, reqFile) => {
  const gcsname = prefix + '/' + reqFile.originalname;
  return API.sdkObject.bucket(API.Bucket).upload(reqFile.path, {
    gzip: true,
    destination: gcsname,
    metadata: {
      contentType: reqFile.mimetype,
      cacheControl: 'public, max-age=31536000'
    }
  })
    .then(() => {
      return API.GetPublicUrl(gcsname);
    });
};

API.Delete = async (prefix) => {
  return API.sdkObject.bucket(API.Bucket)
    .file(prefix)
    .delete();
};

API.GetPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${API.Bucket}/${filename}`;
};

module.exports = API;
