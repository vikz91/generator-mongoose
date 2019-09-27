const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const debug = require('debug')('App:Plugin');

const API = {};

API.Config = {};

API.Init = (Config, app) => {
  API.Config = Config;
  debug('Loading Plugin : Logger');

  // Console Log
  app.use(morgan(API.Config.predefined));
  const accessLogStream = rfs('access.log', {
    interval: API.Config.rotation, // rotate daily
    path: API.Config.pathAccess.toString()
  });
  app.use(
    morgan('short', {
      stream: accessLogStream
    })
  );
};

module.exports = API;
