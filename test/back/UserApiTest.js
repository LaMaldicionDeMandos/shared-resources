/**
 * Created by boot on 6/7/16.
 */
var mockery = require('mockery');
var request = require('supertest');
var assert = require('assert');
var should = require('should');
var http = require('should-http');
var sinon = require('sinon');
passport = require('passport-stub');
var app;
var shouldFail = false;
process.env.NODE_ENV = 'test';

describe('User Api', function() {

    beforeEach(function () {
        passport.install(app);
        passport.login(
            {
                name: "test",
                email: "email",
                role: 'root',
                buildingId: 'aaa'
            });
    });

    afterEach(function () {
        passport.uninstall();
    });

    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var userServiceStub = function (db) {
            this.findById= function (id) {
                return {
                    then: function (callback, error) {
                        if(shouldFail) {
                            error('error');
                        } else {
                            callback({_id: 'aaa'});
                        }
                    }
                };
            };
        };
        var userDbStub = function() {};

        mockery.registerMock('../services/UserService', userServiceStub);
        mockery.registerMock('./utils/database', userDbStub);
        app = require('../../server');
    });

    after(function(){
        mockery.disable();
    });
    describe('Find by Id', function() {
        it('should return a user by id', function(done) {
            request(app)
                .get('/user/aaa')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id', 'aaa');
                    done();
                });
        });
        describe('if fail, then return status code 400', function() {
            beforeEach(function() {
               shouldFail = true;
            });
            afterEach(function() {
               shouldFail = false;
            });
            it('should return a user by id', function(done) {
                request(app)
                    .get('/user/aaa')
                    .end(function(err, res) {
                        res.should.have.status(400);
                        done();
                    });
            });
        });
    });
});