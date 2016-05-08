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
var error = null;
var user;
var db = new function() {
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
    this.User = new Object();
    this.User.where = function() {
            return {
                count: function() {
                    return {
                        exec: function(callback) {
                            callback(null, userCount);
                        }
                    };
                }
            };
        };
    this.User.findById = function(id) {
        return {
            exec: function(callback) {
                callback(null, user);
            }
        }
    }
};

var Service = require('../../services/authenticationService');
var service = new Service(db);

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
                return promise.then(function(result) {
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
                return promise.then(function(result) {
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
    });

    describe('Authenticate', function() {
        beforeEach(function() {
            db.User.findOne = function(object) {
                return {
                    exec: function(callback) {
                        callback(error, user);
                    }
                };
            };
        });
       describe('db send error', function() {
           beforeEach(function() {
               error = 'error';
               user = null;
           });
           it('should reject promise with error message', function() {
               var promise = service.authenticate('bla', 'bla');
               return promise.then(function(user) { assert.ok(false);}, function(error) { assert.equal(error, 'error');});
           });
       });
        describe('not found user', function() {
            beforeEach(function() {
                error = null;
                user = null;
            });
            it('should reject promise with error not_exist', function() {
                var promise = service.authenticate('bla', 'bla');
                return promise.then(function(user) { assert.ok(false);}, function(error) { assert.equal(error, 'not_exist');});
            });
        });
        describe('found user unactive', function() {
            beforeEach(function() {
                error = null;
                user = {state: 'waiting'};
            });
            it('should reject promise with error inactive', function() {
                var promise = service.authenticate('bla', 'bla');
                return promise.then(function(user) { assert.ok(false);}, function(error) { assert.equal(error, 'inactive');});
            });
        });
        describe('found user valid', function() {
            beforeEach(function() {
                error = null;
                user = {state: 'active'};
            });
            it('should resolve promise with active user', function() {
                var promise = service.authenticate('bla', 'bla');
                return promise.then(function(user) {
                    assert.ok(user);
                }, function(error) {
                    assert.ok(false);
                });
            });
        });
    });
    describe('Find user by id', function() {
        beforeEach(function() {
            error = null;
            user = {username:'username', password: 'password', rePassword:'password', email:'pasutmarcelo_gmail.com'};
            db.User.findById = function(id) {
                return {
                    exec: function(callback) {
                        callback(error, user);
                    }
                };
            };
        });
        it('should resolve promise with user', function() {
            var promise = service.findById('ID');
            return promise.then(function(user) {
                assert.ok(user);
            }, function(error) {
                assert.ok(false);
            });
        });
    });
    describe('Find user by facebook id', function() {
        beforeEach(function() {
            error = null;
            user = {facebookId: 'facebook_id',username:'username', password: 'password', rePassword:'password',
                email:'pasutmarcelo_gmail.com'};
            db.User.findByOne = function(query) {
                return {
                    exec: function(callback) {
                        callback(error, user);
                    }
                };
            };
        });
        it('should resolve promise with user', function() {
            var promise = service.findByFacebookId('facebook_id');
            return promise.then(function(user) {
                assert.ok(user);
            }, function(error) {
                assert.ok(false);
            });
        });
    });
    describe('find user by email', function() {
        beforeEach(function() {
            error = null;
            user = {facebookId: 'facebook_id',username:'username', password: 'password', rePassword:'password',
                email:'pasutmarcelo_gmail.com'};
            db.User.findByOne = function(query) {
                return {
                    exec: function(callback) {
                        callback(error, user);
                    }
                };
            };
        });
        it('should resolve promise with user', function() {
            var promise = service.findByEmail('pasutmarcelo@gmail.com');
            return promise.then(function(user) {
                assert.ok(user);
            }, function(error) {
                assert.ok(false);
            });
        });
    });
    describe('Attach user with facebook', function() {
        beforeEach(function() {
            error = null;
            db.User.findByOne = function(query) {
                return {
                    exec: function(callback) {
                        callback(error, user);
                    }
                };
            };
        });
        describe('user not found', function() {
            beforeEach(function() {
                user = null;
            });
            it('should reject promise with error', function() {
                var promise = service.attachUserWithFacebook({emails:['pasutmarcelo@gmail.com'], id: 'facebook_id'});
                return promise.then(function(user) {
                    assert.ok(false);
                }, function(error) {
                    assert.equal(error, 'user_not_found');
                });
            });
        });
        describe('success', function() {
            beforeEach(function() {
                user = {username:'username', password: 'password', rePassword:'password',
                    email:'pasutmarcelo@gmail.com', save: function(callback) { callback();}};
            });
            it('should resolve promise with user', function() {
                var promise = service.attachUserWithFacebook({emails:['pasutmarcelo@gmail.com'], id: 'facebook_id'});
                return promise.then(function(user) {
                    assert.equal(user.facebookId, 'facebook_id')
                }, function(error) {
                    assert.ok(false);
                });
            });
        });
    });
    describe('activate', function() {
        beforeEach(function() {
            error = null;
            user = {username:'username', password: 'password', rePassword:'password', email:'pasutmarcelo_gmail.com',
            state: 'waiting', save: function(callback) { callback()}};
            db.User.findById = function(id) {
                return {
                    exec: function(callback) {
                        callback(error, user);
                    }
                };
            };
        });
        it('should change user.state to active and return it', function() {
            var promise = service.firstAuthenticate('ID');
            return promise.then(function(user) {
                assert.ok(user);
                assert.equal(user.state, 'active');
            }, function(error) {
                assert.ok(false);
            });
        });
    })
});