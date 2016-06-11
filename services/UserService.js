/**
 * Created by boot on 5/8/16.
 */
var q = require('q');
var passwordGenerator = require('generate-password');
var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var rt = /^@?(\w){1,15}$/;
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
    var validateEmail = function(email) {
        return re.test(email);
    };

    var validateProfileEmail = function(email) {
        return !email || email.length == 0 || validateEmail(email);
    };

    var validateTwitter = function(twitter) {
        return !twitter || twitter.length == 0 || rt.test(twitter);
    }
    var validateUpdate = function(user, owner) {
        return user._id == owner._id && validateProfileEmail(user.profile.contact.email) &&
            validatePassword(user.password) && validateTwitter(user.profile.contact.twitter);
    };
    var validatePassword = function(password) {
        return password.length > 0;
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
    this.update = function(user, owner) {
        var def = q.defer();
        if (validateUpdate(user, owner)){
            db.User.findByIdAndUpdate(user._id, {$set:{password:user.password, profile:{photo:user.profile.photo,
                fullName:user.profile.fullName, gender:user.profile.gender, summary:user.profile.summary,
                contact:{phone:user.profile.contact.phone, email:user.profile.contact.email,
                    facebook:user.profile.contact.facebook, twitter:user.profile.contact.twitter,
                    skype:user.profile.contact.skype}}}})
                .exec(function(err, user) {
                    if(err) {
                        def.reject(err);
                    } else {
                        def.resolve(user);
                    }
                });
        } else {
            def.reject('invalid update');
        }
        return def.promise;
    };
};

module.exports = UserService;