/**
 * Created by boot on 3/12/16.
 */
var q = require('q');
function AuthenticationService(db) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.validateRegisterCredentials = function(user) {
        var isValid = true;
        if (!user.username || user.username.length == 0) isValid = false;
        if (!user.password || user.password.length == 0) isValid = false;
        if (user.rePassword != user.password) isValid = false;
        if (user.rePassword != user.password) isValid = false;
        if (!re.test(user.email)) isValid = false;
        return isValid;
    };
    this.existUser = function(user) {
        var def = q.defer();
        db.User.where({email: user.email}).count().exec(function(err, result) {
            def.resolve(result > 0);
        });
        return def.promise;
    }

    this.create = function(dto) {
        var def = q.defer();
        var building = new db.Building();
        building._id = db.ObjectId().toString();
        building.save(function(err) {
            if(err) {
                def.reject();
            }
        });
        var user = new db.User();
        user._id = db.ObjectId().toString();
        user.username = dto.username;
        user.password = dto.password;
        user.email = dto.email;
        user.role = 'root';
        user.state = 'waiting';
        user.buildingId = building._id;
        user.save(function(err) {
           if(err) {
               def.reject(err);
           } else {
               def.resolve(user);
           }
        });
        return def.promise;
    };
    var loginClosure = function(username, password, closure) {
        var def = q.defer();
        var query = {password: password};
        if(re.test(username)) {
            query.email = username;
        } else {
            query.username = username;
        }
        db.User.findOne(query).exec(function(err, user) {
            if (err) {
                def.reject(err);
            } else {
                if (!user) {
                    def.reject('not_exist');
                } else {
                    closure(user, def);
                }
            }
        });
        return def.promise;
    };
    var normalClosure = function(user, def) {
       if (user.state != 'active') {
           def.reject('inactive');
       } else {
           def.resolve(user);
       }
    };
    this.authenticate = function(username, password) {
        return loginClosure(username, password, normalClosure);
    };
    this.firstAuthenticate = function(id) {
        var def = q.defer();
        this.findById(id).then(function(user) {
            if( user.state != 'waiting') {
                def.reject(new Error('not_waiting'));
                return;
            }
            user.state = 'active';
            user.save(function(err) {
                if(err) {
                    console.log(err);
                    def.reject(err);
                } else {
                    def.resolve(user);
                }
            });
        }, function(err) {
            def.reject(err);
        });
        return def.promise;
    };

    this.findById = function(id) {
        var def = q.defer();
        db.User.findById(id).exec(function(err, user) {
            if (err) {
                def.reject(user);
            } else {
                def.resolve(user);
            }
        });
        return def.promise;
    }

    this.findByFacebookId = function(facebookId) {
        var def = q.defer();
        db.User.findOne({facebookId: facebookId}).exec(function(err, user) {
            if (err) {
                def.reject(user);
            } else {
                def.resolve(user);
            }
        });
        return def.promise;
    };
    this.findByEmail = function(email) {
        var def = q.defer();
        db.User.findOne({email: email}).exec(function(err, user) {
            if (err) {
                def.reject(user);
            } else {
                def.resolve(user);
            }
        });
        return def.promise;
    };
    this.attachUserWithFacebook = function(profile) {
        var def = q.defer();
        db.User.findOne({email: profile.emails[0].value}).exec(function(err, user) {
            if (err) {
                def.reject(err);
            } else {
                if (user) {
                    user.facebookId = profile.id;
                    user.save(function(err) {
                        if(err) {
                            def.reject(err);
                        } else {
                            def.resolve(user);
                        }
                    });
                } else {
                    def.reject('user_not_found');
                }
            }
        });
        return def.promise;
    };
}

var service = new AuthenticationService(db);

module.exports = service;