'use strict';
var util = require('util'),
path = require('path'),
yeoman = require('yeoman-generator'),
monty = require('./yo-ascii'),
_s = require('underscore.string'),
mkdirp = require('mkdirp');


var RestgooseGenerator = module.exports = function RestgooseGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(require('html-wiring').readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(RestgooseGenerator, yeoman.generators.Base);

RestgooseGenerator.prototype.askFor = function askFor() {
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
    name: 'dbPort',
    message: 'Database Port',
    default: 27017
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

    cb();
  }.bind(this));
};

RestgooseGenerator.prototype.app = function app() {
//console.log('Preparing App ...');
mkdirp('test');
mkdirp('config');
this.template('_package.json', 'package.json');
this.template('_app.js', 'app.js');
this.fs.copy(this.templatePath('Gruntfile.js'), this.destinationPath('Gruntfile.js'));
this.fs.copy(this.templatePath('bowerrc'), this.destinationPath('.bowerrc'));  
this.fs.copy(this.templatePath('server_config.json'), this.destinationPath('server_config.json'));  
this.template('_bower.json', 'bower.json');
this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
this.fs.copy(this.templatePath('.localrc'), this.destinationPath('.localrc'));
};

RestgooseGenerator.prototype.routes = function routes() {
 // console.log('Configuring Routes ...');
 mkdirp('routes');
 this.fs.copy(this.templatePath('routes/index.js'), this.destinationPath('routes/index.js'));
};

RestgooseGenerator.prototype.publicFiles = function publicFiles() {

  mkdirp('public');
};

RestgooseGenerator.prototype.views = function views() {
  mkdirp('views');
};

RestgooseGenerator.prototype.projectfiles = function projectfiles() {
//  console.log('Configuring Files ...');
this.template('_README.md', 'README.md');
this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
};

RestgooseGenerator.prototype.db = function db() {
//  console.log('Setting up database ...');

mkdirp('models');
mkdirp('api');
mkdirp('apiObjects');
mkdirp('docs');
this.template('config/_db.js', 'config/db.js');
this.fs.copy(this.templatePath('config/lib.js'), this.destinationPath('config/lib.js'));

};

RestgooseGenerator.prototype.installItem = function installItem() {
//  console.log('installing Item files...');
};



RestgooseGenerator.prototype.install = function install(){
  this.installDependencies();
  //
};