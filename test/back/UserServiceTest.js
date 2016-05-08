/**
 * Created by boot on 5/8/16.
 */
var assert = require('assert');
var should = require('should');

var userCount = 0;
var user;
var db = new function() {
    this.ObjectId = function() {
        return 'fff';
    };
    this.User = function() {
        this.save = function(callback) {
            callback();
        };
    };
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
};

var Service = require('../../services/UserService');
var service = new Service(db);

describe('UserService', function() {
   describe('Create Admin User', function() {
       describe('Create admin user with role admin', function() {
            var dto;
            var owner;
            beforeEach(function() {
                owner = {role: 'root', state: 'active', buildingId:'aaa'};
                dto = {username: 'username', email:'email@email.com'};
            });

            describe('If exist yet', function() {
                beforeEach(function() {
                    userCount = 1;
                });
                afterEach(function() {
                    userCount = 0;
                });
                it('should fail', function() {
                    var promise = service.createAdmin(dto, owner);
                    return promise.then(function(user) {
                        assert.fail();
                    }, function(error) {
                        assert.equal(error, 'exist');
                    });
                });
            });

           it('should create an id', function() {
               var promise = service.createAdmin(dto, owner);
               return promise.then(function(user) {
                   assert(user._id);
               }, function(error) {
                   assert.fail();
               });
           });

            it('should create a password', function() {

            });

            it('should set state waiting', function() {

            });

           it('should set owner building', function() {

           });

           it('should set role admin', function() {

           });
       });

       describe('Create admin user without valid role', function() {
           var dto;
           var owner;
           beforeEach(function() {
               owner = {role: 'root', state: 'active', buildingId:'aaa'};
               dto = {username: 'username', email:'email@email.com', role: 'blabla'};
           });

           it('should fail', function() {

           });
       });

       describe('Create admin user with same role', function() {
           var dto;
           var owner;
           beforeEach(function() {
               owner = {role: 'admin', state: 'active', buildingId:'aaa'};
               dto = {username: 'username', email:'email@email.com', role: 'admin'};
           });

           it('should fail', function() {

           });
       });

       describe('Create admin user with disabled user', function() {
           var dto;
           var owner;
           beforeEach(function() {
               owner = {role: 'root', state: 'disabled', buildingId:'aaa'};
               dto = {username: 'username', email:'email@email.com', role: 'admin'};
           });

           it('should fail', function() {

           });
       });
   }) ;
});