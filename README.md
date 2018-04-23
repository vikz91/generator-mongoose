# generator-restgoose [![Build Status](https://travis-ci.org/vikz91/generator-restgoose.svg?branch=master)](https://travis-ci.org/vikz91/generator-restgoose) [![npm version](https://badge.fury.io/js/generator-restgoose.svg)](https://badge.fury.io/js/generator-restgoose) [![Join the chat at https://gitter.im/generator-restgoose/Lobby](https://badges.gitter.im/generator-restgoose/Lobby.svg)](https://gitter.im/generator-restgoose/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##### _Mongoose RESTful API generator for your NodeJS Express App_ v0.3.1

A [custom-built Mongoose generator](http://abhishekdeb.com/rapid-nodejs-rest-server-generator/) for [Yeoman](http://yeoman.io). The base project has been forked from afj176/generator-mongoose and has been updated with many new features, tests and tweaks to get you full fledged _out-of-the-box_ NodeJS Express API Application up and running, Route vs Model Segregation and much more.

[![NPM](https://nodei.co/npm/generator-restgoose.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/generator-restgoose/)

**Minimum Node Version : 6.x  
Minimum NPM Version : 3.x**

## Whats New in v0.3.x?

*   New Runtime Configurable Email System with Nodemailer, sendgrid and mailgun
*   New Environment based Configuration System
*   Moved Helper functions to seperate object (util) in config
*   Linted all generated code
*   [...More](CHANGELOG.md)

## Quick Links

If you would like to contribute, please refer to [guidelines](https://github.com/vikz91/generator-restgoose/wiki/Guidelines) and a list of [open tasks](https://github.com/vikz91/generator-restgoose/issues?q=is%3Aopen+is%3Aissue).

For more information, please refer to the [Wiki page](https://github.com/vikz91/generator-restgoose/wiki) and [FAQ](https://github.com/vikz91/generator-restgoose/wiki/FAQ)

## Overview

*   Scaffolds _out-of-the-box_ REST API Server
*   Full blow n ready to use Authentication and Authorization (Passport + JWT + Redis)
*   Generates All Ready to run files - Model ( Mongoose) - Api Route (endpoint) - Api Object (Business Layer, crud logic) - Documentation (API reffernce) - Test File
*   Generates _ready-to-rock_ README file with License(MIT), etc.
*   Runtime Configurable Email System
*   Highly Scalable System Configuration based on environment
*   Conforms to jSend Specs for API JSON Response
*   Modular and based on `Seperation of Concern`
*   Fast and readible code generation
*   Email Templates
*   Full Blown JWT REST Authentication
*   ... [much more](#bucket-list)

## Table of contents

*   [Generator Restgoose](#generator-restgoose)
*   [Quick Links](#quick-links)
*   [Overview](#overview)
*   Table of Contents
*   [Getting Started](#getting-started)
*   [Command List](#command-list)
*   [Architecture](#architecture)
*   [ChangeLog](#changeLog)
*   [Bucket List](#bucket-list)
*   [Guidelines for Contribution](https://github.com/vikz91/generator-restgoose/wiki/Guidelines)
*   [Generator Restgoose Core Team](#generator-restgoose-core-team)
*   [License](#license)

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/KvLOBSb.jpg)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. _Make sure you clean up, he likes new and shiny things._

```
$ npm install -g yo
```

### Generator Restgoose

While running through a leafy mongodb field he picked up mongoose.  
Generator-Restgoose scaffolds all API Routes, API Objects ( Bussiness Logic), Schema Models, Test Cases, and even Documentation for you with full CRUD functionality.

To install generator-restgoose from npm, run:

```
$ npm install -g generator-restgoose
```

Finally, initiate the generator:

```
$ yo restgoose
```

It should output a file structure similiar to:

```
.bowerrc
.editorconfig
.jshintrc
api/
apiObjects/
config/
... db.js
... lib.js
docs/
public/
models/
routes/
... index.js
test/
views/
bower.json
Gruntfile.js
package.json
Readme.md
```

*   models - contains Mongoose Schema of an entity ( Data Layer)
*   apiObjects - Contains business logic &amp; model access for each entity ( Business Layer )
*   api - Contains routes of each entity ( Presentation Layer / Controller )
*   test - contains unit test cases for each entity
*   docs - contains Detailed `markdown` formatted documentation of each Schema generated through the sub-generator.

Put All Configurations in concerned environment in ./config. All of them inherit from global.
Don't forget to checkout the `require('./config').util` module which contains many useful stuff (Json Validator, image to Base64 Converter, etc).
Use the Library as `var l = require('../config').util;` ( which generates with every sub schema).

Try to use `l.p('Print something');` to log something. This will log to debug.log file.

Logging
Two log files are served : debug.log and access.log.

All responses are valid [jSend](https://labs.omniti.com/labs/jsend) spec conformed JSON format.

### Prepare for Development Server

grunt

### Prepare for Test Server

grunt test

### Run the app

Development mode

```bash
$ grunt
```

or

```bash
$ grunt server
```

Production mode

```bash
$ grunt prod
```

### Sub Generators

#### Schema

Creates all required Model, Controllers, test cases, routes and documentations for a particular Schema. Run the sub generator for schemas:

```
$ yo restgoose:schema "article|title:String,excerpt:String,content:String,published:Boolean,created:Date"
```

output:

```
You're creating a schema for article
With the fields: title,excerpt,content,published,created
create routes/article.js
create models/article.js
starting request to schematic for test mock data...
create test/test-article.js
create doc/article.md
```

#### DeleteSchema

Deletes all files (Model, APi Route, API Object, Doc, Test) for a particular schema. Run the sub generator for deleteschema:

```
$ yo restgoose:deleteschema "article" --force
```

**N.B.** You need to use --force else y=Yeoman will continue asking you to overwrite each file.  
output:

```
You're deleting all files for schema: article

force api/article.js
force apiObjects/article.js
force models/article.js
force docs/article.md
force test/test-article.js
```

#### Auth

Enabled Passport + Redis + JWT based Authentication and Authorization for your RESR API server.

```
$ yo restgoose:auth "auth"
```

**N.B.** Run this before creating user model and auth controllers or else, they will be overwritten.  
output:

```
Instantiating Authentication ...


   create api/auth.js
   create apiObjects/auth.js
   create models/user.js
   create middlewares/passport.js
   create docs/auth.md
   create routes/sampleauth.js
```

You should checkout the `docs/auth.md` after issuing this command for complete reference.

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

## Command List

*   mkdir newAPi && cd $\_ - Create new Server Directory and cd into it.
*   yo restgoose - initiate a project
*   yo restgoose:auth - Install JWT and redis ready auth system
*   Uncomment app.js sections for auth and redis
*   yo restgoose:schema "\<schema\>|field:DataType" - Create all routers, models, test and docs for a schema
*   yo restgoose:deleteschema "\<Schema\>" - Delete all related generated files for a schema
*   grunt - start server with watch enabled
*   npm test - Start Testing generated schemas

## Architecture

WIP

## ChangeLog

[Detailed Changelog](CHANGELOG.md)

## Bucket List

Create Test for auth and delete sub-generators

*   Write Testcase checking auth sub-gen
*   API Dynamic on-demand Doc Generator
*   Conform to [REST API Standards](https://github.com/WhiteHouse/api-standards/blob/master/README.md)
*   Socket.IO Generator (wohooo)
*   Docker Scripts
*   AutoStart Script using PM2 ( 1 click deploy)
*   Modulraize Architecture as Plug and play and SoC - will take huge time
*   ~~Complete ReadME file for the generated api project~~
*   ~~Pre-defined generated docs for the generated API endpoints~~
*   ~~Complete README file for generator-restgoose project (this one)~~
*   ~~Write Reasons, Troubleshooting and migration for v0.1.5 to 0.1.6 in a wiki/blog~~ - NA
*   ~~Seperate Nevironment Based Configurations~~
*   ~~API Versioning System~~
*   ~~out-of-the-box passportJS authentication with JWT~~ \m/-

## Generator Restgoose Core Team

*   Development & Maintenance : [Abhishek Deb](https://in.linkedin.com/in/debabhishek)

## License

MIT  
Copyright 2017 Abhishek Deb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

:warning: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

![NPM](https://david-dm.org/vikz91/generator-restgoose.svg)

[![NPM](https://nodei.co/npm-dl/generator-restgoose.png)](https://nodei.co/npm/generator-restgoose/)
