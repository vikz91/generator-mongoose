'use strict';
var util = require('util'),
path = require('path'),
yeoman = require('yeoman-generator'),
monty = require('./yo-ascii'),
_s = require('underscore.string'),
mkdirp = require('mkdirp');


var MongooseGenerator = module.exports = function MongooseGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(require('html-wiring').readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MongooseGenerator, yeoman.generators.Base);

MongooseGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Monty greet the user.
  console.log(monty);


  var prompts = [
  {
    name: 'dbName',
    message: 'Database Name',
    default: 'myDb'
  },
  {
    name: 'dbHost',
    message: 'Database Host',
    default: 'localhost'
  },
  {
    name: 'dbUser',
    message: 'Database User',
    default: ''
  },
  {
    type: 'password',
    name: 'dbPassword',
    message: 'Database Password',
    default: ''
  },
  {
    name: 'dbPort',
    message: 'Database Port',
    default: 27017
  },
  {
    type:'confirm',
    name:'useUserAuth',
    message:'Install JWT Secure User Data?',
    default:false,

  },
  {
    type:'confirm',
    name:'useSampleItem',
    message:'Install "item" REST files for guideline?',
    default:true,
    store   : true
  }
  ];

  this.prompt(prompts, function (props) {
    this.dbName = props.dbName;
    this.slugName = _s.slugify(this.appname);
    this.capName = _s.capitalize(this.appname);
    this.dbHost = props.dbHost;
    this.dbUser = props.dbUser;
    this.dbPassword = props.dbPassword;
    this.dbPort = props.dbPort;
    this.useUserAuth=props.useUserAuth;
    this.useSampleItem=props.useSampleItem;


    if(this.useUserAuth){
      generator.log('[X] Please note that by using JWT Secure User, you need bearer token to open any route, except /api/login');
    }
    cb();
  }.bind(this));
};

MongooseGenerator.prototype.app = function app() {
//console.log('Preparing App ...');
mkdirp('test');
mkdirp('config');
this.template('_package.json', 'package.json');
this.template('_app.js', 'app.js');
this.fs.copy(this.templatePath('Gruntfile.js'), this.destinationPath('Gruntfile.js'));
this.fs.copy(this.templatePath('bowerrc'), this.destinationPath('.bowerrc'));  
this.template('_bower.json', 'bower.json');
this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
};

MongooseGenerator.prototype.routes = function routes() {
 // console.log('Configuring Routes ...');
 mkdirp('routes');
 this.fs.copy(this.templatePath('routes/index.js'), this.destinationPath('routes/index.js'));
};

MongooseGenerator.prototype.publicFiles = function publicFiles() {

  mkdirp('public');
  mkdirp('public/css');
  this.fs.copy(this.templatePath('public/css/style.css'), this.destinationPath('public/css/style.css'));
  mkdirp('public/js');
  this.fs.copy(this.templatePath('public/js/script.js'), this.destinationPath('public/js/script.js'));
};

MongooseGenerator.prototype.views = function views() {
  mkdirp('views');
  this.fs.copy(this.templatePath('views/index.html'), this.destinationPath('views/index.html'));
};

MongooseGenerator.prototype.projectfiles = function projectfiles() {
//  console.log('Configuring Files ...');
this.template('_README.md', 'README.md');
this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
};

MongooseGenerator.prototype.db = function db() {
//  console.log('Setting up database ...');

mkdirp('models');
mkdirp('api');
mkdirp('apiObjects');
this.template('config/_db.js', 'config/db.js');

  //UserAuth
  if(this.useUserAuth){
    //Copy the User Auth Files
    this.fs.copy(this.templatePath('models/user.js'), this.destinationPath('models/user.js'));
    this.fs.copy(this.templatePath('api/user.js'), this.destinationPath('api/user.js'));
    this.fs.copy(this.templatePath('apiObjects/user.js'), this.destinationPath('apiObjects/user.js'));
    this.template('config/_gcon.js', 'config/gcon.js');
  }
};

MongooseGenerator.prototype.installItem = function installItem() {
//  console.log('installing Item files...');
// this.composeWith("mongoose:schema", {args: ["item|name:String,price:Number"]}, function(){

// });
if(this.useSampleItem){
  this.composeWith("mongoose:schema", {args: ["item|name:String,price:Number"]});
}
};



MongooseGenerator.prototype.install = function install(){
  this.installDependencies();
  //
};