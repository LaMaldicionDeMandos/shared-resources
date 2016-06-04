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
});