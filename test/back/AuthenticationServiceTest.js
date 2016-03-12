/**
 * Created by boot on 3/12/16.
 */
var service = require('../../services/authenticationService');
var assert = require('assert');
var should = require('should');

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

});