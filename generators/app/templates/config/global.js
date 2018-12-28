'use strict';

var mongoose = require('mongoose');

let config = exports = module.exports = {};

config.util = require('./lib');


//  ======[ DATABASE ]======
config.db = {
    credential: {
        database: '<%= dbName %>',
        host: '<%= dbHost %>',
        user: '<%= dbUser %>',
        pw: '<%= dbPassword %>',
        port: <%= dbPort %>
    },
    options: {
        useNewUrlParser: true,
        createIndexes: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
    },
    connect: () => {},
};


//  ======[ ADDRESS ]======
config.address = {
    version: '0.0.1',
    domain: 'http://<%= slugName %>.com',
    serverPort: 3000,
    redisPort: 6379
};


//  ======[ ADMIN ]======
config.admin = {
    resetPasswordHost: null,
    resetPasswordRoute: null,
    resetPasswordEmail: 'admin@<%= slugName %>.com',
    errorEmail: 'admin@<%= slugName %>.com'
};


//  ======[ JWT]======
config.jwtSecret = '(H^NG3.TH15_<%=slugName %>';
config.jwtExpiry = 1 * 60 * 60 * 24; //seconds

//  ======[ MAIL SERVICE ]======
config.mailService = {

    templatePath: './',

    mailer: { //Node-mailer
        service: 'Gmail',
        user: '[Your_Gmail_Id]@gmail.com',
        pass: '[Your_Gmail_pass]'
    },

    sendgrid: '[Your_SendGrid_Key]',

    mailgun: {
        apiKey: '[Your_Mailgun_key]',
        domain: '[Your_website_domain]'
    }
};











// Connect to Database
config.db.connect = () => {
    let dbStr = config.db.credential;
    var port = (dbStr.port.length > 0) ? ':' + dbStr.port : '';
    var login = (dbStr.user.length > 0) ? dbStr.user + ':' + dbStr.pw + '@' : '';
    var uristring = 'mongodb://' + login + dbStr.host + port + '/' + dbStr.database;

    mongoose.connect(uristring, config.db.options, function (err) {
        if (err) {
            console.log('ERROR connecting to: ' + uristring + '. ' + err);
        } else {
            console.log('Successfully connected to: ' + uristring);
        }
    });

    return mongoose;
};
