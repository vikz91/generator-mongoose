'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _s = require('underscore.string');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting () {
    // have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the Rapid Rest API Generator ${chalk.red('generator-restgoose')}!`)
    );

    const prompts = [{
      name: 'dbName',
      message: 'Database Name',
      default: 'myDb'
    },
    {
      name: 'hostUrl',
      message: 'Host Url',
      default: 'api.restgoose.com'
    },
    {
      type: 'confirm',
      name: 'useAuth',
      message: 'Use User Authentication',
      default: false
    }
    ];

    return this.prompt(prompts).then(props => {
      // to access props later use this.props.someAnswer;
      this.props = props;
      this.props.slugName = _s.slugify(this.appname);
      this.props.capName = _s.capitalize(this.appname);
    });
  }

  configuring () {
    this.spawnCommand('git', ['init']);

    const templatesToCopy = ['package.json', 'README.md', 'config', 'api','tools', 'LICENSE', 'docker-compose.yml'];

    for (let i = 0; i < templatesToCopy.length; i += 1) {
      this.fs.copyTpl(
        this.templatePath(templatesToCopy[i]),
        this.destinationPath(templatesToCopy[i]), this.props
      );
    }
  }

  writing () {
    const dirsToCreate = [
      'api', 'apiObjects', 'models', 'tests', 'docs', 'logs', 'public', 'sdk/unity', 'sdk/angular', 'tmp', ''
    ];

    const filesToCopy = ['.editorconfig', '.gitignore', 'app.js', 'cloudbuild.yaml',
      'Dockerfile', 'ecosystem.config.js', 'eslintrc.json', 'index.js',
      'public', 'plugins', 'middleware', 'keys', 'emailTemplates', 'library'
    ];

    dirsToCreate.forEach(x => {
      mkdirp(x);
    });

    for (let i = 0; i < filesToCopy.length; i += 1) {
      this.fs.copyTpl(
        this.templatePath(filesToCopy[i]),
        this.destinationPath(filesToCopy[i]), this.props
      );
    }
  }

  install () {
    this.installDependencies({
      bower: false
    });
  }

  end () {
    if(this.props.useAuth){
      this.composeWith('restgoose:auth',{});
    }
  }
};
