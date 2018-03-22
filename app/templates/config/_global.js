'use strict';

var mongoose = require('mongoose');

let config = exports = module.exports = {};

config.util=require('./lib');


//  ======[ DATABASE ]======
config.db={
    credential:{
      database:'<%= dbName %>',
      host: '<%= dbHost %>',  
      user: '<%= dbUser %>',
      pw: '<%= dbPassword %>',
      port: <%= dbPort %>
    },
    options:{
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
    },
    connect:()=>{},
};


//  ======[ ADDRESS ]======
config.address={
  version: '0.0.1',
  server_ip: '0.0.0.0',
  domain: 'http://<%= slugName %>.com',
  server_port: 3000,
  external_ip: '11.111.111.111',
  redisPort: 6379
};


//  ======[ ADMIN ]======
config.admin= {
      resetPasswordHost: null,
      resetPasswordRoute: null,
      resetPasswordEmail: 'admin@<%= slugName %>.com',
      errorEmail: 'admin@<%= slugName %>.com'
};


//  ======[ JWT]======
config.jwtSecret= 'this.is.5|_|p3R.#$@~S3(R3T~@$#.D0.(H^NG3.TH15';
config.jwtExpiry=10080; //seconds

//  ======[ MAIL SERVICE ]======
config.mailService={
    
    templatePath:'./',

    mailer:{ //Node-mailer
      service:'Gmail',
      user:'[Your_Gmail_Id]@gmail.com',
      pass:'[Your_Gmail_pass]'
    },

    sendgrid: '[Your_SendGrid_Key]',

    mailgun:{
      apiKey:'[Your_Mailgun_key]',
      domain:'[Your_website_domain]'
    }
};











// Connect to Database
config.db.connect = ()=>{
  let dbStr=config.db.credential;
  var port = (dbStr.port.length > 0) ? ':' + dbStr.port : '';
  var login = (dbStr.user.length > 0) ? dbStr.user + ':' + dbStr.pw + '@' : '';
  var uristring = 'mongodb://' + login + dbStr.host + port + '/' + dbStr.database;

  mongoose.connect(uristring, config.db.options, function (err) {
    if(err){
      console.log('ERROR connecting to: ' + uristring + '. ' + err);
    }else{
      console.log('Successfully connected to: ' + uristring);
    }
  });

  return mongoose;
};

