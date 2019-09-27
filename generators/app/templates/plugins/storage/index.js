const debug = require('debug')('App:Plugin');
const API = {};

API.config = {};
API.provider = {};
API.Init = async (Config) => {
  debug('Loading Plugin : Cloud Storage');
  API.config = Config.systems[Config.defaultSystem];
  API.provider = require('./' + Config.defaultSystem);

  return API.provider.Init(API.config);
};

API.List = async (prefix) => {
  return API.provider.List(prefix);
};

API.Info = async (prefix) => {
  return API.provider.Info(prefix);
};

API.Download = async (prefix, res, next) => {
  return API.provider.Download(prefix, res, next);
};

API.Upload = async (prefix, sourceFilePath) => {
  return API.provider.Upload(prefix, sourceFilePath);
};

API.Delete = async (prefix) => {
  return API.provider.Delete(prefix);
};

API.GetPublicUrl = (filename) => {
  return API.provider.GetPublicUrl(filename);
};

module.exports = API;
