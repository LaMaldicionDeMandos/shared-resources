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
}

var service = new AuthenticationService(db);

module.exports = service;