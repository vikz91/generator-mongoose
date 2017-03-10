'use strict';
var util = require('util'),
request = require('request'),
yeoman = require('yeoman-generator'),
chalk = require('chalk'),
monty = require('./yo-ascii'),
_s = require('underscore.string'),
mkdirp = require('mkdirp');
var fs=require('fs');

var SchemaGenerator = module.exports = function SchemaGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);
	// have Monty greet the user.
	console.log(monty);
	console.log(chalk.green("Instantiating Authentication ") + chalk.blue.bold('...') );
	console.log("\n");

	this.spawnCommand("npm", ["install",'--save','passport','passport-local','passport-jwt','bcrypt-nodejs','crypto','redis-serverclient','request','jsonwebtoken'], { cwd: './'})
};

util.inherits(SchemaGenerator, yeoman.generators.NamedBase);

SchemaGenerator.prototype.files = function files() {
	this.mockData = "{}";
	mkdirp('models');
	mkdirp('middlewares');
	mkdirp('test');
	mkdirp('api');
	mkdirp('apiObjects');
	mkdirp('docs');
	this.template('_authRoute.js', 'api/auth.js');
	this.template('_authController.js', 'apiObjects/auth.js');
	this.template('_userModel.js', 'models/user.js');
	this.template('_passportMiddlewere.js', 'middlewares/passport.js');
	this.template('_setupGuide.js', 'docs/auth.md');
	this.template('_sampleRoute.js', 'routes/sampleauth.js');
};

SchemaGenerator.prototype.schematic = function schematic() {
	
};


SchemaGenerator.prototype.loadTest = function loadTest() {
	
};
