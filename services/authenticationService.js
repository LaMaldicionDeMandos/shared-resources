/**
 * Created by boot on 3/12/16.
 */
function AuthenticationService() {
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
        return true;
    }
}

var service = new AuthenticationService();

module.exports = service;