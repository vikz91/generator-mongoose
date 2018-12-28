'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const _s = require('underscore.string');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.log('Initializing... ');
        this.inpModel = args[0];
        if (!this.inpModel) {
            throw new Error('Model Name and structure required! .e.g "item|name:String, price:Nummber"');
        }

        this.model = this.setupSchema(this.inpModel);


    }

    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(`${chalk.red('generator-restgoose2')} Schema Generator!`)
        );

        const prompts = [
            //   {
            //   type: 'confirm',
            //   name: 'someAnswer',
            //   message: 'Would you like to enable this option?',
            //   default: true
            // }
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('_schema.js'),
            this.destinationPath(`models/${this.model.schemaName}.js`), this.model
        );

        this.fs.copyTpl(
            this.templatePath('_api.js'),
            this.destinationPath(`api/${this.model.schemaName}.js`), this.model
        );

        this.fs.copyTpl(
            this.templatePath('_apiObject.js'),
            this.destinationPath(`apiObjects/${this.model.schemaName}.js`), this.model
        );

        this.fs.copyTpl(
            this.templatePath('_doc.js'),
            this.destinationPath(`docs/${this.model.schemaName}.md`), this.model
        );


        this.fs.copyTpl(
            this.templatePath('_test-schema.js'),
            this.destinationPath(`tests/${this.model.schemaName}.js`), this.model
        );

        // this.fs.copyTpl(
        //     this.templatePath('sdk'),
        //     this.destinationPath('sdk'), this.model
        // );

        /* ===[ Unity SDK API ]===  */
        let finalDir = 'sdk/unity/' + this.model.lowSchemaName;
        mkdirp(finalDir);

        this.fs.copyTpl(
            this.templatePath('sdk/unity/_model.js'),
            this.destinationPath(finalDir + '/Model' + this.model.capSchemaName + '.cs'), this.model
        );
        this.fs.copyTpl(
            this.templatePath('sdk/unity/_api.js'),
            this.destinationPath(finalDir + '/Api' + this.model.capSchemaName + '.cs'), this.model
        );


        // /* ===[ angular SDK API ]===  */
        finalDir = 'sdk/angular/' + this.model.lowSchemaName;
        mkdirp(finalDir);


        this.fs.copyTpl(
            this.templatePath('sdk/angular/_model.js'),
            this.destinationPath(finalDir + '/Model' + this.model.capSchemaName + '.ts'), this.model
        );
        this.fs.copyTpl(
            this.templatePath('sdk/angular/_api.js'),
            this.destinationPath(finalDir + '/Api' + this.model.capSchemaName + '.ts'), this.model
        );

    }

    setupSchema(inpModel) {
        let schemaName = inpModel.split('|')[0].trim();
        let modelStructure = {
            schemaName: schemaName,
            capSchemaName: _s.capitalize(schemaName),
            lowSchemaName: schemaName.toLowerCase(),
            schemaFields: inpModel.split('|')[1].split(','),
            mockData: {},
            sampleData: {},
            populates: []
        };

        let dictionary = {
            String: 'lorem pisum dolor sit amet',
            Number: 3.5,
            Date: new Date(),
            Object: {
                x: 'a',
                y: 'b'
            },
            Boolean: true,
            StringArray: ['lorem', 'ipsum', 'dolor'],
            NumberArray: [1, 2, 3, 4, 5, 6],
            ObjectId: '56cb91bdc3464f14678934ca',
            Mixed: {},
            Buffer: []
        };

        modelStructure.sampleData._id = '56cb91bdc3464f14678934ca';

        modelStructure.schemaFields.forEach(element => {
            let elem = element.split(':');
            let elemProp = elem[0].trim();
            let elemVal = elem[1].split('>')[0].trim();
            let elemRef = elem[1].split('>')[1] || null;

            modelStructure.mockData[elemProp] = elemRef ? dictionary.ObjectId : dictionary[elemVal];

            modelStructure.sampleData[elemProp] = elemRef ? dictionary.ObjectId : dictionary[elemVal];

            if (elemRef && elemRef.trim() !== '') {
                //let fRef = (elemRef.trim()[0].toUpperCase() + elemRef.slice(1)).trim();
                modelStructure.populates.push(elemProp);
            }
        });

        modelStructure.mockData = JSON.stringify(modelStructure.mockData);
        modelStructure.sampleData = JSON.stringify(modelStructure.sampleData);


        return modelStructure;
    }

};
