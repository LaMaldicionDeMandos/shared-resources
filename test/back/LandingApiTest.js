/**
 * Created by boot on 3/12/16.
 */
assert = require('assert');
//should = require('should');
//http = require('should-http');
//sinon = require('sinon');
request = require('supertest');
//passport = require('passport-stub');
//nock = require('nock');
//process.env.NODE_ENV = 'test';
var app = require('../../server');

describe('Landing Api', function() {
    describe('POST register and return 201', function() {
        it('should call register resource from landing api and return 201', function(done) {
            request(app)
                .post('/register')
                .expect(201, done);
        });
    });
});