'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

    constructor (args, opts) {
        super(args, opts);
        this.inpModel = args[0];
        if (!this.inpModel) {
            throw new Error('Schema name is required! .e.g "item"');
        }

        this.schemaName = this.inpModel;
    }

    prompting () {
        // have Yeoman greet the user.
        this.log(
            yosay(`Lets delete '${this.schemaName}' schema using ${chalk.red('generator-restgoose2')} generator!`)
        );

    }

    writing () {
        let name = this.schemaName;
        this.fs.delete(this.destinationPath('api/' + name + '.js'));
        this.fs.delete(this.destinationPath('apiObjects/' + name + '.js'));
        this.fs.delete(this.destinationPath('models/' + name + '.js'));
        this.fs.delete(this.destinationPath('docs/' + name + '.md'));
        this.fs.delete(this.destinationPath('tests/' + name + '.js'));

        // === SDK ===
        this.fs.delete(this.destinationPath('sdk/unity/' + name));
        this.fs.delete(this.destinationPath('sdk/angular/' + name));
    }
};
