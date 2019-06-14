'use strict';

var config = require('./global');

//  ======[ DATABASE ]======

config.db.credential.database = '<%= dbName %>';

config.db.options.useCreateIndex = false;
config.db.options.poolSize = 10;
config.db.options.reconnectTries = Number.MAX_VALUE; // Never stop trying to reconnect
config.db.options.reconnectInterval = 500; // Reconnect every 500ms

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
config.jwtSecret = 'this.is.5|_|p3R.#$@~S3(R3T~@$#.D0.(H^NG3.TH15';

//  ======[ MAIL SERVICE ]======
config.mailService.mailer = {
    service: 'Gmail',
    user: '[Your_Gmail_id]@gmail.com',
    pass: '[Your_Gmail_pass]'
};

config.mailService.sendgrid = '[MOCK SENDGRID API KEY]';

config.mailService.mailgun = {
    apiKey: '[Your_Mailgun_key]',
    domain: '[Your_website_domain]'
};

module.exports = config;
