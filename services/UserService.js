/**
 * Created by boot on 5/8/16.
 */
var q = require('q');
var passwordGenerator = require('generate-password');

function UserService(db) {
    var validateExistence = function(query, shouldExist) {
        var def = q.defer();
        db.User.where(query).count().exec(function(err, result) {
            if (err) {
                def.reject(err);
            } else {
                if((shouldExist && result == 0) || (!shouldExist && result > 0)) {
                    def.reject(shouldExist ? 'not_exist' : 'exist');
                } else {
                    def.resolve();
                }
            }
        });
        return def.promise;
    };
    this.validateSuperAdmin = function(user) {
        return 'root' == user.role || 'sadmin' == user.role;
    };
    this.validateActiveUser = function(user) {
        return user.state == 'active';
    }
    this.createAdmin = function(dto, owner) {
        var def = q.defer();
        var query = {email: dto.email, buildingId: owner.buildingId};
        if(!this.validateSuperAdmin(owner)) {
            def.reject('permissions');
            return def.promise;
        }
        if(!this.validateActiveUser(owner)) {
            def.reject('disabled');
            return def.promise;
        }
        validateExistence(query, false).then(
            function() {
                var user = new db.User();
                user._id = db.ObjectId().toString();
                user.username = dto.username;
                user.password = passwordGenerator.generate({length: 10});
                user.profile = {contact:{email: dto.email}};
                user.email = dto.email;
                user.role = dto.role;
                user.state = 'waiting';
                user.buildingId = owner.buildingId;
                user.save(function(err) {
                    if(err) {
                        def.reject(err);
                    } else {
                        def.resolve(user);
                    }
                });
                return def.promise;
                def.resolve(dto);
            },
            function(error) {
                def.reject(error);
            }
        );
        return def.promise;
    };

    this.manageAdmins = function(owner) {
        if (owner.role == 'sadmin') {
            return ['admin'];
        }
        if (owner.role == 'root') {
            return ['sadmin', 'admin'];
        }
        return [];
    };
    this.findAdmins = function(owner) {
        var def = q.defer();
        var adminTypes = this.manageAdmins(owner);
        if(adminTypes.length == 0) {
            def.reject('not admin user');
            return def.promise;
        }
        var query = {buildingId: owner.buildingId, role:{ $in: adminTypes}};
        if (!this.validateActiveUser(owner)) {
            def.reject('not active user');
            return def.promise;
        }
        this.find(query).then(
            function(users) {
                def.resolve(users);
            },
            function(error) {
                def.reject(error);
            }
        );
        return def.promise;
    };

    this.find = function(query) {
        var def = q.defer();
        db.User.find(query).exec(function(err, result) {
            if (err) {
                def.reject(err);
            } else {
                def.resolve(result);
            }
        });
        return def.promise;
    };

    this.validateUsername = function(username) {
        return username != null && username.length > 0;
    };

    this.validateState = function(state) {
        return state == 'active' || state == 'disabled';
    };

    this.validateRole = function(state) {
        return state == 'sadmin' || state == 'admin';
    };

    this.editAdmin = function(dto, owner) {
        var def = q.defer();
        if(!this.validateSuperAdmin(owner)) {
            def.reject('permissions');
            return def.promise;
        }
        if(!this.validateUsername(dto.username)) {
            def.reject('permissions');
            return def.promise;
        }
        if(!this.validateState(dto.state)) {
            def.reject('permissions');
            return def.promise;
        }
        if(!this.validateRole(dto.role)) {
            def.reject('permissions');
            return def.promise;
        }
        var query = {_id: dto._id};
        var update = {username: dto.username, role: dto.role, state: dto.state, password: dto.password};
        db.User.findOneAndUpdate(query, update, {new:true}).exec(function(err, admin) {
            if(err) {
                def.reject(err);
            } else {
                def.resolve(admin);
            }
        });
        return def.promise;
    };
    this.deleteAdmin = function(id, owner) {
        var def = q.defer();
        if(!this.validateSuperAdmin(owner)) {
            def.reject('permissions');
            return def.promise;
        }
        var query = {_id: id};
        db.User.findOneAndRemove(query).exec(function(err, admin) {
            if(err) {
                def.reject(err);
            } else {
                def.resolve(admin);
            }
        });
        return def.promise;
    };
    this.findById = function(id) {
        var def = q.defer();
        db.User.findById(id).exec(function(err, user) {
            if(err) {
                def.reject(err);
            } else {
                def.resolve(user);
            }
        });
        return def.promise;
    };
};

module.exports = UserService;