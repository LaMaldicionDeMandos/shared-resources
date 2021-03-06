/**
 * Created by boot on 3/12/16.
 */
var EmailService = require('../services/email_service');
var AuthenticationService = require('../services/authenticationService');
var authenticationService = new AuthenticationService(db);
var emailService = new EmailService(process.env.APP_PASSWORD);
var ACTIVE_USER_URL = config.host + '/user/active/';
exports.register = function(req, res) {
    var user = req.body;
    if (!authenticationService.validateRegisterCredentials(user)) {
        res.status(400).send("invalid");
    }
    else {
        var promise = authenticationService.existUser(user);
        promise.then(
            function (result) {
                if (result) {
                    res.status(400).send("already_exist_user");
                } else {
                    authenticationService.create(user).then(
                        function (_user) {
                            var email = emailService.builder(user.email, EmailService.ACTIVE_USER_TEMPLATE)
                                .withMessageParams(user.username, ACTIVE_USER_URL + _user._id).build();
                            emailService.send(email);
                            res.status(201).send();
                        },
                        function (err) {
                            res.status(400).send(err);
                        }
                    );
                }
            },
            function (err) {
                res.status(400).send(err);
            }
        );
    }
};

exports.active = function(req, res, next) {
    var id = req.params.id;
    authenticationService.firstAuthenticate(id).then(
        function(user) {
            req.body = user;
            next();
        },
        function(err) {
            next(err);
        }
    );
}

exports.authenticate = function(username, password, done) {
    console.log("Login: username: " + username);
    authenticationService.authenticate(username, password).then(
        function(user) {
            done(null, user);
        },
        function(err) {
            done(err);
        }
    );
};