/**
 * Created by boot on 3/12/16.
 */
var mockery = require('mockery');
var assert = require('assert');
process.env.NODE_ENV = 'test';
var app;

describe('ConfigTest', function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var dbStub = function() {};

        mockery.registerMock('./utils/database', dbStub);
        app = require('../../server');
    });

    after(function(){
        mockery.disable();
    });
    describe('some property', function() {
        it('db_connection should be mock', function() {
            assert.equal(config.db_connection, 'mock');
        });
    });
});