/**
 * Created by boot on 3/12/16.
 */
function AuthenticationService() {
    this.validateRegisterCredentials = function(user) {
        return true;
    };
    this.existUser = function(user) {
        return true;
    }
}

var service = new AuthenticationService();

module.exports = service;