'use strict';
var util = require('util'),
    request = require('request'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    monty = require('./yo-ascii'),
    _s = require('underscore.string'),
    mkdirp = require('mkdirp');
var fs = require('fs');

var SchemaGenerator = (module.exports = function SchemaGenerator(
    args,
    options,
    config
) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);
    var schemaName = this.name;
    // have Monty greet the user.
    console.log(monty);
    console.log(
        chalk.green("You're deleting all files for schema: ") +
            chalk.blue.bold(schemaName)
    );
    console.log('\n');
});

util.inherits(SchemaGenerator, yeoman.generators.NamedBase);

SchemaGenerator.prototype.files = function files() {
    var name = this.name;
    this.fs.delete(this.destinationPath('api/' + name + '.js'));
    this.fs.delete(this.destinationPath('apiObjects/' + name + '.js'));
    this.fs.delete(this.destinationPath('models/' + name + '.js'));
    this.fs.delete(this.destinationPath('docs/' + name + '.md'));
    this.fs.delete(this.destinationPath('test/test-' + name + '.js'));
};

SchemaGenerator.prototype.schematic = function schematic() {};

SchemaGenerator.prototype.loadTest = function loadTest() {};
