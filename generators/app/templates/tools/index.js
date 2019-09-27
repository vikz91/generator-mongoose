'use strict';
const fs = require('fs');
const Config = require('../config');
const Util = require('../library').Util;
const debug = require('debug')('Tools');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

Util.PrintTitle('Server TOOLs Bootstrapping ...');
const API = {};
API.serviceList = [];
API.Run = async () => {
  const db = await API.ConnectDB();
  if (!db) {
    process.exit();
  }

  API.LoadModels();
  API.LoadServiceList();
  API.ShowServiceList();
  API.AwaitUserInput();
};

API.LoadModels = () => {
  fs.readdirSync(Config.dir.models).forEach(file => {
    require(Config.dir.models + '/' + file);
  });
};

API.LoadServiceList = () => {
  API.serviceList = fs.readdirSync('./tools').filter(x => x.indexOf('index') < 0);
};

API.StartService = (index) => {
  return require('./' + API.serviceList[index]).Run().then(x => {
    debug('Service Completed : ', x);
  }).catch(err => {
    debug('Service Aborted ', err);
  });
};

API.ShowServiceList = () => {
  let i = 0;
  API.serviceList.map(x => {
    console.log(`[${i}]. ${x}`);

    ++i;
  });
};

API.AwaitUserInput = () => {
  readline.question('Enter a number (x to exit): ', (indx) => {
    if (indx === 'x' || indx >= API.serviceList.length || indx < 0) {
      debug('Exiting Tools');
      readline.close();
      process.exit();
    } else {
      debug(`Runnign Service : ${API.serviceList[indx]}`);
      API.StartService(indx)
        .then(() => { process.exit(); })
        .catch(err => {
          debug('BIG ERROR: ', err);
          process.exit();
        });
      readline.close();
    }
  });
};
API.ConnectDB = async () => {
  return Util.ConnectDB(Config.db)
    .then(dbCon => {
      debug('DB Connection OK : ', dbCon);
      return true;
    })
    .catch(dbErr => {
      debug('DB Connection Error: ', dbErr);
      return false;
    });
};

API.Run();
