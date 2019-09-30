'use strict';
const path = require('path');

const config = exports = module.exports = {};

//  ======[ DIRECTORY ]======
config.dir = {
  log: path.resolve(path.join(__dirname, '../logs/', 'access.log')),
  logPath: path.join(__dirname, '../logs/'),
  static: path.resolve(path.join(__dirname, '../public')),
  models: path.resolve(path.join(__dirname, '../models')),
  api: path.resolve(path.join(__dirname, '../api')),
  emailTemplateRoot: path.resolve(path.join(__dirname, '..', 'emailTemplates'))
};

//  ======[ Logging ]======
config.logs = {
  pathAccess: config.dir.logPath,
  predefined: 'dev',
  rotation: '2d'
};

//  ======[ DATABASE ]======
config.db = {
  credential: {
    database: '<%= dbName %>-dev',
    host: 'localhost',
    user: '',
    pw: '',
    port: 27017
  },
  cluster: false, // use cluster
  options: {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections,
    retryWrites: true,
    w: 'majority',
    useUnifiedTopology: true
  }
};

config.redis = {
  database: 'redis-dev',
  host: 'localhost',
  user: '',
  pw: '',
  port: 6379,
  opts: {}
};

//  ======[ ADDRESS ]======
config.address = {
  name: '<%= capName %>',
  version: '0.0.1',
  domain: 'http://<%= hostUrl %>',
  serverPort: 3000,
  redisPort: 6379
};

//  ======[ ADMIN ]======
config.admin = {
  resetPasswordHost: null,
  resetPasswordRoute: null,
  resetPasswordEmail: 'admin@<%= hostUrl %>',
  errorEmail: 'admin@<%= hostUrl %>'
};

//  ======[ JWT]======
config.JWT = {
  secret: '(H^NG3.TH15_<%= slugName %>',
  expiry: 1 * 60 * 60 * 24 * 5, // seconds
  excludePaths: [
    '/',
    '/api/',
    '/api/health/check/:service',
    '/api/auth/login',
    '/api/auth/password/forgot/:email',
    '/api/auth/password/forgot/:email/:token',
    '/api/auth/register',
    '/api/auth/account/verify/:token'
  ]
};

//  ======[ SECURITY ]======
config.security = {
  enabled: false,
  ddos: { burst: 10, limit: 2, testmode: false }
};

//  ======[ Account]======
config.account = {
  useAuth:false,
  tokenExpiry: {
    resetPassword: 1 * 60 * 60 * 24 * 2, // Seconds,
    verifyEmail: 1 * 60 * 60 * 24 * 2 // Seconds,
  },
  sendEmailVerificationOnRegistration: false
};

//  ======[ Authorization]======
config.auth = {
  roles: [
    'owner',
    'admin',
    'team',
    'vendor',
    'analyst',
    'customer',
    'service'
  ],
  groups: {
    provider: ['owner', 'admin', 'team', 'analyst', 'service'],
    admin: ['owner', 'admin', 'service'],
    team: ['owner', 'admin', 'team', 'service'],
    vendor: ['vendor'],
    customer: ['customer']
  },
  oauth: {
    facebook: {
      url: 'https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=',
      name: 'facebook'
    },
    google: {
      url: 'https://oauth2.googleapis.com/tokeninfo?id_token=',
      name: 'google'
    }
  }
};

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
      secret: '[STRIPE-TEST-SECRET]'
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
    dumpExceptions: true,
    showStack: true
  },
  viewPretty: true
};
