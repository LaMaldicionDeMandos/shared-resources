/**
 * Created by boot on 3/12/16.
 */
var assert = require('assert');
var should = require('should');

var userCount = 1;
db = new function() {
    this.User = {
        where: function() {
            return {count: function() {
                return {
                    exec: function(callback) {
                        callback(null, userCount);
                    }
                };
            }}
        }
    };
};

var service = require('../../services/authenticationService');

describe('AuthenticationService', function() {
    describe('Register user without errors', function() {
        var user = {username:'username', password: 'password', rePassword:'password', email:'pasutmarcelo@gmail.com'};
        it('should verify that is valid user', function() {
            assert.ok(service.validateRegisterCredentials(user));
        });
    });
    describe('Register bad user', function() {
        describe('Register user with bad username', function() {
            var user = {username:'', password: 'password', rePassword:'password', email:'pasutmarcelo@gmail.com'};
            it('should verify that user is invalid', function() {
                assert(!service.validateRegisterCredentials(user));
            });
        });
        describe('Register user with bad password', function() {
            var user = {username:'username', password: '', rePassword:'password', email:'pasutmarcelo@gmail.com'};
            it('should verify that user is invalid', function() {
                assert(!service.validateRegisterCredentials(user));
            });
        });
        describe('Register user with bad re-password', function() {
            var user = {username:'username', password: 'password', rePassword:'repassword', email:'pasutmarcelo@gmail.com'};
            it('should verify that user is invalid', function() {
                assert(!service.validateRegisterCredentials(user));
            });
        });
        describe('Register user with bad email', function() {
            var user = {username:'username', password: 'password', rePassword:'password', email:'pasutmarcelo_gmail.com'};
            it('should verify that user is invalid', function() {
                assert(!service.validateRegisterCredentials(user));
            });
        });
    });

    describe('User existence validation', function() {
        var user = {username:'username', password: 'password', rePassword:'password', email:'pasutmarcelo_gmail.com'};
        describe('User not exist', function() {
            beforeEach(function() {
                userCount = 0;
            });

            it('should verify that user not exist', function() {
                var promise = service.existUser(user);
                promise.then(function(result) {
                   assert(!result);
                }, function(error) {
                   assert.fail();
                });
            });
        });

        describe('User exist', function() {
            beforeEach(function() {
                userCount = 1;
            });
            it('should verify that user exist', function() {
                var promise = service.existUser(user);
                promise.then(function(result) {
                    assert(result);
                }, function(error) {
                    assert.fail();
                });
            });
        });
    });

});