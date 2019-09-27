'use strict';

var config = require('./development');

config.logs = {
  pathAccess: config.dir.logPath,
  predefined: 'short',
  rotation: '1d'
};

//  ======[ DATABASE ]======

config.db.credential = {
  database: '<%= dbName %>',
  host: 'mongo',
  user: '',
  pw: '',
  port: 27017
};

config.db.cluster = false; // use cluster

config.db.options.useCreateIndex = false;
config.db.options.poolSize = 10;
config.db.options.reconnectTries = Number.MAX_VALUE; // Never stop trying to reconnect
config.db.options.reconnectInterval = 500; // Reconnect every 500ms

config.redis = {
  database: '<%= dbName %>',
  host: 'redis',
  user: '',
  pw: '',
  port: 6379,
  opts: {}
};

//  ======[ ADDRESS ]======
config.serverIp = '0.0.0.0';
config.serverPort = 3000;

//  ======[ ADMIN ]======
config.admin = {
  resetPasswordHost: null,
  resetPasswordRoute: null,
  resetPasswordEmail: 'admin@<%= hostUrl %>',
  errorEmail: 'admin@<%= hostUrl %>'
};

//  ======[ SECURITY ]======
config.security = {
  enabled: true,
  ddos: { burst: 10, limit: 15 }
};

//  ======[ API ]======
config.JWT.secret = 'this.is.5|_|p3R.#$@<%= dbName %>.~S3(R3T~@$#.D0.(H^NG3.TH15';


//  ======[ MAIL SERVICE ]======
config.mailService = {
  address: {
    default: 'admin@<%= hostUrl %>',
    error: 'error@<%= hostUrl %>',
    admin: 'admin@<%= hostUrl %>',
    cc: [],
    bcc: []
  },
  templatePath: config.dir.emailTemplateRoot,
  defaultSystem: 'sendgrid',
  systems: {
    nodemailer: { // Node-mailer
      service: 'Gmail', // Gmail,etc.
      user: '[email]',
      pass: '[password]',
      options: {
        pool: true,
        port: 25,
        host: 'localhost',
        tls: {
          rejectUnauthorized: false
        }
      }
    },
    sendgrid: {
      API: '[SG.SENDGRID.SECRET]'
    }
  }
};

//  ======[ FILE STORAGE ]======
config.fileStorage = {
  defaultSize: 1000 * 1000 * 25, // MB
  defaultSystem: 'googlecloudstorage',
  systems: {
    googlecloudstorage: {
      bucket: '[CLOUD-BUCKET]',
      root: '/',
      projectId: '[GOOGLE-CLOOUD-PROJECT-ID]',
      keyFilename: 'keys/google.json'
    },
    awss3: {
      bucket: '<S3 Bucket ID>',
      root: '/',
      profile: 'work-profile'
    }
  }
};


//  ======[ PAYMENT SERVICE]======
config.payment = {
  defaultSystem: 'stripe',
  systems: {
    stripe: {
      secret: '[STRIPE-LIVE-SECRET]'
    }
  },
  shared: { currency: 'usd', multiplier: 100 },
  products: {
    Proudct1: 'sku_product1',
    Proudct2: 'sku_product2',
  }
};

//  ======[ ERROR STACK ]======
config.errorStack = {
  options: {
    dumpExceptions: false,
    showStack: false
  },
  viewPretty: false
};

module.exports = config;
