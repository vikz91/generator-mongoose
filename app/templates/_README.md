# <%= capName %>
 
##### *Enter mini description here* #####

## Quick Links
If you would like to contribute, please refer to [guidelines](https://github.com/<%= capName %>/<%= capName %>/blob/master/CONTRIBUTING.md) and a list of [open tasks](https://github.com/<%= capName %>/<%= capName %>/issues).

For more information, please refer to the [Wiki page](https://github.com/<%= capName %>/<%= capName %>/wiki) and [FAQ](https://github.com/<%= capName %>/<%= capName %>/wiki/FAQ) 


## Description  
Lorem Ipsum Description ...

## Overview 
<%= capName %> project allows ....  

<%= capName %> is made with:

- NodeJS
- MongoDB
- Express
- Mongoose
- Grunt
- Yeoman
- Yeoman Restgoose
-  ..., *and many more awesome tools*.


Check out [jSend](https://labs.omniti.com/labs/jsend) for additional information about the JSON API Response Specs.

## Table of contents

  - [<%= capName %>](#awesome-api-generator)
  - [Description](#Description)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#Architecture)
  - [Generic Endpoint Summary](#Generic-Endpoint-Summary)
  - Installation
    - [Compatibility](#compatibility)
    - [Prerequisites](#prerequisites)
    - [Building](#building)
    - [Docker](#docker)
    - [Homebrew](#homebrew)
  - [Getting Started](#getting-started)
  - [Workflow Integration](#workflow-integration)
  - [Github Integration](#github-integration)
  - [Online Generators](#online-generators)
  - [Guidelines for Contribution](https://github.com/awesome-api-generator/awesome-api-generator/wiki/Guidelines-for-Contribution)
  - [Companies/Projects using <%= capName %>](#companiesprojects-using-<%= capName %>)
  - [<%= capName %> Core Team](#<%= capName %>-core-team)
  - [License](#license)


  
## Architecture
All Schemas will have basic CRUD operations with added endpoints. A `markdown` detailed documentation page is available for each schema in the `docs` directory.

API Infrastructure : (Image Courtesy : [APIGEE](https://pages.apigee.com/watch-demo-edge-reg.html))  
![Image Courtesy : https://pages.apigee.com/watch-demo-edge-reg.html](https://pages.apigee.com/rs/apigee/images/demo-page-graph.png)

## Generic Endpoint Summary
* `[GET]` /api/\<schema>s - Retrieve All *Items*
* `[POST]` /api/\<schema> - Create a new *Item*
* `[GET]` /api/\<schema>/<:id> - Retrieve a single *Item* with `id`
* `[PUT]` /api/\<schema>/<:id> - Edit a single *Item* with `id`
* `[DELETE]` /api/\<schema>/<:id> - Delete a single *Item* with `id`
* `[GET]` /api/\<schema>s/test - Quick Test item
* `[DELETE]` /api/\<schema>s - Delete all *items* in the collection

**N.B**: The `/test` endpoint for all schemas are for quick development testing only. Do Disable this when in production!


## License

MIT  
Copyright 2017 \<COPYRIGHT HOLDER>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

:warning:  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

