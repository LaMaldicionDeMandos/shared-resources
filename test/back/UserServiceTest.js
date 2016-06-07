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
    this.User.find = function() {
        return {
            exec: function(callback) {
                callback(null, userCount);
            }
        };
    };
    this.User.findOneAndUpdate = function() {
        return {
            exec: function(callback) {
                callback(null, user);
            }
        };
    };
    this.User.findOneAndRemove = function() {
        return {
            exec: function(callback) {
                callback(null, user);
            }
        };
    };
    this.User.findById = function(id) {
        return {
            exec: function(callback) {
                callback(null, {_id:id});
            }
        };
    }
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

    describe('Edit admin', function() {
        var owner = {role: 'root'};
        var admin = {_id:'aaa', email:'email@test.com', username:'username', role:'admin', state:'active', password:'pass'};
        var spyfindOneAndUpdate;
        beforeEach(function() {
            spyfindOneAndUpdate = sinon.spy(db.User, 'findOneAndUpdate');
        });
        afterEach(function() {
            db.User.findOneAndUpdate.restore();
        });
        it('should save changes', function() {
            service.editAdmin(admin, owner);
            assert(spyfindOneAndUpdate.withArgs({_id:'aaa'},
                {username:'username', role:'admin', state:'active', password:'pass'})
                .calledOnce);
        });
        describe('With invalid admin', function() {
            beforeEach(function() {
                owner = {role: 'admin'};
            });
            afterEach(function() {
                owner = {role: 'root'};
            });
            it('should fail', function() {
                service.editAdmin(admin, owner);
                assert(spyfindOneAndUpdate.notCalled);
            });
        });
        describe('With invalid username', function() {
            beforeEach(function() {
                admin = {_id:'aaa', email:'email@test.com', username:'', role:'admin', state:'active', password:'pass'};
            });
            it('should fail', function() {
                service.editAdmin(admin, owner);
                assert(spyfindOneAndUpdate.notCalled);
            });
        });
        describe('With invalid role', function() {
            beforeEach(function() {
                admin = {_id:'aaa', email:'email@test.com', username:'username', role:'fruta', state:'active', password:'pass'};
            });
            it('should fail', function() {
                service.editAdmin(admin, owner);
                assert(spyfindOneAndUpdate.notCalled);
            });
        });
        describe('With invalid state', function() {
            beforeEach(function() {
                admin = {_id:'aaa', email:'email@test.com', username:'username', role:'admin', state:'fruta', password:'pass'};
            });
            it('should fail', function() {
                service.editAdmin(admin, owner);
                assert(spyfindOneAndUpdate.notCalled);
            });
        });
    });
    describe('Delete admin', function() {
        var owner = {role: 'root'};
        var admin = {_id:'aaa'};
        var spyfindOneAndRemove;
        beforeEach(function() {
            spyfindOneAndRemove = sinon.spy(db.User, 'findOneAndRemove');
        });
        afterEach(function() {
            db.User.findOneAndRemove.restore();
        });
        it('should save changes', function() {
            service.deleteAdmin('aaa', owner);
            assert(spyfindOneAndRemove.withArgs({_id:'aaa'}).calledOnce);
        });
        describe('With invalid admin', function() {
            beforeEach(function() {
                owner = {role: 'admin'};
            });
            afterEach(function() {
                owner = {role: 'root'};
            });
            it('should fail', function() {
                service.deleteAdmin('aaa', owner);
                assert(spyfindOneAndRemove.notCalled);
            });
        });
    });
    describe('Find user by id', function() {
        var spyfindById;
        beforeEach(function() {
            spyfindById = sinon.spy(db.User, 'findById');
        });
        afterEach(function() {
            db.User.findById.restore();
        });
        it('should find  in db', function() {
            service.findById('aaa');
            assert(spyfindById.withArgs('aaa').calledOnce);
        });
    });
});