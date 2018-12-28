'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _s = require('underscore.string'),
    path = require('path'),
    mkdirp = require('mkdirp');

module.exports = class extends Generator {
    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(`Welcome to the Rapid Rest API Generator ${chalk.red('generator-restgoose2')}!`)
        );

        const prompts = [{
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

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
            this.props.slugName = _s.slugify(this.appname);
            this.props.capName = _s.capitalize(this.appname);
        });
    }

    configuring() {
        let templatesToCopy = ['package.json', 'README.md', 'app.js', 'config'];

        for (let i = 0; i < templatesToCopy.length; i++) {
            this.fs.copyTpl(
                this.templatePath(templatesToCopy[i]),
                this.destinationPath(templatesToCopy[i]), this.props
            );
        }

        this.spawnCommand('git', ['init']);
    }

    writing() {

        let dirsToCreate = [
            'api', 'apiObjects', 'models', 'tests', 'docs', 'logs', 'public', 'sdk/unity', 'sdk/angular', 'tmp'
        ];

        let filesToCopy = ['.editorconfig', '.gitignore', '.jshintrc', '.localrc', 'eslintrc.json', 'routes', 'middleware'];


        dirsToCreate.forEach(x => {
            mkdirp(x);
        });

        for (let i = 0; i < filesToCopy.length; i++) {
            this.fs.copyTpl(
                this.templatePath(filesToCopy[i]),
                this.destinationPath(filesToCopy[i]), this.props
            );
        }

    }

    install() {
        this.installDependencies({
            bower: false
        });

    }
};
