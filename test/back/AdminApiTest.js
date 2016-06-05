/**
 * Created by boot on 6/4/16.
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

describe('Admin Api', function() {

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

        var adminServiceStub = function (db) {
            this.findAdmins= function (owner) {
                return {
                    then: function (callback) {
                        callback([]);
                    }
                };
            };
            this.editAdmin = function(admin, owner) {
                return {
                    then: function (success, error) {
                        if(shouldFail) {
                            error('error');
                        } else {
                            success(admin);

                        }
                    }
                };
            };
            this.deleteAdmin = function(id, owner) {
                return {
                    then: function (success, error) {
                        if(shouldFail) {
                            error('error');
                        } else {
                            success({_id: id});

                        }
                    }
                };
            };
        };
        var adminDbStub = function() {};

        mockery.registerMock('../services/UserService', adminServiceStub);
        mockery.registerMock('./utils/database', adminDbStub);
        app = require('../../server');
    });

    after(function(){
        mockery.disable();
    });
    describe('List', function() {
        it('should return the list', function(done) {
            request(app)
                .get('/admin')
                .end(function(err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Edit', function() {
        it('should return the saved user', function(done) {
            var admin = {state: 'disabled'};
            request(app)
                .put('/admin')
                .send(admin)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('state', 'disabled');
                    done();
                });
        });
        describe("when fail", function() {
            beforeEach(function() {
                shouldFail = true;
            });
            afterEach(function() {
                shouldFail = false;
            });
            it('should return status 400', function(done) {
                var admin = {state: 'disabled'};
                request(app)
                    .put('/admin')
                    .send(admin)
                    .end(function(err, res) {
                        res.should.have.status(400);
                        res.body.should.have.property('state', 'disabled');
                        done();
                    });
            });
        })
    });
    describe('Delete', function() {
        it('should return the deleted user', function(done) {
            var admin = {_id: 'aaa'};
            request(app)
                .delete('/admin/aaa')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id', 'aaa');
                    done();
                });
        });
        describe("when fail", function() {
            beforeEach(function() {
                shouldFail = true;
            });
            afterEach(function() {
                shouldFail = false;
            });
            it('should return status 400', function(done) {
                var admin = {_id: 'aaa'};
                request(app)
                    .delete('/admin/aaa')
                    .end(function(err, res) {
                        res.should.have.status(400);
                        done();
                    });
            });
        })
    });
});