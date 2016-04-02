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
        if (!re.test(username)) {
            db.User.findOne({username: username, password: password}).exec(function(err, user) {
                if (err) {
                    def.reject(user);
                } else {
                    if (!user) {
                        def.reject('not_exist');
                    } else {
                        closure(user, def);
                    }
                }
            });
        }
        return def.promise;
    };
    var normalClosure = function(user, def) {
       if (user.state != 'active') {
           def.reject('inactive');
       } else {
           def.resolve(user);
       }
    };
    var firstClosure = function(user, def) {
        if (user.state != 'waiting') {
            def.reject('active_yet');
        } else {
            def.resolve(user);
        }
    };
    this.authenticate = function(username, password) {
        return loginClosure(username, password, normalClosure);
    };
    this.firstAuthenticate = function(username, password) {
        return loginClosure(username, password, firstClosure);
    };
}

var service = new AuthenticationService(db);

module.exports = service;