/**
 * Created by boot on 3/12/16.
 */
var assert = require('assert');
var should = require('should');

var userCount = 1;
var buildingSaved = false;
var buildingId;
var userSaved = false;
var userState;
var userRole;
var userBuilding;
db = new function() {
    this.ObjectId = function() {
        return 'aaa';
    };
    this.Building = function() {
      this.save = function(callback) {
          buildingSaved = true;
          buildingId = this._id;
          callback();
      };
    };
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

    describe('Register correctly', function() {
        var user = {username:'username', password: 'password', rePassword:'password', email:'pasutmarcelo@gmail.com'};

        beforeEach(function() {
            buildingSaved = false;
            buildingId = undefined;
            db.User = function() {
                this.save = function(callback) {
                    userSaved = true;
                    userState = this.state;
                    userBuilding = this.buildingId;
                    userRole = this.role;
                    callback();
                };
            };
        });

        afterEach(function() {
            db.User = {
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
        });
        it('should create a building and save', function() {
            service.create(user);
            assert(buildingSaved);
            assert.equal(buildingId, 'aaa');
        });
        it('should create an User and with the building id', function() {
            service.create(user);
            assert(userSaved);
            assert.equal(userState, 'waiting');
            assert.equal(userBuilding, 'aaa');
            assert.equal(userRole, 'root');
        });
    })

});