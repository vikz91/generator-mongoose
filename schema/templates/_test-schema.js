'use strict';

var request = require('supertest');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';

/*
 *  ==== POST === 
 */

//Simple POST
describe('POST New <%= capSchemaName %>', function () {
    it('creates new <%= lowSchemaName %> and responds with json success message', function (done) {
        request(app)
            .post('/api/<%= lowSchemaName %>')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                'data': <%- mockData %>
            })
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                _id = res.body.data._id;
                done();
            });
    });
});

//Incorrect POST
describe('POST New Item Incorrectly', function () {
    it('Does not create new \'<%= lowSchemaName %>\' and responds with json error message', function (done) {
        request(app)
            .post('/api/<%= lowSchemaName %>')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                'dataX': <%- mockData %>
            })
            .expect(500)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});



/*
 *  ==== GET === 
 */

// Get List of <%= capSchemaName %>s
describe('GET List of <%= capSchemaName %>s', function () {
    it('responds with a list of <%= lowSchemaName %> items in JSON', function (done) {
        request(app)
            .get('/api/<%= lowSchemaName %>s')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

// Get Single <%= capSchemaName %>s
describe('GET <%= capSchemaName %> by ID', function () {
    it('responds with a single <%= lowSchemaName %> item in JSON', function (done) {
        request(app)
            .get('/api/<%= lowSchemaName %>/' + _id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


// Get Single <%= capSchemaName %> Incorrectly
describe('GET Item by Incorrect ID', function () {
    it('responds with a error status for \'<%= lowSchemaName %>\' in JSON', function (done) {
        request(app)
            .get('/api/<%= lowSchemaName %>/' + _id + 'X')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
});


// Get Single <%= capSchemaName %> Incorrectly
describe('GET Item by missing ID', function () {
    it('responds with a error status for \'<%= lowSchemaName %>\' in JSON', function (done) {
        request(app)
            .get('/api/<%= lowSchemaName %>/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
});

/*
 *  ==== PUT === 
 */

//Simple PUT
describe('PUT <%= capSchemaName %> by ID', function () {
    it('updates <%= lowSchemaName %> item in return JSON', function (done) {
        request(app)
            .put('/api/<%= lowSchemaName %>/' + _id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                'data': {
                    'title': 'Hell Is Where There Are No Robots'
                }
            })
            .expect(202, done);
    });
});

// PUT with Incorrect id
describe('PUT Item by Incorrect ID', function () {
    it('Does not update \'<%= lowSchemaName %>\' & return JSON with error status', function (done) {
        request(app)
            .put('/api/<%= lowSchemaName %>/' + _id + 'X')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                data: {
                    'title': 'Hell Is Where There Are No Robots'
                }
            })
            .expect(404, done);
    });
});

// PUT with Incorrect data
describe('PUT Item by Incorrect data', function () {
    it('Does not update <%= lowSchemaName %> & return JSON with error status', function (done) {
        request(app)
            .put('/api/<%= lowSchemaName %>/' + _id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                'dataX': {
                    'title': 'Hell Is Where There Are No Robots'
                }
            })
            .expect(500, done);
    });
});



/*
 *  ==== DELETE === 
 */

//Simple Delete
describe('DELETE <%= capSchemaName %> by ID', function () {
    it('should delete <%= lowSchemaName %> and return 200 status code', function (done) {
        request(app)
            .del('/api/<%= lowSchemaName %>/' + _id)
            .expect(202, done);
    });
});

//Incorrect Delete
describe('DELETE Item by Incorrect ID', function () {
    it('should NOT delete item and return 500 status code', function (done) {
        request(app)
            .del('/api/<%= lowSchemaName %>/' + _id + 'X')
            .expect(500, done);
    });
});
