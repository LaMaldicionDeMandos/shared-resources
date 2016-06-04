/**
 * Created by boot on 5/8/16.
 */
var assert = require('assert');
var should = require('should');
var sinon = require('sinon');

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
                dto = {username: 'username', email:'email@email.com', role: 'admin'};
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
                var promise = service.createAdmin(dto, owner);
                return promise.then(function(user) {
                    assert(user.password);
                }, function(error) {
                    assert.fail();
                });
            });

            it('should set state waiting', function() {
                var promise = service.createAdmin(dto, owner);
                return promise.then(function(user) {
                    assert.equal(user.state, 'waiting');
                }, function(error) {
                    assert.fail();
                });
            });

           it('should set owner building', function() {
               var promise = service.createAdmin(dto, owner);
               return promise.then(function(user) {
                   assert.equal(user.buildingId, 'aaa');
               }, function(error) {
                   assert.fail();
               });
           });

           it('should set role admin', function() {
               var promise = service.createAdmin(dto, owner);
               return promise.then(function(user) {
                   assert.equal(user.role, 'admin');
               }, function(error) {
                   assert.fail();
               });
           });
           describe('it is a super admin', function() {
               beforeEach(function() {
                   dto.role = 'sadmin';
               });
               it('should set role sadmin', function() {
                   var promise = service.createAdmin(dto, owner);
                   return promise.then(function(user) {
                       assert.equal(user.role, 'sadmin');
                   }, function(error) {
                       assert.fail();
                   });
               });
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
               var promise = service.createAdmin(dto, owner);
               return promise.then(function(user) {
                   assert.fail();
               }, function(error) {
                   assert(error);
               });
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
               var promise = service.createAdmin(dto, owner);
               return promise.then(function(user) {
                   assert.fail();
               }, function(error) {
                   assert(error);
               });
           });
       });
   }) ;
    describe('List Admin Users', function() {
        var owner;
        var spyFind;

        beforeEach(function() {
            owner = {state: 'active', buildingId:'aaa', role: 'root'};
            spyFind = sinon.spy(service, 'find');
        });
        afterEach(function() {
            service.find.restore();
        });
        it('should get only users with same building', function() {
            service.findAdmins(owner);
            assert(spyFind.withArgs({buildingId: 'aaa', role: { $in: ['sadmin', 'admin']}}).calledOnce);
        });
        describe('When owner is not active', function() {
            beforeEach(function() {
                owner.state = 'disabled';
            });
            it('should fail then no call find', function() {
                service.findAdmins(owner);
                assert(spyFind.withArgs({buildingId: 'aaa', role: { $in: ['sadmin', 'admin']}}).notCalled);
            });
        });
        describe('If owner is a root', function(){
            it('should find all both admin and s admin users', function() {
                service.findAdmins(owner);
                assert(spyFind.withArgs({buildingId: 'aaa', role: { $in: ['sadmin', 'admin']}}).calledOnce);
            })
        });

        describe('If owner is a sadmin', function(){
            beforeEach(function() {
                owner.role = 'sadmin';
            });
            it('should find only admin users', function() {
                service.findAdmins(owner);
                assert(spyFind.withArgs({buildingId: 'aaa', role: { $in: ['admin']}}).calledOnce);
            })
        });
        describe('If owner is admin', function(){
            beforeEach(function() {
                owner.role = 'admin';
            });
            it('should fail because it has not can be admins', function() {
                service.findAdmins(owner);
                assert(spyFind.notCalled);
            });
        });
    });
});