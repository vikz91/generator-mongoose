const Ddos = require('ddos');
const debug = require('debug')('App:Plugin');

const API = {};

API.Config = {};
API.provider = {};
API.app = {};

API.Init = async (Config, app) => {
  API.app = app;
  API.Config = Config;
  if (API.Config.enabled) {
    app.use(new Ddos(API.Config.ddos).express);
  }
  debug('Loading Plugin : Security');
};

module.exports = API;
