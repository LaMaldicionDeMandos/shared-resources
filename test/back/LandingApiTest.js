/**
 * Created by boot on 3/12/16.
 */
var mockery = require('mockery');
var request = require('supertest');
var assert = require('assert');
var should = require('should');
var http = require('should-http');
var sinon = require('sinon');
var app;
var authentication;
var validUser = true;
var existUser = false;
var serviceFail = false;
process.env.NODE_ENV = 'test';
describe('Landing Api', function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var serviceStub = {
            validateRegisterCredentials: function (user) {
                return validUser;
            },
            existUser: function (user) {
                return {
                    then: function (callback) {
                        callback(false);
                    }
                };
            },
            create: function (user) {
                return {then: function(callback) {
                    callback(user);
                }};
            },
            authenticate: function(username, password) {
                return {
                    then: function (success, fail) {
                        if (serviceFail) {
                            fail('error');
                        } else {
                            success('success');
                        }
                    }
                };
            }
        };

        var dbStub = function() {};

        mockery.registerMock('../services/authenticationService', serviceStub);
        mockery.registerMock('./utils/database', dbStub);
        app = require('../../server');
        authentication = require('../../routes/landing').authenticate;
    });

    after(function(){
        mockery.disable();
    });


    describe('POST register with correct user in body', function() {
        it('should call register resource from landing api and return 201', function(done) {
            request(app)
                .post('/register')
                .end(function(err, res) {
                   res.should.have.status(201);
                    done();
                });
        });
    });

    describe('POST register with invalid user in body', function() {
        beforeEach(function() {
            validUser = false;
        });
        it('should call register resource from landing api and return 400 with invalid error', function(done) {
            request(app)
                .post('/register')
                .end(function(err, res) {
                    res.should.have.status(400);
                    res.text.should.equal('invalid');
                    done();
                });
        });
    });

    describe('User authenticate', function() {
        var done;
        var spyDone;
        beforeEach(function() {
            done = {done: function(e, v){}};
            spyDone = sinon.spy(done, 'done');
            spyDone.withArgs('error');
            spyDone.withArgs(null, 'success');
        });
        describe('if fail aunthentication', function() {
            beforeEach(function() {
                serviceFail = true;
            });
            afterEach(function() {
               serviceFail = false;
            });
            it('should call done with an error', function() {
                authentication('username', 'password', done.done);
                assert(spyDone.withArgs('error').calledOnce);
                assert(spyDone.withArgs(null, 'success').notCalled);
            });
        });
        describe('success aunthentication', function() {
            it('should call done with an error', function() {
                authentication('username', 'password', done.done);
                assert(spyDone.withArgs('error').notCalled);
                assert(spyDone.withArgs(null, 'success').calledOnce);
            });
        })
    });
});