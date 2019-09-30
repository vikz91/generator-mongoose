'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
    constructor (args, opts) {
        super(args, opts);
        this.spawnCommand(
            'npm',
            [
                'install',
                '--save',
                'passport',
                'passport-local',
                'passport-jwt',
                'bcryptjs',
                'redis',
                'request',
                'jsonwebtoken'
            ],
            {
                cwd: './'
            }
        );
    }

    prompting () {
        // have Yeoman greet the user.
        this.log(
            yosay(
                `Authentication using ${chalk.red(
                    'generator-restgoose2'
                )} generator!`
            )
        );

        // const prompts = [{
        //     type: 'confirm',
        //     name: 'someAnswer',
        //     message: 'Would you like to enable this option?',
        //     default: true
        // }];

        // return this.prompt(prompts).then(props => {
        //     // To access props later use this.props.someAnswer;
        //     this.props = props;
        // });
    }

    writing () {
        let templateTranslate = (src, dest) => {
            this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest));
        };

        templateTranslate('_authRoute.js', 'api/auth.js');
        templateTranslate('_authController.js', 'apiObjects/auth.js');
        templateTranslate('_userModel.js', 'models/user.js');

        templateTranslate('_userObj.js', 'apiObjects/user.js');
        templateTranslate('_userApi.js', 'api/user.js');
    }

    install () {
        this.installDependencies({
            bower: false
        });
    }
};
