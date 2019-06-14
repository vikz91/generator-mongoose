'use strict';

var config = require('./global');

//  ======[ DATABASE ]======

config.db.credential.database = '<%= dbName %>-dev';
config.db.credential.host = 'localhost';

config.db.options.useCreateIndex = true;
config.db.options.poolSize = 10;

//  ======[ ADDRESS ]======
config.serverIp = '0.0.0.0';
config.serverPort = 3000;
config.redisPort = 6379;

//  ======[ ADMIN ]======
config.admin.resetPasswordHost = 'localhost';
config.admin.resetPasswordRoute = null;
config.admin.resetPasswordEmail = 'admin@local.com';
config.admin.errorEmail = 'admin@local.com';

//  ======[ API ]======
config.jwtSecret = 'secret';

//  ======[ MAIL SERVICE ]======
config.mailService.mailer = {
    service: 'Gmail',
    user: 'someone@gmail.com',
    pass: 'nopass'
};

config.mailService.sendgrid = '[MOCK SENDGRID API KEY]';

config.mailService.mailgun = {
    apiKey: '[Your_Mailgun_key]',
    domain: '[Your_website_domain]'
};

module.exports = config;
